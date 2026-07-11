import { Hono } from "hono";
import { cors } from "hono/cors";
import { normalizeProperty } from "./endpoints/normalizer";
import { calculateMetrics } from "./endpoints/investorMetrics";
import { checkFhaCompliance } from "./endpoints/fhaCompliance";

const app = new Hono();

// Enable CORS
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["*"],
  exposeHeaders: ["*"]
}));

// --- FREE ENDPOINTS ---

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "sparks-re-api-clean",
    version: "1.0.0"
  });
});

app.post("/property/factual", async (c) => {
  try {
    const body = await c.req.json();
    const result = normalizeProperty(body);
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Invalid request" }, 400);
  }
});

app.post("/property/fha-compliance", async (c) => {
  try {
    const body = await c.req.json();
    const result = checkFhaCompliance(body);
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Invalid request" }, 400);
  }
});

app.post("/property/investor-metrics", async (c) => {
  try {
    const body = await c.req.json();
    const result = calculateMetrics(body);
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Invalid request" }, 400);
  }
});

export default app;
