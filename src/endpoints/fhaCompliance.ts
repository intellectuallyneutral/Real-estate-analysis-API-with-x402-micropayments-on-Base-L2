import { FhaComplianceInput, FhaComplianceOutput, FhaViolation } from "../utils/schemas";
import { fhaWordList } from "../fha/wordlist";

export function checkFhaCompliance(input: FhaComplianceInput): FhaComplianceOutput {
  const originalText = input.listing_text;
  let compliantRewrite = originalText;
  const flaggedPhrases: FhaViolation[] = [];

  for (const entry of fhaWordList) {
    // Check if the pattern matches the current version of the text
    // Note: We test the original text to record all violations, but we perform replacement sequentially
    if (entry.pattern.test(originalText)) {
      flaggedPhrases.push({
        phrase: entry.phraseText,
        violation_category: entry.category,
        suggestion: entry.suggestion
      });

      // Perform replace case-insensitively using regex
      compliantRewrite = compliantRewrite.replace(entry.pattern, (match) => {
        // If the suggestion is a placeholder like "[disallowed criteria - remove phrase]",
        // we replace the match with nothing (or empty string).
        if (entry.suggestion.startsWith("[") && entry.suggestion.endsWith("]")) {
          return "";
        }
        return entry.suggestion;
      });
    }
  }

  // Double check if there are multiple consecutive spaces left over from removals and trim them
  compliantRewrite = compliantRewrite.replace(/\s+/g, " ").trim();

  return {
    is_compliant: flaggedPhrases.length === 0,
    violation_count: flaggedPhrases.length,
    flagged_phrases: flaggedPhrases,
    compliant_rewrite: compliantRewrite
  };
}
