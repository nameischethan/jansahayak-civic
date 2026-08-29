import { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { CERTIFICATE_TYPES } from "../../lib/data/certificates";
import { lsGet, lsSet, generateReferenceId, simulateLatency } from "../../lib/storage";
import { Landmark, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

export default function CertificatePortal() {
  const { user } = useApp();
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  async function apply() {
    setSubmitting(true);
    await simulateLatency(700, 1400);
    const app = {
      id: generateReferenceId(selected.id.slice(0, 3).toUpperCase()),
      phone: user?.phone,
      certificate: selected.name,
      submittedAt: new Date().toLocaleString("en-IN"),
    };
    const all = lsGet("certificateApplications", []);
    all.push(app);
    lsSet("certificateApplications", all);
    setReceipt(app);
    setSubmitting(false);
  }

  function reset() {
    setSelected(null);
    setReceipt(null);
  }

  return (
    <ProtectedRoute>
      <Layout title="Certificate Portal">
        {!selected && (
          <div className="grid gap-3">
            {CERTIFICATE_TYPES.filter((c) => !["birth", "death", "marriage"].includes(c.id)).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="flex items-center gap-3 bg-white rounded-2xl shadow-card border border-slate-100 p-4 text-left hover:border-saffron-400"
              >
                <div className="w-11 h-11 rounded-xl bg-navy-800 flex items-center justify-center shrink-0">
                  <Landmark size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-navy-800 text-sm">{c.name}</p>
                  <p className="text-xs text-slate-500 truncate">{c.authority} · {c.processingDays}</p>
                </div>
              </button>
            ))}
            <p className="text-xs text-slate-400 text-center pt-2">
              Looking for Birth, Death, or Marriage certificates? Those live in the dedicated{" "}
              <strong>Vital Records Portal</strong> module.
            </p>
          </div>
        )}

        {selected && !receipt && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-slate-500 mb-3"><ArrowLeft size={14} /> Back to all certificates</button>
            <h2 className="text-lg font-bold text-navy-800 mb-1">{selected.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{selected.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <InfoBox label="Issuing Authority" value={selected.authority} />
              <InfoBox label="Fee" value={selected.fee} />
              <InfoBox label="Validity" value={selected.validity} />
              <InfoBox label="Processing Time" value={selected.processingDays} />
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Documents Required</p>
            <ul className="space-y-1.5 mb-4">
              {selected.documents.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-navy-800 bg-slate-50 rounded-lg p-2">
                  <CheckCircle2 size={14} className="text-indiagreen-500 shrink-0 mt-0.5" /> {d}
                </li>
              ))}
            </ul>
            <button onClick={apply} disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-indiagreen-500 hover:bg-indiagreen-600 disabled:opacity-70 text-white font-bold rounded-xl py-3">
              {submitting && <Loader2 size={18} className="animate-spin" />} Apply for This Certificate
            </button>
          </div>
        )}

        {receipt && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <div className="bg-safe-bg border border-safe-border rounded-xl p-4">
              <p className="flex items-center gap-1.5 text-safe-text font-bold text-sm mb-1"><CheckCircle2 size={16} /> Application Submitted</p>
              <p className="text-lg font-mono font-bold text-navy-800">{receipt.id}</p>
              <p className="text-xs text-slate-500 mt-1">{receipt.certificate} · Submitted {receipt.submittedAt}</p>
            </div>
            <button onClick={reset} className="mt-3 w-full bg-white border border-slate-300 hover:bg-slate-50 text-navy-800 font-semibold rounded-xl py-2.5 text-sm">
              Apply for Another Certificate
            </button>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-2.5">
      <p className="text-slate-400">{label}</p>
      <p className="font-semibold text-navy-800">{value}</p>
    </div>
  );
}
