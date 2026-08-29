// ─────────────────────────────────────────────────────────────
// lib/aiEngine.js
// Generic offline document-inspection heuristic engine, shared by
// the /api/analyze-doc route (module 12) and any client-side preview
// checks. Provides a genuine non-network fallback (not a stub) using
// Levenshtein-distance fuzzy matching on simulated OCR text.
// ─────────────────────────────────────────────────────────────

export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Generic offline document inspector. `expectedFields` is a flat
 * {fieldLabel: expectedValue} map; `ocrText` is simulated OCR output
 * containing "Label: value" lines plus optional quality remarks.
 */
export function offlineInspectDocument({ docType, expectedFields = {}, ocrText = "" }) {
  const findings = [];
  const lines = ocrText.split("\n");

  for (const [label, expectedValue] of Object.entries(expectedFields)) {
    const re = new RegExp(`${label}\\s*[:\\-]\\s*(.+)`, "i");
    const line = lines.find((l) => re.test(l));
    if (!line) continue;
    const match = line.match(re);
    const extracted = match[1].trim();
    const expectedStr = String(expectedValue);
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const dist = levenshtein(norm(extracted), norm(expectedStr));

    if (dist === 0) continue;
    const severity = dist <= 2 ? "high" : "high";
    findings.push({
      field: label,
      severity,
      issue: `Document shows "${extracted}" but the expected value is "${expectedStr}". Even small mismatches commonly trigger rejection.`,
      fix: `Correct this field to read exactly "${expectedStr}" and re-upload.`,
    });
  }

  if (/blur|smudge|unclear|unreadable/i.test(ocrText)) {
    findings.push({
      field: "Image Quality",
      severity: "medium",
      issue: "The scan/photo shows signs of blur or smudging that can cause automatic rejection during verification.",
      fix: "Retake the photo in good daylight, hold the camera steady, and ensure all four corners of the document are visible.",
    });
  }
  if (/missing stamp|no stamp|stamp not visible|seal missing/i.test(ocrText)) {
    findings.push({
      field: "Official Stamp / Seal",
      severity: "high",
      issue: "No official stamp or seal is visible on the document — most certificates are rejected without this.",
      fix: "Get the document re-stamped/attested by the issuing authority before submission.",
    });
  }
  if (/blank|not filled|left empty/i.test(ocrText)) {
    findings.push({
      field: "Mandatory Fields",
      severity: "medium",
      issue: "One or more mandatory fields appear to be left blank on the form.",
      fix: "Fill every mandatory field completely before re-submitting.",
    });
  }

  const highCount = findings.filter((f) => f.severity === "high").length;
  const status = highCount > 0 ? "high_risk" : findings.length > 0 ? "medium_risk" : "pass";

  return {
    status,
    summary:
      status === "pass"
        ? `No major issues detected in this ${docType || "document"}.`
        : `${findings.length} potential issue(s) found that commonly cause rejection for a ${docType || "document"}.`,
    findings,
    source: "offline-heuristic-engine",
  };
}
