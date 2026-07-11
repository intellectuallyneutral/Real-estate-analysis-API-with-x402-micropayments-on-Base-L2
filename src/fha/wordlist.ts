export interface WordListEntry {
  pattern: RegExp;
  phraseText: string; // Plain text representation for matching output
  category: "Familial Status" | "Race" | "National Origin" | "Religion" | "Sex" | "Disability" | "Color";
  suggestion: string;
}

export const fhaWordList: WordListEntry[] = [
  // --- FAMILIAL STATUS ---
  {
    pattern: /\bfamily[- ]friendly\b/i,
    phraseText: "family-friendly",
    category: "Familial Status",
    suggestion: "welcoming neighborhood"
  },
  {
    pattern: /\bperfect for families\b/i,
    phraseText: "perfect for families",
    category: "Familial Status",
    suggestion: "spacious floor plan"
  },
  {
    pattern: /\bgreat for kids\b/i,
    phraseText: "great for kids",
    category: "Familial Status",
    suggestion: "close to local parks"
  },
  {
    pattern: /\bno children\b/i,
    phraseText: "no children",
    category: "Familial Status",
    suggestion: "[disallowed criteria - remove phrase]"
  },
  {
    pattern: /\badults only\b/i,
    phraseText: "adults only",
    category: "Familial Status",
    suggestion: "[disallowed criteria - remove phrase]"
  },
  {
    pattern: /\bmature community\b/i,
    phraseText: "mature community",
    category: "Familial Status",
    suggestion: "quiet residential setting"
  },
  {
    pattern: /\bempty nesters\b/i,
    phraseText: "empty nesters",
    category: "Familial Status",
    suggestion: "low-maintenance living"
  },
  {
    pattern: /\bcouples only\b/i,
    phraseText: "couples only",
    category: "Familial Status",
    suggestion: "[disallowed criteria - remove phrase]"
  },
  {
    pattern: /\bbachelor pad\b/i,
    phraseText: "bachelor pad",
    category: "Familial Status",
    suggestion: "studio apartment or modern flat"
  },
  {
    pattern: /\bman cave\b/i,
    phraseText: "man cave",
    category: "Familial Status",
    suggestion: "bonus room or recreation room"
  },
  {
    pattern: /\bnursery\b/i,
    phraseText: "nursery",
    category: "Familial Status",
    suggestion: "extra bedroom or flex space"
  },
  {
    pattern: /\bplayroom\b/i,
    phraseText: "playroom",
    category: "Familial Status",
    suggestion: "bonus space or den"
  },
  {
    pattern: /\bperfect for retirees\b/i,
    phraseText: "perfect for retirees",
    category: "Familial Status",
    suggestion: "low-maintenance property"
  },
  {
    pattern: /\bideal for active adults\b/i,
    phraseText: "ideal for active adults",
    category: "Familial Status",
    suggestion: "located near recreational amenities"
  },

  // --- RACE / COLOR / NATIONAL ORIGIN ---
  {
    pattern: /\bethnic\b/i,
    phraseText: "ethnic",
    category: "Race",
    suggestion: "[remove neighborhood demographic profiling]"
  },
  {
    pattern: /\bdiverse neighborhood\b/i,
    phraseText: "diverse neighborhood",
    category: "Race",
    suggestion: "[remove demographic descriptors]"
  },
  {
    pattern: /\bintegrated\b/i,
    phraseText: "integrated",
    category: "Race",
    suggestion: "[remove demographic descriptors]"
  },
  {
    pattern: /\bexclusive community\b/i,
    phraseText: "exclusive community",
    category: "Race",
    suggestion: "private development or upscale properties"
  },
  {
    pattern: /\bminority\b/i,
    phraseText: "minority",
    category: "Race",
    suggestion: "[remove demographic descriptors]"
  },
  {
    pattern: /\bblack community\b/i,
    phraseText: "black community",
    category: "Race",
    suggestion: "[remove racial descriptors]"
  },
  {
    pattern: /\bwhite neighborhood\b/i,
    phraseText: "white neighborhood",
    category: "Race",
    suggestion: "[remove racial descriptors]"
  },
  {
    pattern: /\bhispanic area\b/i,
    phraseText: "hispanic area",
    category: "National Origin",
    suggestion: "[remove demographic descriptors]"
  },
  {
    pattern: /\bchinese community\b/i,
    phraseText: "chinese community",
    category: "National Origin",
    suggestion: "[remove national origin profiling]"
  },
  {
    pattern: /\bmexican community\b/i,
    phraseText: "mexican community",
    category: "National Origin",
    suggestion: "[remove national origin profiling]"
  },
  {
    pattern: /\btraditional neighborhood\b/i,
    phraseText: "traditional neighborhood",
    category: "Race",
    suggestion: "classic architectural style"
  },

  // --- RELIGION ---
  {
    pattern: /\bnear (?:a )?church\b/i,
    phraseText: "near church",
    category: "Religion",
    suggestion: "centrally located to local community points"
  },
  {
    pattern: /\bnear (?:a )?temple\b/i,
    phraseText: "near temple",
    category: "Religion",
    suggestion: "centrally located to local community points"
  },
  {
    pattern: /\bnear (?:a )?mosque\b/i,
    phraseText: "near mosque",
    category: "Religion",
    suggestion: "centrally located to local community points"
  },
  {
    pattern: /\bnear (?:a )?synagogue\b/i,
    phraseText: "near synagogue",
    category: "Religion",
    suggestion: "centrally located to local community points"
  },
  {
    pattern: /\bchristian community\b/i,
    phraseText: "christian community",
    category: "Religion",
    suggestion: "[remove religious demographic descriptors]"
  },
  {
    pattern: /\bwalking distance to church\b/i,
    phraseText: "walking distance to church",
    category: "Religion",
    suggestion: "convenient access to local amenities"
  },
  {
    pattern: /\bchurch[- ]going\b/i,
    phraseText: "church-going",
    category: "Religion",
    suggestion: "[remove religious preferences]"
  },

  // --- DISABILITY ---
  {
    pattern: /\bwalking distance\b/i,
    phraseText: "walking distance",
    category: "Disability",
    suggestion: "minutes away or close to local features"
  },
  {
    pattern: /\bmust be able to climb stairs\b/i,
    phraseText: "must be able to climb stairs",
    category: "Disability",
    suggestion: "multi-level property or stairs required for entry"
  },
  {
    pattern: /\bno wheelchairs\b/i,
    phraseText: "no wheelchairs",
    category: "Disability",
    suggestion: "[disallowed criteria - remove phrase]"
  },
  {
    pattern: /\bhandicapped\b/i,
    phraseText: "handicapped",
    category: "Disability",
    suggestion: "accessible or wheelchair friendly"
  },
  {
    pattern: /\bcrippled\b/i,
    phraseText: "crippled",
    category: "Disability",
    suggestion: "[remove discriminatory terms]"
  },
  {
    pattern: /\bable[- ]bodied\b/i,
    phraseText: "able-bodied",
    category: "Disability",
    suggestion: "[remove discriminatory criteria]"
  },

  // --- SEX ---
  {
    pattern: /\bfemale roommate preferred\b/i,
    phraseText: "female roommate preferred",
    category: "Sex",
    suggestion: "[for shared units, state: shared common spaces; otherwise remove sex preference]"
  },
  {
    pattern: /\bmale only\b/i,
    phraseText: "male only",
    category: "Sex",
    suggestion: "[remove sex restriction]"
  },

  // --- GENERAL CODED / HISTORICAL ---
  {
    pattern: /\bmaster bedroom\b/i,
    phraseText: "master bedroom",
    category: "Race",
    suggestion: "primary bedroom"
  },
  {
    pattern: /\bmaster bath\b/i,
    phraseText: "master bath",
    category: "Race",
    suggestion: "primary bath"
  },
  {
    pattern: /\bplantation shutters\b/i,
    phraseText: "plantation shutters",
    category: "Race",
    suggestion: "interior shutters or custom blinds"
  },
  {
    pattern: /\bgood schools\b/i,
    phraseText: "good schools",
    category: "Race",
    suggestion: "school district info available upon request"
  },
  {
    pattern: /\bsafe neighborhood\b/i,
    phraseText: "safe neighborhood",
    category: "Race",
    suggestion: "quiet neighborhood or established area"
  },
  {
    pattern: /\bprestigious area\b/i,
    phraseText: "prestigious area",
    category: "Race",
    suggestion: "established or sought-after neighborhood"
  },
  {
    pattern: /\bquiet tenant wanted\b/i,
    phraseText: "quiet tenant wanted",
    category: "Familial Status",
    suggestion: "[remove tenant behavioral preference]"
  },
  {
    pattern: /\bideal for single professional\b/i,
    phraseText: "ideal for single professional",
    category: "Familial Status",
    suggestion: "ideal setup for a home office"
  },
  {
    pattern: /\bno kids allowed\b/i,
    phraseText: "no kids allowed",
    category: "Familial Status",
    suggestion: "[disallowed criteria - remove phrase]"
  },
  {
    pattern: /\bperfect for student roommates\b/i,
    phraseText: "perfect for student roommates",
    category: "Familial Status",
    suggestion: "multi-room layout with shared common area"
  }
];
