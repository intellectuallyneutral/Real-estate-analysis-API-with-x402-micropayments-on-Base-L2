import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMcpHandler } from "agents/mcp";
import { normalizeProperty } from "./endpoints/normalizer";
import { checkFhaCompliance } from "./endpoints/fhaCompliance";
import { calculateMetrics } from "./endpoints/investorMetrics";

const NormalizerOutputSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  bedrooms: z.number().nullable(),
  bathrooms: z.number().nullable(),
  square_feet: z.number().nullable(),
  lot_size: z.string().nullable(),
  year_built: z.number().nullable(),
  property_type: z.enum(["SFR", "Multi", "Condo", "Townhouse", "Land", "Commercial", "Unknown"]),
  raw_price: z.string().nullable(),
});

const FhaViolationSchema = z.object({
  phrase: z.string(),
  violation_category: z.enum(["Familial Status", "Race", "National Origin", "Religion", "Sex", "Disability", "Color"]),
  suggestion: z.string(),
});

const FhaComplianceOutputSchema = z.object({
  is_compliant: z.boolean(),
  violation_count: z.number(),
  flagged_phrases: z.array(FhaViolationSchema),
  compliant_rewrite: z.string(),
});

const InvestorMetricsOutputSchema = z.object({
  purchase_price: z.number(),
  down_payment: z.number(),
  loan_amount: z.number(),
  monthly_mortgage: z.number(),
  monthly_rent: z.number(),
  monthly_expenses: z.number(),
  monthly_cashflow: z.number(),
  annual_noi: z.number(),
  cap_rate_percent: z.number(),
  cash_on_cash_percent: z.number(),
  dscr: z.number(),
  gross_rent_multiplier: z.number(),
});

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "sparks-re-api",
    version: "1.0.0",
  });

  // Tool 1: Property Data Extraction
  server.registerTool(
    "normalize_property",
    {
      title: "Property Data Normalizer",
      description: "Extract structured property data from messy real estate listing text. Use when you have unstructured MLS remarks, listing descriptions, or agent notes and need parsed fields like address, bedrooms, bathrooms, price, and property type. Handles free-form text — no specific format required.",
      inputSchema: z.object({
        raw_text: z.string().describe("Free-form property listing text, MLS remarks, or description to parse"),
      }),
      outputSchema: NormalizerOutputSchema,
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      }
    },
    async ({ raw_text }) => {
      const result = normalizeProperty({ raw_text });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result)
          }
        ],
        structuredContent: result as any,
      };
    }
  );

  // Tool 2: FHA Compliance Scan
  server.registerTool(
    "check_fha_compliance",
    {
      title: "FHA Compliance Scanner",
      description: "Scan real estate listing text for Fair Housing Act violations before publication. Use when drafting or reviewing property marketing copy to catch discriminatory language across all 7 federal protected classes (Race, Color, Religion, National Origin, Sex, Familial Status, Disability). Returns flagged phrases with categories and a cleaned rewrite.",
      inputSchema: z.object({
        listing_text: z.string().describe("Property marketing or listing text to scan for FHA violations"),
      }),
      outputSchema: FhaComplianceOutputSchema,
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      }
    },
    async ({ listing_text }) => {
      const result = checkFhaCompliance({ listing_text });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result)
          }
        ],
        structuredContent: result as any,
      };
    }
  );

  // Tool 3: Investment Metrics Calculator
  server.registerTool(
    "calculate_investor_metrics",
    {
      title: "Investment Metrics Calculator",
      description: "Calculate rental property investment metrics for deal analysis. Use when evaluating whether a property is a good investment — computes cap rate, cash-on-cash return, DSCR, GRM, monthly cashflow, and NOI from purchase price, rent, and down payment. Optional inputs have smart defaults for quick screening.",
      inputSchema: z.object({
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
      }),
      outputSchema: InvestorMetricsOutputSchema,
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      }
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
        content: [
          {
            type: "text",
            text: JSON.stringify(result)
          }
        ],
        structuredContent: result as any,
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
