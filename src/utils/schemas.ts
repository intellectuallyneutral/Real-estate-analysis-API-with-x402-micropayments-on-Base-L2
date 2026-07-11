// --- INPUT TYPES ---

export interface NormalizerInput {
  raw_text: string;
}

export interface InvestorMetricsInput {
  purchase_price: number;
  monthly_rent: number;
  down_payment_percent: number;
  interest_rate?: number;      // defaults to 7.0
  loan_term_years?: number;    // defaults to 30
  annual_taxes?: number;       // defaults to 1.2% of price
  annual_insurance?: number;   // defaults to 1200
  vacancy_rate?: number;       // defaults to 0.08 (8%)
  management_fee?: number;     // defaults to 0.10 (10%)
  estimated_repairs?: number;  // defaults to 0
}

export interface FhaComplianceInput {
  listing_text: string;
}

// --- OUTPUT TYPES ---

export interface NormalizerOutput {
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: string | null;
  year_built: number | null;
  property_type: "SFR" | "Multi" | "Condo" | "Townhouse" | "Land" | "Commercial" | "Unknown";
  raw_price: string | null;
}

export interface InvestorMetricsOutput {
  purchase_price: number;
  down_payment: number;
  loan_amount: number;
  monthly_mortgage: number;
  monthly_rent: number;
  monthly_expenses: number;
  monthly_cashflow: number;
  annual_noi: number;
  cap_rate_percent: number;
  cash_on_cash_percent: number;
  dscr: number;
  gross_rent_multiplier: number;
}

export interface FhaViolation {
  phrase: string;
  violation_category: "Familial Status" | "Race" | "National Origin" | "Religion" | "Sex" | "Disability" | "Color";
  suggestion: string;
}

export interface FhaComplianceOutput {
  is_compliant: boolean;
  violation_count: number;
  flagged_phrases: FhaViolation[];
  compliant_rewrite: string;
}
