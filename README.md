# Sparks RE API

[![smithery badge](https://smithery.ai/badge/sparks-digital/sparks-re-api)](https://smithery.ai/servers/sparks-digital/sparks-re-api)

Real estate analysis API with **x402 micropayments** on **Base L2**. Built for autonomous AI agents — no API keys, no subscriptions, just pay-per-call with USDC.

**Live at:** [`https://sparks-re-api.sparksdigital-re.workers.dev`](https://sparks-re-api.sparksdigital-re.workers.dev/health)

## What It Does

| Endpoint | Price | Description |
|----------|-------|-------------|
| `POST /property/factual` | $0.03 | Extract structured JSON from raw listing text |
| `POST /property/fha-compliance` | $0.05 | Scan for Fair Housing Act violations (50+ patterns across all 7 protected classes) |
| `POST /property/investor-metrics` | $0.10 | Calculate cap rate, cash-on-cash, DSCR, GRM, and monthly cashflow |

### Free Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /health` | API status, wallet, and pricing |
| `GET /llms.txt` | Machine-readable manifest |
| `POST /mcp` | MCP server (streamable HTTP transport) |

### MCP Server

This API is also available as an **MCP server** at `/mcp` for direct integration with AI agents and MCP clients. The MCP endpoint exposes the same three tools without the x402 payment layer:

- `normalize_property` — Extract structured property data from listing text
- `check_fha_compliance` — Scan listing text for FHA violations
- `calculate_investor_metrics` — Calculate investment metrics from financials

```json
{
  "mcpServers": {
    "sparks-re-api": {
      "url": "https://sparks-re-api.sparksdigital-re.workers.dev/mcp"
    }
  }
}
```

## How Payment Works

This API uses the [x402 protocol](https://x402.org) — the HTTP 402 standard for machine-to-machine payments:

1. Agent sends a request → receives `402 Payment Required` with a `PAYMENT-REQUIRED` header
2. Agent signs the USDC transaction with its wallet (e.g., Coinbase AgentKit)
3. Agent retries with `X-Payment` header → receives the JSON response

**No API keys. No accounts. No subscriptions.** Just autonomous USDC micropayments on Base.

## Architecture

```
Cloudflare Workers (Edge)
├── Hono Framework (Routing + CORS)
├── @x402/hono (Payment Middleware)
│   ├── Lazy initialization (deferred global fetch)
│   └── x402.org Facilitator (payment verification)
├── /property/factual → Regex-based address/specs parser
├── /property/fha-compliance → 50+ FHA violation patterns
└── /property/investor-metrics → Amortization + financial math
```

## Quick Start

```bash
# Test the health endpoint
curl https://sparks-re-api.sparksdigital-re.workers.dev/health

# Test a paid endpoint (will return 402 with payment schema)
curl -X POST https://sparks-re-api.sparksdigital-re.workers.dev/property/factual \
  -H "Content-Type: application/json" \
  -d '{"raw_text": "3bd 2ba at 789 Maple Ave, Indianapolis, IN 46220. $295,000."}'
```

## Local Development

```bash
npm install
npx wrangler dev
```

## Deploy

```bash
npx wrangler deploy
```

## Tech Stack

- **Runtime:** Cloudflare Workers (zero-cost serverless)
- **Framework:** [Hono](https://hono.dev)
- **Payments:** [@x402/hono](https://x402.org) + USDC on Base L2
- **Language:** TypeScript

## License

MIT

## Entity

Operated by **Sparks Digital LLC** (Indiana)
