// ─────────────────────────────────────────────────────────────
// pages/api/analyze-doc.js
// Module 12 — Pre-Submission Document AI Authenticator & Inspector.
// Accepts simulated OCR text + expected field values for ANY document
// type (Aadhaar, marksheet, DOB proof, certificate, etc.) and asks
// gpt-4o to flag rejection risks. Falls back to a deterministic
// offline heuristic engine (lib/aiEngine.js) with no API key.
// ─────────────────────────────────────────────────────────────
import OpenAI from "openai";
import { offlineInspectDocument } from "../../lib/aiEngine";

const SYSTEM_PROMPT = `You are JanSahayak's AI document authenticator for Indian government paperwork (Aadhaar, marksheets, birth/DOB proofs, income/caste/community certificates, driving licence forms, passport annexures, etc).

Compare the EXPECTED FIELDS against the TEXT EXTRACTED from a citizen's uploaded document photo, and flag anything that would commonly cause rejection at a government counter:
- Name / DOB / ID number mismatches (even one character matters)
- Blurry, smudged, or low-legibility scans
- Missing official stamps, seals, or signatures
- Blank mandatory fields
- Structural non-compliance (wrong form version, missing sections)

Be encouraging and plain-spoken; the citizen may have low literacy. Frame issues as commonly fixable, never blame the citizen.

Respond ONLY with a JSON object of this exact shape, nothing else:
{
  "status": "pass" | "medium_risk" | "high_risk",
  "summary": "one short plain-language sentence",
  "findings": [
    { "field": "string", "severity": "low"|"medium"|"high", "issue": "plain explanation", "fix": "one concrete next step" }
  ]
}`;

function isMockMode() {
  const key = process.env.OPENAI_API_KEY;
  const forced = String(process.env.FORCE_MOCK_MODE || "").toLowerCase() === "true";
  return forced || !key || key.startsWith("sk-your-") || key.trim() === "";
}

function simulateLatency(min = 700, max = 1500) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((r) => setTimeout(r, ms));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { docType, expectedFields, ocrText } = req.body || {};
  if (!ocrText) return res.status(400).json({ error: "Missing 'ocrText'." });

  await simulateLatency();

  if (isMockMode()) {
    const result = offlineInspectDocument({ docType, expectedFields, ocrText });
    return res.status(200).json({ ...result, mode: "offline-mock" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Document type: ${docType || "Unknown"}\n\nEXPECTED FIELDS:\n${JSON.stringify(expectedFields || {}, null, 2)}\n\nEXTRACTED TEXT (synthetic OCR):\n"""\n${ocrText}\n"""\n\nReturn the JSON object as instructed.`,
        },
      ],
    });
    const parsed = JSON.parse(completion.choices?.[0]?.message?.content || "{}");
    return res.status(200).json({ ...parsed, mode: "openai-gpt-4o" });
  } catch (err) {
    console.error("[analyze-doc] falling back to offline engine:", err.message);
    const result = offlineInspectDocument({ docType, expectedFields, ocrText });
    return res.status(200).json({ ...result, mode: "offline-fallback-after-error" });
  }
}
