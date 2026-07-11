import { Hono } from "hono";
import { cors } from "hono/cors";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { normalizeProperty } from "./endpoints/normalizer";
import { calculateMetrics } from "./endpoints/investorMetrics";
import { checkFhaCompliance } from "./endpoints/fhaCompliance";

const app = new Hono();

// Custom error handler to bubble up stack traces for diagnostics
app.onError((err, c) => {
  console.error("Hono encountered error:", err);
  return c.json({
    error: err.message,
    name: err.name,
    stack: err.stack
  }, 500);
});

// Enable CORS for agent compatibility
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["*"],
  exposeHeaders: ["*"]
}));

// --- WALLET & PROTOCOL CONFIG ---
const WALLET_ADDRESS = "0x8966A2aAe40e008f1f52962683Cb5D22aa700fb7"; 
const FACILITATOR_URL = "https://x402.org/facilitator";
const NETWORK = "eip155:84532"; // Base Sepolia for testing. Use eip155:8453 for Base Mainnet.

// --- PAID ENDPOINTS CONFIGURATION ---
const x402Config = {
  "POST /property/factual": {
    accepts: {
      scheme: "exact",
      price: "$0.03",
      network: NETWORK,
      payTo: WALLET_ADDRESS,
    },
    description: "Normalize raw property text into structured JSON",
  },
  "POST /property/fha-compliance": {
    accepts: {
      scheme: "exact",
      price: "$0.05",
      network: NETWORK,
      payTo: WALLET_ADDRESS,
    },
    description: "Check listing text for Fair Housing Act violations",
  },
  "POST /property/investor-metrics": {
    accepts: {
      scheme: "exact",
      price: "$0.10",
      network: NETWORK,
      payTo: WALLET_ADDRESS,
    },
    description: "Calculate cap rate, cash-on-cash return, DSCR, and monthly cashflow",
  }
};

// Lazy initialization cache for the x402 middleware
let cachedPaymentMiddleware: any = null;

function getPaymentMiddleware() {
  if (!cachedPaymentMiddleware) {
    const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
    const resourceServer = new x402ResourceServer(facilitatorClient)
      .register(NETWORK, new ExactEvmScheme());
    
    cachedPaymentMiddleware = paymentMiddleware(x402Config as any, resourceServer);
  }
  return cachedPaymentMiddleware;
}

// Wrapper middleware to defer x402 initialization until the first paid request is processed
const lazyPaymentMiddleware = () => {
  return async (c: any, next: any) => {
    const mw = getPaymentMiddleware();
    return await mw(c, next);
  };
};

// --- FREE ENDPOINTS ---

// Health check — agents use this to verify the server is alive
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "sparks-re-api",
    version: "1.0.0",
    wallet: WALLET_ADDRESS,
    network: NETWORK,
    endpoints: [
      { path: "/property/factual", price: "$0.03", method: "POST" },
      { path: "/property/fha-compliance", price: "$0.05", method: "POST" },
      { path: "/property/investor-metrics", price: "$0.10", method: "POST" }
    ]
  });
});

// llms.txt — machine-readable API description
app.get("/llms.txt", (c) => {
  return c.text(`# Sparks RE API
> Real estate data normalization, FHA compliance checking, and investment metrics.
> Operated by Sparks Digital LLC (Indiana).
> Payment: x402 protocol (USDC on Base network).

## Endpoints
- POST /property/factual ($0.03) — Normalize raw property text into structured JSON
- POST /property/fha-compliance ($0.05) — Check listing text for Fair Housing Act violations
- POST /property/investor-metrics ($0.10) — Calculate cap rate, cash-on-cash, DSCR, cashflow

## Authentication
No API keys. Payment via x402 HTTP headers (USDC on Base).

## Contact
Sparks Digital LLC — sparksdigitalllc@email.com
`);
});

// --- ROUTE IMPLEMENTATIONS ---

// Property Normalizer
app.post("/property/factual", lazyPaymentMiddleware(), async (c) => {
  try {
    const body = await c.req.json();
    if (!body.raw_text || typeof body.raw_text !== "string") {
      return c.json({ error: "Missing required field: raw_text (string)" }, 400);
    }
    const result = normalizeProperty(body);
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// FHA Compliance
app.post("/property/fha-compliance", lazyPaymentMiddleware(), async (c) => {
  try {
    const body = await c.req.json();
    if (!body.listing_text || typeof body.listing_text !== "string") {
      return c.json({ error: "Missing required field: listing_text (string)" }, 400);
    }
    const result = checkFhaCompliance(body);
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// Investor Metrics
app.post("/property/investor-metrics", lazyPaymentMiddleware(), async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate inputs
    if (body.purchase_price === undefined || body.monthly_rent === undefined || body.down_payment_percent === undefined) {
      return c.json({ error: "Required fields: purchase_price, monthly_rent, down_payment_percent" }, 400);
    }
    
    const purchase_price = parseFloat(body.purchase_price);
    const monthly_rent = parseFloat(body.monthly_rent);
    const down_payment_percent = parseFloat(body.down_payment_percent);

    if (isNaN(purchase_price) || purchase_price <= 0) {
      return c.json({ error: "purchase_price must be a positive number" }, 400);
    }
    if (isNaN(monthly_rent) || monthly_rent <= 0) {
      return c.json({ error: "monthly_rent must be a positive number" }, 400);
    }
    if (isNaN(down_payment_percent) || down_payment_percent < 0 || down_payment_percent > 100) {
      return c.json({ error: "down_payment_percent must be a number between 0 and 100" }, 400);
    }

    const result = calculateMetrics({
      purchase_price,
      monthly_rent,
      down_payment_percent,
      interest_rate: body.interest_rate !== undefined ? parseFloat(body.interest_rate) : undefined,
      loan_term_years: body.loan_term_years !== undefined ? parseFloat(body.loan_term_years) : undefined,
      annual_taxes: body.annual_taxes !== undefined ? parseFloat(body.annual_taxes) : undefined,
      annual_insurance: body.annual_insurance !== undefined ? parseFloat(body.annual_insurance) : undefined,
      vacancy_rate: body.vacancy_rate !== undefined ? parseFloat(body.vacancy_rate) : undefined,
      management_fee: body.management_fee !== undefined ? parseFloat(body.management_fee) : undefined,
      estimated_repairs: body.estimated_repairs !== undefined ? parseFloat(body.estimated_repairs) : undefined
    });

    return c.json(result);
  } catch (e) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

export default app;
