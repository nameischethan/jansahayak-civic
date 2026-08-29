// Curated list of Indian languages & major dialect variants for the
// Multilingual Voice & Text Assistant module. BCP-47 tags are used to
// drive the real browser SpeechSynthesis / SpeechRecognition APIs where
// the OS/browser ships voice packs for that locale. This list intentionally
// covers scheduled languages + widely-spoken dialects; the architecture
// (a flat {label, tag} array feeding two Web Speech API hooks) scales to
// the full 200+ language/dialect claim as more voice packs are registered —
// see README "Language Coverage Honesty Note".
export const INDIAN_LANGUAGES = [
  { label: "English (India)", tag: "en-IN" },
  { label: "Hindi", tag: "hi-IN" },
  { label: "Bengali", tag: "bn-IN" },
  { label: "Telugu", tag: "te-IN" },
  { label: "Marathi", tag: "mr-IN" },
  { label: "Tamil", tag: "ta-IN" },
  { label: "Urdu", tag: "ur-IN" },
  { label: "Gujarati", tag: "gu-IN" },
  { label: "Kannada", tag: "kn-IN" },
  { label: "Odia", tag: "or-IN" },
  { label: "Malayalam", tag: "ml-IN" },
  { label: "Punjabi", tag: "pa-IN" },
  { label: "Assamese", tag: "as-IN" },
  { label: "Maithili", tag: "mai-IN" },
  { label: "Sanskrit", tag: "sa-IN" },
  { label: "Nepali (India)", tag: "ne-IN" },
  { label: "Konkani", tag: "kok-IN" },
  { label: "Sindhi", tag: "sd-IN" },
  { label: "Dogri", tag: "doi-IN" },
  { label: "Kashmiri", tag: "ks-IN" },
  { label: "Manipuri (Meitei)", tag: "mni-IN" },
  { label: "Bodo", tag: "brx-IN" },
  { label: "Santali", tag: "sat-IN" },
  { label: "Rajasthani (Marwari)", tag: "mwr-IN" },
  { label: "Bhojpuri", tag: "bho-IN" },
  { label: "Chhattisgarhi", tag: "hne-IN" },
  { label: "Magahi", tag: "mag-IN" },
  { label: "Haryanvi", tag: "bgc-IN" },
  { label: "Awadhi", tag: "awa-IN" },
  { label: "Tulu", tag: "tcy-IN" },
  { label: "Garhwali", tag: "gbm-IN" },
  { label: "Kumaoni", tag: "kfy-IN" },
  { label: "Khasi", tag: "kha-IN" },
  { label: "Mizo", tag: "lus-IN" },
  { label: "Ho", tag: "hoc-IN" },
  { label: "Gondi", tag: "gon-IN" },
  { label: "Bundeli", tag: "bns-IN" },
  { label: "Malvi", tag: "mup-IN" },
  { label: "Surgujia", tag: "sgj-IN" },
  { label: "Kannauji", tag: "bjj-IN" },
  { label: "Angika", tag: "anp-IN" },
  { label: "Sambalpuri", tag: "spv-IN" },
  { label: "Ladakhi", tag: "lbj-IN" },
];
