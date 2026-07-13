import { Hono } from "hono";
import { cors } from "hono/cors";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { declareDiscoveryExtension } from "@x402/extensions/bazaar";
import { normalizeProperty } from "./endpoints/normalizer";
import { calculateMetrics } from "./endpoints/investorMetrics";
import { checkFhaCompliance } from "./endpoints/fhaCompliance";
import { landingPageHtml } from "./utils/landingPageHtml";
import { analyzePropertyImage } from "./endpoints/imageAnalyzer";

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
  },
  "POST /property/analyze-image": {
    accepts: {
      scheme: "exact",
      price: "$0.15",
      network: NETWORK,
      payTo: WALLET_ADDRESS,
    },
    description: "Upload a screenshot of a real estate property listing. Uses multimodal AI to extract property specs, run FHA compliance scanning, and calculate investor returns in a single consolidated report. Cost: $0.15 USDC.",
    extensions: {
      ...declareDiscoveryExtension({
        input: { image: "data:image/png;base64,iVBOR...", mime_type: "image/png" },
        inputSchema: {
          type: "object",
          properties: {
            image: { type: "string", description: "Base64-encoded image string of the listing screenshot" },
            mime_type: { type: "string", description: "Mime type of the image (default image/png)" }
          },
          required: ["image"]
        },
        bodyType: "json",
        output: {
          example: {
            listing_data: { address: "789 Maple Ave", city: "Indianapolis", state: "IN", zip: "46220", bedrooms: 3, bathrooms: 2, square_feet: 1850, lot_size: "0.25 acres", year_built: 1998, property_type: "SFR", raw_price: "$295,000", monthly_rent: 2200 },
            fha_report: { is_compliant: true, violation_count: 0, flagged_phrases: [], compliant_rewrite: "..." },
            investor_metrics: { purchase_price: 295000, down_payment: 59000, loan_amount: 236000, monthly_mortgage: 1569.96, monthly_expenses: 2132.96, monthly_cashflow: 67.04, annual_noi: 20112, cap_rate_percent: 6.82, cash_on_cash_percent: 1.36, dscr: 1.25, gross_rent_multiplier: 11.17 }
          }
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

// Root route — HTML landing page
app.get("/", (c) => {
  return c.html(landingPageHtml);
});

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
      { path: "/property/investor-metrics", price: "$0.10", method: "POST" },
      { path: "/property/analyze-image", price: "$0.15", method: "POST" }
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

// OpenAPI 3.1 specification — agents and crawlers use this to understand endpoints, pricing, and payment headers
app.get("/openapi.json", (c) => {
  return c.json({
    openapi: "3.1.0",
    info: {
      title: "Sparks RE API",
      version: "1.0.0",
      description: "Real estate analysis API with x402 micropayments on Base L2. Three tools: property data extraction, FHA compliance scanning, and investment metrics. Operated by Sparks Digital LLC (Indiana).",
      contact: { email: "sparksdigitalllc@email.com" }
    },
    servers: [
      { url: "https://sparks-re-api.sparksdigital-re.workers.dev", description: "Production (Cloudflare Workers edge)" }
    ],
    paths: {
      "/property/factual": {
        post: {
          summary: "Extract structured property data from listing text",
          description: "Parses address, bed/bath, sqft, lot_size, year_built, property_type, and price from free-form text using regex. Cost: $0.03 USDC via x402 on Base (eip155:8453).",
          operationId: "normalizeProperty",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["raw_text"],
                  properties: {
                    raw_text: { type: "string", description: "Free-form property listing text to parse" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Structured property data extracted successfully" },
            "400": { description: "Missing or invalid raw_text field" },
            "402": {
              description: "Payment Required — x402 challenge. Send X-Payment header with USDC payment on Base (eip155:8453) to wallet 0x8966A2aAe40e008f1f52962683Cb5D22aa700fb7. Price: $0.03.",
              headers: {
                "X-Payment": { description: "x402 payment challenge details", schema: { type: "string" } }
              }
            }
          }
        }
      },
      "/property/fha-compliance": {
        post: {
          summary: "Scan listing text for Fair Housing Act violations",
          description: "Checks listing copy against 50+ discriminatory patterns across all 7 federal protected classes (Race, Color, Religion, National Origin, Sex, Familial Status, Disability). Returns flagged phrases and compliant rewrite. Cost: $0.05 USDC via x402 on Base (eip155:8453).",
          operationId: "checkFhaCompliance",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["listing_text"],
                  properties: {
                    listing_text: { type: "string", description: "Property marketing copy to scan for FHA violations" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "FHA compliance scan results with flagged phrases and compliant rewrite" },
            "400": { description: "Missing or invalid listing_text field" },
            "402": {
              description: "Payment Required — x402 challenge. Send X-Payment header with USDC payment on Base (eip155:8453) to wallet 0x8966A2aAe40e008f1f52962683Cb5D22aa700fb7. Price: $0.05.",
              headers: {
                "X-Payment": { description: "x402 payment challenge details", schema: { type: "string" } }
              }
            }
          }
        }
      },
      "/property/investor-metrics": {
        post: {
          summary: "Calculate real estate investment metrics",
          description: "Calculates cap rate, cash-on-cash return, DSCR, GRM, monthly cashflow, and NOI from property financials. Smart defaults for optional fields. Cost: $0.10 USDC via x402 on Base (eip155:8453).",
          operationId: "calculateInvestorMetrics",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["purchase_price", "monthly_rent", "down_payment_percent"],
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
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Investment metrics calculated successfully" },
            "400": { description: "Missing or invalid required fields" },
            "402": {
              description: "Payment Required — x402 challenge. Send X-Payment header with USDC payment on Base (eip155:8453) to wallet 0x8966A2aAe40e008f1f52962683Cb5D22aa700fb7. Price: $0.10.",
              headers: {
                "X-Payment": { description: "x402 payment challenge details", schema: { type: "string" } }
              }
            }
          }
        }
      },
      "/health": {
        get: {
          summary: "Health check",
          description: "Returns server status, wallet address, network, and endpoint listing. Free — no payment required.",
          operationId: "healthCheck",
          responses: { "200": { description: "Server status and endpoint listing" } }
        }
      },
      "/llms.txt": {
        get: {
          summary: "Machine-readable API description",
          description: "Returns a structured text manifest describing all endpoints, pricing, and usage for AI agent consumption. Free — no payment required.",
          operationId: "llmsTxt",
          responses: { "200": { description: "Plain text API manifest" } }
        }
      },
      "/mcp": {
        post: {
          summary: "MCP server endpoint",
          description: "Model Context Protocol endpoint using streamable HTTP transport. Exposes 3 tools: normalize_property, check_fha_compliance, calculate_investor_metrics. Free — no payment required (tools call logic directly).",
          operationId: "mcpServer",
          responses: { "200": { description: "MCP response" } }
        }
      }
    },
    "x-x402": {
      protocol: "x402",
      network: "eip155:8453",
      networkName: "Base Mainnet",
      token: "USDC",
      facilitator: "https://x402.org/facilitator",
      payTo: WALLET_ADDRESS
    }
  });
});

// Legacy GPT plugin manifest — backward compatibility with older agent frameworks
app.get("/.well-known/ai-plugin.json", (c) => {
  return c.json({
    schema_version: "v1",
    name_for_human: "Sparks RE API",
    name_for_model: "sparks_re_api",
    description_for_human: "Real estate analysis tools: property data extraction from listing text, FHA compliance scanning across 7 protected classes, and investment metrics (cap rate, DSCR, cash-on-cash, GRM). Micropayments via x402 on Base L2.",
    description_for_model: "Use this plugin to analyze real estate properties. Three tools: (1) normalize_property extracts structured data (address, beds, baths, sqft, price, type) from unstructured listing text, (2) check_fha_compliance scans listing copy for Fair Housing Act violations across 7 protected classes and returns flagged phrases with a compliant rewrite, (3) calculate_investor_metrics computes cap rate, cash-on-cash return, DSCR, GRM, monthly cashflow from purchase price, rent, and down payment. Payment via x402 protocol (USDC on Base Mainnet). No API keys required.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: "https://sparks-re-api.sparksdigital-re.workers.dev/openapi.json",
      is_user_authenticated: false
    },
    logo_url: "https://sparks-re-api.sparksdigital-re.workers.dev/logo.png",
    contact_email: "sparksdigitalllc@email.com",
    legal_info_url: "https://github.com/intellectuallyneutral/Real-estate-analysis-API-with-x402-micropayments-on-Base-L2/blob/main/LICENSE"
  });
});

// --- MCP SERVER ---
import { getMcpHandler } from "./mcp";
const mcpHandler = getMcpHandler();
app.all("/mcp", async (c) => {
  return mcpHandler(c.req.raw, c.env, c.executionCtx as any);
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

// Consolidated image analysis handler helper
function processConsolidatedAnalysis(result: any) {
  // 1. Run FHA check if a description is present
  let fhaReport = null;
  if (result.listing_description) {
    fhaReport = checkFhaCompliance({ listing_text: result.listing_description });
  }

  // 2. Run investor metrics if purchase price is found
  let investorMetrics = null;
  const priceString = result.raw_price ? result.raw_price.replace(/[^0-9.]/g, "") : "";
  const price = priceString ? parseFloat(priceString) : NaN;
  const rent = result.monthly_rent ? parseFloat(String(result.monthly_rent)) : NaN;

  if (!isNaN(price) && price > 0) {
    // If rent is not present, estimate it at 0.8% of purchase price as a smart default
    const estimatedRent = !isNaN(rent) && rent > 0 ? rent : price * 0.008;
    investorMetrics = calculateMetrics({
      purchase_price: price,
      monthly_rent: estimatedRent,
      down_payment_percent: 20
    });
  }

  const { listing_description, ...cleanListingData } = result;

  return {
    listing_data: cleanListingData,
    fha_report: fhaReport,
    investor_metrics: investorMetrics
  };
}

// Paid Image Analyzer Endpoint (x402 protected)
app.post("/property/analyze-image", lazyPaymentMiddleware(), async (c) => {
  try {
    const body = await c.req.json();
    if (!body.image || typeof body.image !== "string") {
      return c.json({ error: "Missing required field: image (base64 string)" }, 400);
    }
    const apiKey = (c.env as any).GEMINI_API_KEY;
    if (!apiKey) {
      return c.json({ error: "Server configuration error: Gemini API key is missing." }, 500);
    }
    const rawResult = await analyzePropertyImage(body.image, body.mime_type, apiKey);
    const consolidated = processConsolidatedAnalysis(rawResult);
    return c.json({ ...consolidated, disclaimer: "Automated AI extraction and rule-based calculations. Estimates only, not legal or financial advice. Verify all values." });
  } catch (e: any) {
    console.error("Image analysis endpoint error:", e);
    return c.json({ error: e.message || "Failed to analyze property image" }, 500);
  }
});

// Free Trial Endpoint for Sandbox Interface (no payment middleware)
app.post("/property/free-trial", async (c) => {
  try {
    const body = await c.req.json();
    const action = body.action;

    if (action === "fha") {
      if (!body.listing_text || typeof body.listing_text !== "string") {
        return c.json({ error: "Missing listing_text" }, 400);
      }
      return c.json(checkFhaCompliance(body));
    } else if (action === "normalize") {
      if (!body.raw_text || typeof body.raw_text !== "string") {
        return c.json({ error: "Missing raw_text" }, 400);
      }
      return c.json(normalizeProperty(body));
    } else if (action === "calculator") {
      if (body.purchase_price === undefined || body.monthly_rent === undefined || body.down_payment_percent === undefined) {
        return c.json({ error: "Missing required calculator fields" }, 400);
      }
      return c.json(calculateMetrics({
        purchase_price: parseFloat(body.purchase_price),
        monthly_rent: parseFloat(body.monthly_rent),
        down_payment_percent: parseFloat(body.down_payment_percent),
        interest_rate: body.interest_rate !== undefined ? parseFloat(body.interest_rate) : undefined
      }));
    } else {
      return c.json({ error: "Invalid action" }, 400);
    }
  } catch (e) {
    return c.json({ error: "Failed to process sandbox action" }, 400);
  }
});

// Free Trial Image Endpoint for Sandbox Interface
app.post("/property/free-trial-image", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.image || typeof body.image !== "string") {
      return c.json({ error: "Missing image base64 data" }, 400);
    }
    const apiKey = (c.env as any).GEMINI_API_KEY;
    if (!apiKey) {
      return c.json({ error: "Server configuration error: Gemini API key is missing." }, 500);
    }
    const rawResult = await analyzePropertyImage(body.image, body.mime_type, apiKey);
    const consolidated = processConsolidatedAnalysis(rawResult);
    return c.json(consolidated);
  } catch (e: any) {
    console.error("Free trial image error:", e);
    return c.json({ error: e.message || "Failed to analyze image" }, 500);
  }
});

export default app;
