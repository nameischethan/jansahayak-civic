import { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { ScanSearch, Upload, Loader2, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

const SAMPLE_DOCS = [
  {
    id: "aadhaar",
    label: "Aadhaar Card",
    expectedFields: { Name: "Suresh Patel", DOB: "05-09-1990" },
    ocrText: "Name: Suresh Ptael\nDOB: 05-09-1990\nAadhaar No: XXXX XXXX 4521\nRemarks: photo slightly blur, address block clear",
  },
  {
    id: "marksheet",
    label: "Marksheet",
    expectedFields: { Name: "Suresh Patel", Roll: "88214" },
    ocrText: "Name: Suresh Patel\nRoll: 88214\nBoard: State Board\nRemarks: missing stamp on top right corner",
  },
  {
    id: "dob-proof",
    label: "Date of Birth Proof",
    expectedFields: { Name: "Suresh Patel", DOB: "05-09-1990" },
    ocrText: "Name: Suresh Patel\nDOB: 05/09/1991\nIssued By: Municipal Corporation\nRemarks: form fields complete",
  },
];

export default function DocInspector() {
  const [selected, setSelected] = useState(SAMPLE_DOCS[0]);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  async function scan() {
    setUploaded(true);
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType: selected.label, expectedFields: selected.expectedFields, ocrText: selected.ocrText }),
      });
      setResult(await res.json());
    } catch {
      setResult({ status: "medium_risk", summary: "Could not reach the AI service.", findings: [] });
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <ProtectedRoute>
      <Layout title="AI Document Inspector">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><ScanSearch size={20} /> Pick a Document to Authenticate</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {SAMPLE_DOCS.map((d) => (
              <button
                key={d.id}
                onClick={() => { setSelected(d); setUploaded(false); setResult(null); }}
                className={`text-xs font-semibold rounded-xl px-2 py-3 border ${selected.id === d.id ? "bg-navy-800 text-white border-navy-800" : "bg-slate-50 text-navy-800 border-slate-200"}`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {!uploaded ? (
            <button onClick={scan} className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-saffron-500 rounded-xl py-8 text-slate-500 hover:text-saffron-600">
              <Upload size={26} />
              <span className="font-semibold text-sm">Simulate Upload & Run AI Scan</span>
            </button>
          ) : (
            <>
              {analyzing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 justify-center py-2">
                    <Loader2 size={18} className="animate-spin" /> Running structural & authenticity checks…
                  </div>
                  <div className="relative overflow-hidden bg-slate-100 rounded-xl h-2">
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-saffron-500 animate-scan rounded-xl" />
                  </div>
                </div>
              )}
              {result && !analyzing && (
                <div className={`rounded-xl p-4 border ${result.status === "pass" ? "bg-safe-bg border-safe-border" : "bg-risk-bg border-risk-border"}`}>
                  <p className={`flex items-center gap-1.5 font-bold text-sm mb-1 ${result.status === "pass" ? "text-safe-text" : "text-risk-text"}`}>
                    {result.status === "pass" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    {result.status === "pass" ? "Authenticated — No Issues" : "Authenticity Issues Detected"}
                  </p>
                  <p className="text-sm text-navy-800 mb-2">{result.summary}</p>
                  {result.findings?.map((f, i) => (
                    <div key={i} className="bg-white/70 rounded-lg p-2.5 border border-white mb-2">
                      <p className="text-sm font-semibold text-navy-800">{f.field} <span className="text-xs font-normal text-slate-500">({f.severity})</span></p>
                      <p className="text-xs text-slate-600">{f.issue}</p>
                      <p className="text-xs text-indiagreen-500 font-semibold">✓ {f.fix}</p>
                    </div>
                  ))}
                  <p className="text-[10px] text-slate-400 mt-1">Engine: {result.mode === "openai-gpt-4o" ? "OpenAI gpt-4o (live)" : "Offline synthetic engine"}</p>
                  <button onClick={scan} className="w-full mt-2 flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-navy-800 font-semibold rounded-xl py-2.5 text-sm">
                    <RotateCcw size={14} /> Re-scan
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
