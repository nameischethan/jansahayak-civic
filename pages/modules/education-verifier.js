import { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { GraduationCap, Upload, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const DOC_TYPES = [
  {
    id: "ssc",
    label: "SSC / Class 10 Marksheet",
    expectedFields: { Name: "Anjali Verma", DOB: "12-08-2008", Board: "CBSE" },
    sampleOcr: "Name: Anjali Vermma\nDOB: 12-08-2008\nBoard: CBSE\nRoll No: 4521367\nRemarks: seal partially visible, bottom edge blurry",
  },
  {
    id: "inter",
    label: "Intermediate / Class 12 Marksheet",
    expectedFields: { Name: "Anjali Verma", DOB: "12-08-2008", Board: "CBSE" },
    sampleOcr: "Name: Anjali Verma\nDOB: 12/08/2006\nBoard: CBSE\nStream: Science\nRemarks: form fields complete",
  },
  {
    id: "degree",
    label: "Degree Certificate",
    expectedFields: { Name: "Anjali Verma", University: "Barkatullah University" },
    sampleOcr: "Name: Anjali Verma\nUniversity: Barkatullah Univesity\nDegree: B.Sc. Computer Science\nRemarks: missing stamp on right corner",
  },
  {
    id: "migration",
    label: "Migration Certificate",
    expectedFields: { Name: "Anjali Verma", "Institution": "Govt. Girls College Bhopal" },
    sampleOcr: "Name: Anjali Verma\nInstitution: Govt. Girls College Bhopal\nYear of Passing: 2023\nRemarks: not filled completely, admission year left blank",
  },
];

export default function EducationVerifier() {
  const [selected, setSelected] = useState(DOC_TYPES[0]);
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  async function handleUpload() {
    setUploaded(true);
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType: selected.label, expectedFields: selected.expectedFields, ocrText: selected.sampleOcr }),
      });
      setResult(await res.json());
    } catch {
      setResult({ status: "medium_risk", summary: "Could not reach analysis service.", findings: [] });
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <ProtectedRoute>
      <Layout title="Education Document Verifier">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><GraduationCap size={20} /> Select Document Type</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {DOC_TYPES.map((d) => (
              <button
                key={d.id}
                onClick={() => { setSelected(d); setUploaded(false); setResult(null); }}
                className={`text-left text-sm font-semibold rounded-xl px-3 py-3 border ${
                  selected.id === d.id ? "bg-navy-800 text-white border-navy-800" : "bg-slate-50 text-navy-800 border-slate-200"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {!uploaded ? (
            <button
              onClick={handleUpload}
              className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-saffron-500 rounded-xl py-8 text-slate-500 hover:text-saffron-600"
            >
              <Upload size={26} />
              <span className="font-semibold text-sm">Simulate Scan / Upload {selected.label}</span>
            </button>
          ) : (
            <div>
              {analyzing && (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-6 justify-center">
                  <Loader2 size={18} className="animate-spin" /> Verifying document against records…
                </div>
              )}
              {result && !analyzing && (
                <div className={`rounded-xl p-4 border ${result.status === "pass" ? "bg-safe-bg border-safe-border" : "bg-risk-bg border-risk-border"}`}>
                  <p className={`flex items-center gap-1.5 font-bold text-sm mb-1 ${result.status === "pass" ? "text-safe-text" : "text-risk-text"}`}>
                    {result.status === "pass" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    {result.status === "pass" ? "Verified — No Issues Found" : "Verification Issues Found"}
                  </p>
                  <p className="text-sm text-navy-800 mb-2">{result.summary}</p>
                  {result.findings?.map((f, i) => (
                    <div key={i} className="bg-white/70 rounded-lg p-2.5 border border-white mb-2">
                      <p className="text-sm font-semibold text-navy-800">{f.field} <span className="text-xs font-normal text-slate-500">({f.severity})</span></p>
                      <p className="text-xs text-slate-600">{f.issue}</p>
                      <p className="text-xs text-indiagreen-500 font-semibold">✓ {f.fix}</p>
                    </div>
                  ))}
                  <button onClick={handleUpload} className="w-full mt-2 bg-white border border-slate-300 hover:bg-slate-50 text-navy-800 font-semibold rounded-xl py-2.5 text-sm">
                    Re-scan Document
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
