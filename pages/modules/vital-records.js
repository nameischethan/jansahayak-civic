import { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { CERTIFICATE_TYPES, CORRECTION_REASONS } from "../../lib/data/certificates";
import { lsGet, lsSet, generateReferenceId, simulateLatency } from "../../lib/storage";
import { FileHeart, CheckCircle2, Loader2 } from "lucide-react";

const RECORD_IDS = ["birth", "death", "marriage"];

export default function VitalRecords() {
  const { user } = useApp();
  const [recordId, setRecordId] = useState("birth");
  const [mode, setMode] = useState("new"); // new | correction
  const [form, setForm] = useState({ name: "", date: "", place: "", correctionReason: CORRECTION_REASONS[0], details: "" });
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const record = CERTIFICATE_TYPES.find((c) => c.id === recordId);

  function switchRecord(id) {
    setRecordId(id);
    setMode("new");
    setForm({ name: "", date: "", place: "", correctionReason: CORRECTION_REASONS[0], details: "" });
    setReceipt(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await simulateLatency(700, 1400);
    const app = {
      id: generateReferenceId(recordId.slice(0, 3).toUpperCase()),
      phone: user?.phone,
      recordType: record.name,
      mode,
      ...form,
      submittedAt: new Date().toLocaleString("en-IN"),
    };
    const all = lsGet("vitalRecordApplications", []);
    all.push(app);
    lsSet("vitalRecordApplications", all);
    setReceipt(app);
    setSubmitting(false);
  }

  return (
    <ProtectedRoute>
      <Layout title="Vital Records Portal">
        <div className="flex gap-2">
          {RECORD_IDS.map((id) => {
            const c = CERTIFICATE_TYPES.find((x) => x.id === id);
            return (
              <button
                key={id}
                onClick={() => switchRecord(id)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold border ${
                  recordId === id ? "bg-navy-800 text-white border-navy-800" : "bg-white text-navy-800 border-slate-200"
                }`}
              >
                {c.name.replace(" Certificate", "")}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-1 flex items-center gap-2"><FileHeart size={20} /> {record.name}</h2>
          <p className="text-sm text-slate-500 mb-4">{record.description}</p>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode("new")} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === "new" ? "bg-saffron-500 text-white" : "bg-slate-100 text-navy-800"}`}>Apply New</button>
            <button onClick={() => setMode("correction")} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === "correction" ? "bg-saffron-500 text-white" : "bg-slate-100 text-navy-800"}`}>Request Correction</button>
          </div>

          {!receipt ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input label={`Name (as on ${record.name.toLowerCase()})`} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Input label={recordId === "marriage" ? "Date of Marriage" : `Date of ${recordId === "birth" ? "Birth" : "Death"}`} type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required />
              <Input label="Place" value={form.place} onChange={(v) => setForm({ ...form, place: v })} required />
              {mode === "correction" && (
                <>
                  <Select label="Reason for Correction" value={form.correctionReason} onChange={(v) => setForm({ ...form, correctionReason: v })} options={CORRECTION_REASONS} />
                  <TextArea label="Additional Details" value={form.details} onChange={(v) => setForm({ ...form, details: v })} />
                </>
              )}
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                <p className="font-semibold text-navy-800 mb-1">Documents typically required:</p>
                {record.documents.join(" · ")}
              </div>
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-indiagreen-500 hover:bg-indiagreen-600 disabled:opacity-70 text-white font-bold rounded-xl py-3">
                {submitting && <Loader2 size={18} className="animate-spin" />} {mode === "new" ? "Submit Application" : "Submit Correction Request"}
              </button>
            </form>
          ) : (
            <div className="bg-safe-bg border border-safe-border rounded-xl p-4">
              <p className="flex items-center gap-1.5 text-safe-text font-bold text-sm mb-1"><CheckCircle2 size={16} /> Request Submitted</p>
              <p className="text-lg font-mono font-bold text-navy-800">{receipt.id}</p>
              <p className="text-xs text-slate-500 mt-1">Authority: {record.authority} · Expected processing: {record.processingDays}</p>
              <button onClick={() => setReceipt(null)} className="mt-3 w-full bg-white border border-slate-300 hover:bg-slate-50 text-navy-800 font-semibold rounded-xl py-2.5 text-sm">
                File Another Request
              </button>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function Input({ label, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-base focus:border-saffron-500 outline-none" />
    </div>
  );
}
function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1 block">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-base focus:border-saffron-500 outline-none resize-none" />
    </div>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-base bg-white focus:border-saffron-500 outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
