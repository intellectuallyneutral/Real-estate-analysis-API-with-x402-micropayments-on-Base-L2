import { NormalizerOutput } from "../utils/schemas";

export interface ImageAnalysisResult extends NormalizerOutput {
  monthly_rent: number | null;
  listing_description: string | null;
}

export async function analyzePropertyImage(
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<ImageAnalysisResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // Strip any data:image/png;base64, prefix if present
  let cleanBase64 = base64Data;
  if (base64Data.includes(";base64,")) {
    cleanBase64 = base64Data.split(";base64,")[1];
  }

  const promptText = `Analyze the provided screenshot of a property listing. Extract the following information as a clean JSON object:
{
  "address": "Street address of the property, if found. Do not include city, state, or zip here.",
  "city": "City, if found",
  "state": "Two-letter state abbreviation, if found",
  "zip": "Zip code, if found",
  "bedrooms": number or null,
  "bathrooms": number or null,
  "square_feet": number or null,
  "lot_size": "Lot size (e.g. '0.25 acres', '10,890 sq ft'), if found",
  "year_built": number or null,
  "property_type": "One of: SFR, Multi, Condo, Townhouse, Land, Commercial, Unknown",
  "raw_price": "Price string (e.g. '$350,000'), if found",
  "monthly_rent": number or null,
  "listing_description": "Full text of the property description, MLS remarks, or agent notes, if present"
}
Return ONLY the raw JSON object matching this schema. Do not wrap in markdown or add explanations.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType: mimeType || "image/png",
              data: cleanBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: any = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse) {
    throw new Error("Invalid or empty response from Gemini API");
  }

  try {
    const parsed: ImageAnalysisResult = JSON.parse(textResponse.trim());
    return {
      address: parsed.address || "",
      city: parsed.city || "",
      state: parsed.state || "",
      zip: parsed.zip || "",
      bedrooms: parsed.bedrooms ?? null,
      bathrooms: parsed.bathrooms ?? null,
      square_feet: parsed.square_feet ?? null,
      lot_size: parsed.lot_size ?? null,
      year_built: parsed.year_built ?? null,
      property_type: parsed.property_type || "Unknown",
      raw_price: parsed.raw_price ?? null,
      monthly_rent: parsed.monthly_rent ?? null,
      listing_description: parsed.listing_description ?? null
    };
  } catch (err) {
    throw new Error(`Failed to parse Gemini JSON output: ${textResponse}`);
  }
}
