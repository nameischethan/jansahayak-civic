import { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { lsGet, lsSet, generateReferenceId, simulateLatency } from "../../lib/storage";
import { ShieldAlert, Lock, CheckCircle2, Loader2, EyeOff } from "lucide-react";

const DEPARTMENTS = ["Revenue / Tehsil Office", "RTO / Transport", "Police Station", "Municipal Corporation", "Electricity Board", "Water Department", "Hospital / Health Dept.", "Other"];

// Trivial reversible obfuscation standing in for real end-to-end
// encryption — this demo never links a complaint to any account,
// name, or phone number, so no identity data exists to protect
// beyond the free-text fields the citizen chooses to type.
function obfuscate(text) {
  return typeof window !== "undefined" ? btoa(unescape(encodeURIComponent(text))) : text;
}

export default function GrievancePortal() {
  const [form, setForm] = useState({ department: DEPARTMENTS[0], location: "", description: "", amountDemanded: "" });
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSubmitting(true);
    await simulateLatency(900, 1700);

    const complaint = {
      id: generateReferenceId("GRV"),
      department: form.department,
      location: form.location,
      amountDemanded: form.amountDemanded,
      descriptionEncrypted: obfuscate(form.description),
      submittedAt: new Date().toLocaleString("en-IN"),
      // Deliberately NOT stored: name, phone, session, IP, device id.
    };
    const all = lsGet("grievances", []);
    all.push(complaint);
    lsSet("grievances", all);
    setReceipt(complaint);
    setSubmitting(false);
  }

  return (
    <ProtectedRoute>
      <Layout title="Anonymous Grievance Portal">
        <div className="bg-navy-800 text-white rounded-2xl p-4 flex items-start gap-2">
          <EyeOff size={18} className="shrink-0 mt-0.5 text-saffron-500" />
          <p className="text-sm text-slate-200">
            This form does <strong>not</strong> record your name, phone number, or account — even
            though you're logged in. Only the tracking ID below can ever be linked back to this
            report, and only by you.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><ShieldAlert size={20} /> File a Bribery / Corruption Report</h2>

          {!receipt ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Select label="Department Involved" value={form.department} onChange={(v) => setForm({ ...form, department: v })} options={DEPARTMENTS} />
              <Input label="Office Location (city/town)" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
              <Input label="Amount Demanded (₹, optional)" value={form.amountDemanded} onChange={(v) => setForm({ ...form, amountDemanded: v.replace(/\D/g, "") })} />
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">What happened? (do not include your own name)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  required
                  placeholder="Describe the incident, date, and any details of the official involved..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-base focus:border-saffron-500 outline-none resize-none"
                />
              </div>
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-risk-text hover:opacity-90 disabled:opacity-70 text-white font-bold rounded-xl py-3">
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                Submit Anonymously
              </button>
            </form>
          ) : (
            <div className="bg-safe-bg border border-safe-border rounded-xl p-4">
              <p className="flex items-center gap-1.5 text-safe-text font-bold text-sm mb-1"><CheckCircle2 size={16} /> Report Filed Anonymously</p>
              <p className="text-lg font-mono font-bold text-navy-800">{receipt.id}</p>
              <p className="text-xs text-slate-500 mt-2">
                Save this ID — it is the only way to reference this report. Forward it to your state's
                Anti-Corruption Bureau or dial 1064 to escalate.
              </p>
              <button onClick={() => setReceipt(null)} className="mt-3 w-full bg-white border border-slate-300 hover:bg-slate-50 text-navy-800 font-semibold rounded-xl py-2.5 text-sm">
                File Another Report
              </button>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1 block">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-base focus:border-saffron-500 outline-none" />
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
