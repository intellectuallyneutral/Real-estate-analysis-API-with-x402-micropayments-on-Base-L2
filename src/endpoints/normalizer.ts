import { NormalizerInput, NormalizerOutput } from "../utils/schemas";

export function normalizeProperty(input: NormalizerInput): NormalizerOutput {
  const text = input.raw_text;

  // Initialize output
  const result: NormalizerOutput = {
    address: "",
    city: "",
    state: "",
    zip: "",
    bedrooms: null,
    bathrooms: null,
    square_feet: null,
    lot_size: null,
    year_built: null,
    property_type: "Unknown",
    raw_price: null
  };

  // --- PARSE PRICE ---
  const priceRegex = /\$\s*([\d,]+(?:\.\d{2})?)/;
  const priceMatch = text.match(priceRegex);
  if (priceMatch) {
    result.raw_price = "$" + priceMatch[1];
  }

  // --- PARSE BEDROOMS ---
  const bedsRegex = /(\d+)\s*(?:bd|bed|beds|br|bedroom|bedrooms)/i;
  const bedsMatch = text.match(bedsRegex);
  if (bedsMatch) {
    result.bedrooms = parseInt(bedsMatch[1], 10);
  }

  // --- PARSE BATHROOMS ---
  const bathsRegex = /(\d+(?:\.5)?)\s*(?:ba|bath|baths|bathroom|bathrooms)/i;
  const bathsMatch = text.match(bathsRegex);
  if (bathsMatch) {
    result.bathrooms = parseFloat(bathsMatch[1]);
  }

  // --- PARSE SQUARE FEET ---
  const sqftRegex = /([\d,]+)\s*(?:sq\.?\s*ft|sqft|square\s*feet)/i;
  const sqftMatch = text.match(sqftRegex);
  if (sqftMatch) {
    result.square_feet = parseInt(sqftMatch[1].replace(/,/g, ""), 10);
  }

  // --- PARSE YEAR BUILT ---
  const yearRegex = /(?:built\s*(?:in\s*)?|year\s*built\s*:?\s*)(\d{4})/i;
  const yearMatch = text.match(yearRegex);
  if (yearMatch) {
    result.year_built = parseInt(yearMatch[1], 10);
  }

  // --- PARSE LOT SIZE ---
  const lotRegex = /([\d.]+)\s*(?:acres?|ac\b|sq\.?\s*ft\s*lot)/i;
  const lotMatch = text.match(lotRegex);
  if (lotMatch) {
    result.lot_size = lotMatch[0].trim();
  }

  // --- PARSE PROPERTY TYPE ---
  const typeText = text.toLowerCase();
  if (typeText.includes("single family") || typeText.includes("sfr") || typeText.includes("house")) {
    result.property_type = "SFR";
  } else if (typeText.includes("condo") || typeText.includes("condominium")) {
    result.property_type = "Condo";
  } else if (typeText.includes("townhouse") || typeText.includes("townhome")) {
    result.property_type = "Townhouse";
  } else if (typeText.includes("duplex") || typeText.includes("triplex") || typeText.includes("fourplex") || typeText.includes("multi-family") || typeText.includes("multifamily") || typeText.includes("multi family")) {
    result.property_type = "Multi";
  } else if (typeText.includes("land") || typeText.includes("lot\b") || typeText.includes("acreage")) {
    result.property_type = "Land";
  } else if (typeText.includes("commercial") || typeText.includes("office") || typeText.includes("retail") || typeText.includes("warehouse")) {
    result.property_type = "Commercial";
  }

  // --- PARSE ADDRESS ---
  // Look for a standard US address pattern: 123 Main St, City, ST 12345
  const addressRegex = /(\d+[\w\s.-]+?),\s*([A-Za-z\s.-]+?),\s*([A-Z]{2})\s*(\d{5})?/;
  const addressMatch = text.match(addressRegex);
  if (addressMatch) {
    result.address = addressMatch[1].trim();
    result.city = addressMatch[2].trim();
    result.state = addressMatch[3].trim();
    result.zip = addressMatch[4] ? addressMatch[4].trim() : "";
  } else {
    // Attempt secondary less structured match if comma separator is missing
    const simpleAddressRegex = /(\d+\s+[A-Za-z0-9\s.]+?)\s+([A-Za-z\s]+)\s+([A-Z]{2})\s*(\d{5})?/;
    const simpleMatch = text.match(simpleAddressRegex);
    if (simpleMatch) {
      result.address = simpleMatch[1].trim();
      result.city = simpleMatch[2].trim();
      result.state = simpleMatch[3].trim();
      result.zip = simpleMatch[4] ? simpleMatch[4].trim() : "";
    }
  }

  return result;
}
