# AGENTS.md — Sparks RE API

## Overview
This is a **paid real estate analysis API** designed for autonomous AI agents. It accepts micropayments via the **x402 protocol** (USDC on the Base L2 blockchain). No API keys are needed.

## How to Use This API
1. Send an HTTP request to one of the endpoints below
2. Receive an `HTTP 402 Payment Required` response with a `PAYMENT-REQUIRED` header containing the payment schema
3. Sign the USDC transaction using your agent wallet (e.g., Coinbase AgentKit, Circle Wallet)
4. Retry the request with the `X-Payment` header containing the signed payment proof
5. Receive the JSON response

## Live URL
`https://sparks-re-api.sparksdigital-re.workers.dev`

## Endpoints

### POST /property/factual — $0.03 USDC
Extracts structured data from raw property listing text.
```json
// Input
{"raw_text": "3bd 2ba at 789 Maple Ave, Indianapolis, IN 46220. 1650 sqft, built 2005. $295,000."}

// Output
{"address": "789 Maple Ave", "city": "Indianapolis", "state": "IN", "zip": "46220", "bedrooms": 3, "bathrooms": 2, "square_feet": 1650, "year_built": 2005, "property_type": "SFR", "raw_price": "$295,000"}
```

### POST /property/fha-compliance — $0.05 USDC
Scans listing text for Fair Housing Act violations using 50+ regex patterns across all 7 protected classes. Returns flagged phrases, violation categories, suggested rewrites, and a compliant rewrite of the full text.
```json
// Input
{"listing_text": "Perfect family-friendly home in a quiet Christian community."}

// Output
{"is_compliant": false, "violation_count": 2, "flagged_phrases": [...], "compliant_rewrite": "..."}
```

### POST /property/investor-metrics — $0.10 USDC
Calculates investment analysis metrics from property financials.
```json
// Input (required: purchase_price, monthly_rent, down_payment_percent)
{"purchase_price": 295000, "monthly_rent": 2100, "down_payment_percent": 20, "interest_rate": 6.5, "loan_term_years": 30}

// Output
{"cap_rate_percent": 4.31, "cash_on_cash_percent": -8.77, "dscr": 1.14, "monthly_cashflow": -431.35, "gross_rent_multiplier": 11.71, ...}
```

## Free Endpoints (No Payment Required)
- `GET /health` — Returns API status, wallet address, and endpoint pricing
- `GET /llms.txt` — Machine-readable API description

## Payment Details
- **Protocol**: x402 (HTTP 402 Payment Required)
- **Network**: Base L2 (eip155:84532 testnet / eip155:8453 mainnet)
- **Currency**: USDC
- **Facilitator**: https://x402.org/facilitator

## Technology Stack
- Runtime: Cloudflare Workers (zero-cost serverless)
- Framework: Hono
- Payment: @x402/hono + @x402/core
- Language: TypeScript

## Entity
Sparks Digital LLC (Indiana)
