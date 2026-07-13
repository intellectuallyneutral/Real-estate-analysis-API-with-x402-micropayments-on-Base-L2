import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMcpHandler } from "agents/mcp";
import { normalizeProperty } from "./endpoints/normalizer";
import { checkFhaCompliance } from "./endpoints/fhaCompliance";
import { calculateMetrics } from "./endpoints/investorMetrics";

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "sparks-re-api",
    version: "1.0.0",
  });

  // Tool 1: Property Data Extraction
  server.tool(
    "normalize_property",
    "Extract structured property data from messy real estate listing text. Use when you have unstructured MLS remarks, listing descriptions, or agent notes and need parsed fields like address, bedrooms, bathrooms, price, and property type. Handles free-form text — no specific format required.",
    {
      raw_text: z.string().describe("Free-form property listing text, MLS remarks, or description to parse"),
    },
    async ({ raw_text }) => {
      const result = normalizeProperty({ raw_text });
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        }],
      };
    }
  );

  // Tool 2: FHA Compliance Scan
  server.tool(
    "check_fha_compliance",
    "Scan real estate listing text for Fair Housing Act violations before publication. Use when drafting or reviewing property marketing copy to catch discriminatory language across all 7 federal protected classes (Race, Color, Religion, National Origin, Sex, Familial Status, Disability). Returns flagged phrases with categories and a cleaned rewrite.",
    {
      listing_text: z.string().describe("Property marketing or listing text to scan for FHA violations"),
    },
    async ({ listing_text }) => {
      const result = checkFhaCompliance({ listing_text });
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        }],
      };
    }
  );

  // Tool 3: Investment Metrics Calculator
  server.tool(
    "calculate_investor_metrics",
    "Calculate rental property investment metrics for deal analysis. Use when evaluating whether a property is a good investment — computes cap rate, cash-on-cash return, DSCR, GRM, monthly cashflow, and NOI from purchase price, rent, and down payment. Optional inputs have smart defaults for quick screening.",
    {
      purchase_price: z.number().describe("Property purchase price in dollars"),
      monthly_rent: z.number().describe("Expected monthly rental income in dollars"),
      down_payment_percent: z.number().describe("Down payment as percentage (0-100)"),
      interest_rate: z.number().optional().describe("Annual interest rate percentage (default: 7%)"),
      loan_term_years: z.number().optional().describe("Loan term in years (default: 30)"),
      annual_taxes: z.number().optional().describe("Annual property taxes in dollars (default: 1.2% of price)"),
      annual_insurance: z.number().optional().describe("Annual insurance cost in dollars (default: $1200)"),
      vacancy_rate: z.number().optional().describe("Vacancy rate as decimal (default: 0.08 = 8%)"),
      management_fee: z.number().optional().describe("Management fee as decimal (default: 0.10 = 10%)"),
      estimated_repairs: z.number().optional().describe("Annual repair/maintenance cost in dollars (default: $0)"),
    },
    async (params) => {
      const result = calculateMetrics({
        purchase_price: params.purchase_price,
        monthly_rent: params.monthly_rent,
        down_payment_percent: params.down_payment_percent,
        interest_rate: params.interest_rate,
        loan_term_years: params.loan_term_years,
        annual_taxes: params.annual_taxes,
        annual_insurance: params.annual_insurance,
        vacancy_rate: params.vacancy_rate,
        management_fee: params.management_fee,
        estimated_repairs: params.estimated_repairs,
      });
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        }],
      };
    }
  );

  return server;
}

export function getMcpHandler() {
  return (request: Request, env: unknown, ctx: ExecutionContext) => {
    const server = createMcpServer();
    return createMcpHandler(server)(request, env, ctx);
  };
}
