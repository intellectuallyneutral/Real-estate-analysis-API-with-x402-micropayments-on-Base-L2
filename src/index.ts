import { Hono } from "hono";
import { cors } from "hono/cors";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { declareDiscoveryExtension } from "@x402/extensions/bazaar";
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
const NETWORK = "eip155:8453"; // Base Mainnet

// --- PAID ENDPOINTS CONFIGURATION ---
const x402Config = {
  "POST /property/factual": {
    accepts: {
      scheme: "exact",
      price: "$0.03",
      network: NETWORK,
      payTo: WALLET_ADDRESS,
    },
    description: "Extract structured property data from unstructured real estate listing text. Parses address, city, state, zip, bedrooms, bathrooms, square_feet, lot_size, year_built, property_type, and raw_price from free-form descriptions, MLS remarks, or listing copy. Uses regex pattern matching — verify parsed values before transactional use.",
    extensions: {
      ...declareDiscoveryExtension({
        input: { raw_text: "3bd 2ba at 789 Maple Ave, Indianapolis, IN 46220. $295,000. Built 1998. 1,850 sqft single family home on 0.25 acres." },
        inputSchema: {
          type: "object",
          properties: {
            raw_text: { type: "string", description: "Free-form property listing text to parse" }
          },
          required: ["raw_text"]
        },
        bodyType: "json",
        output: {
          example: { address: "789 Maple Ave", city: "Indianapolis", state: "IN", zip: "46220", bedrooms: 3, bathrooms: 2, square_feet: 1850, lot_size: "0.25 acres", year_built: 1998, property_type: "SFR", raw_price: "$295,000" }
        }
      })
    }
  },
  "POST /property/fha-compliance": {
    accepts: {
      scheme: "exact",
      price: "$0.05",
      network: NETWORK,
      payTo: WALLET_ADDRESS,
    },
    description: "Scan real estate listing text for Fair Housing Act violations across all 7 federal protected classes: Race, Color, Religion, National Origin, Sex, Familial Status, and Disability. Returns flagged phrases with categories and suggestions, plus a compliant rewrite. Scans 50+ discriminatory patterns. Automated screening — not legal advice.",
    extensions: {
      ...declareDiscoveryExtension({
        input: { listing_text: "Perfect for a Christian family! No children allowed. Walking distance to church." },
        inputSchema: {
          type: "object",
          properties: {
            listing_text: { type: "string", description: "Property marketing copy to scan for FHA violations" }
          },
          required: ["listing_text"]
        },
        bodyType: "json",
        output: {
          example: { is_compliant: false, violation_count: 2, flagged_phrases: [{ phrase: "Christian family", violation_category: "Religion", suggestion: "all families" }, { phrase: "No children", violation_category: "Familial Status", suggestion: "[remove phrase]" }], compliant_rewrite: "Perfect for all families! Walking distance to local amenities." }
        }
      })
    }
  },
  "POST /property/investor-metrics": {
    accepts: {
      scheme: "exact",
      price: "$0.10",
      network: NETWORK,
      payTo: WALLET_ADDRESS,
    },
    description: "Calculate real estate investment metrics from property financials. Required: purchase_price, monthly_rent, down_payment_percent. Returns cap_rate, cash_on_cash, DSCR, gross_rent_multiplier, monthly_cashflow, mortgage, expenses, and annual_noi. Optional inputs have smart defaults (7% rate, 30yr term, 8% vacancy, 10% management). Not financial advice.",
    extensions: {
      ...declareDiscoveryExtension({
        input: { purchase_price: 250000, monthly_rent: 2000, down_payment_percent: 20 },
        inputSchema: {
          type: "object",
          properties: {
            purchase_price: { type: "number", description: "Purchase price in dollars" },
            monthly_rent: { type: "number", description: "Monthly rental income in dollars" },
            down_payment_percent: { type: "number", description: "Down payment percentage (0-100)" },
            interest_rate: { type: "number", description: "Annual rate % (default 7)" },
            loan_term_years: { type: "number", description: "Loan term years (default 30)" },
            annual_taxes: { type: "number", description: "Annual taxes (default 1.2% of price)" },
            annual_insurance: { type: "number", description: "Annual insurance (default $1200)" },
            vacancy_rate: { type: "number", description: "Vacancy rate decimal (default 0.08)" },
            management_fee: { type: "number", description: "Management fee decimal (default 0.10)" },
            estimated_repairs: { type: "number", description: "Annual repairs (default $0)" }
          },
          required: ["purchase_price", "monthly_rent", "down_payment_percent"]
        },
        bodyType: "json",
        output: {
          example: { cap_rate_percent: 7.78, cash_on_cash_percent: 5.42, dscr: 1.35, gross_rent_multiplier: 10.42, monthly_cashflow: 225.83, monthly_mortgage: 1330.60, monthly_expenses: 1774.17, annual_noi: 19440, down_payment: 50000, loan_amount: 200000 }
        }
      })
    }
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
> Real estate analysis tools: property data extraction, FHA compliance scanning, and investment metrics calculation.
> Operated by Sparks Digital LLC (Indiana). No API keys required.
> Payment: x402 protocol (USDC on Base L2). All endpoints return JSON.

## POST /property/factual — $0.03
Extract structured property data from unstructured listing text.
Input: {"raw_text": "<any free-form property description, MLS remarks, or listing copy>"}
Output: {address, city, state, zip, bedrooms, bathrooms, square_feet, lot_size, year_built, property_type, raw_price}
Property types: SFR, Multi, Condo, Townhouse, Land, Commercial, Unknown.
Uses regex pattern matching. Verify parsed values against source before transactional use.

## POST /property/fha-compliance — $0.05
Scan listing text for Fair Housing Act violations across all 7 protected classes (Race, Color, Religion, National Origin, Sex, Familial Status, Disability).
Input: {"listing_text": "<property marketing copy to scan>"}
Output: {is_compliant, violation_count, flagged_phrases: [{phrase, violation_category, suggestion}], compliant_rewrite}
Scans 50+ discriminatory patterns. Returns cleaned rewrite with violations removed. Automated screening tool — not legal advice.

## POST /property/investor-metrics — $0.10
Calculate investment metrics from property financials.
Required: {"purchase_price": number, "monthly_rent": number, "down_payment_percent": number}
Optional (smart defaults): interest_rate (7%), loan_term_years (30), annual_taxes (1.2% of price), annual_insurance ($1200), vacancy_rate (8%), management_fee (10%), estimated_repairs ($0)
Output: {cap_rate_percent, cash_on_cash_percent, dscr, gross_rent_multiplier, monthly_cashflow, monthly_mortgage, monthly_expenses, annual_noi, down_payment, loan_amount}
All values rounded to 2 decimal places. Estimates only — not financial advice.

## Authentication
No API keys. Payment via x402 HTTP headers (USDC on Base). Send payment header with request; 402 challenge returned if missing.

## Contact
Sparks Digital LLC — sparksdigitalllc@email.com
`);
});

// --- MCP SERVER ---
import { getMcpHandler } from "./mcp";
const mcpHandler = getMcpHandler();
app.all("/mcp", async (c) => {
  return mcpHandler(c.req.raw, c.env, c.executionCtx);
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
    return c.json({ ...result, disclaimer: "Automated extraction via regex pattern matching. Verify all parsed values against original source before use in any transaction." });
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
    return c.json({ ...result, disclaimer: "Automated screening tool only. Not legal advice. This analysis uses pattern matching against common Fair Housing Act violation phrases and does not constitute a legal compliance review. Consult a licensed attorney for official FHA compliance guidance." });
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

    return c.json({ ...result, disclaimer: "Estimates based on provided inputs and standard formulas. Not financial advice. Actual returns may vary based on market conditions, property specifics, and factors not captured in this model. Consult a licensed financial advisor before making investment decisions." });
  } catch (e) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

export default app;
