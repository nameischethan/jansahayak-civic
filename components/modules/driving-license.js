import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { lsGet, lsSet, generateReferenceId, simulateLatency } from "../../lib/storage";
import { Car, FileCheck2, Loader2, Search, CheckCircle2 } from "lucide-react";

const TABS = [
  { id: "learner", label: "Learner's Licence" },
  { id: "permanent", label: "Permanent DL" },
  { id: "vehicle", label: "Vehicle Registration" },
  { id: "status", label: "Track Status" },
];

const STAGES = ["Application Submitted", "Document Verification", "Test/Inspection Scheduled", "Approved & Ready"];

export default function DrivingLicense() {
  const { user } = useApp();
  const [tab, setTab] = useState("learner");
  const [apps, setApps] = useState([]);

  useEffect(() => {
    setApps(lsGet("dlApplications", []).filter((a) => a.phone === user?.phone));
  }, [user]);

  function submitApplication(type, extra = {}) {
    const app = {
      id: generateReferenceId(type === "vehicle" ? "RC" : "DL"),
      phone: user?.phone,
      type,
      status: STAGES[0],
      stageIdx: 0,
      submittedAt: new Date().toLocaleString("en-IN"),
      ...extra,
    };
    const all = lsGet("dlApplications", []);
    all.push(app);
    lsSet("dlApplications", all);
    setApps(all.filter((a) => a.phone === user?.phone));
    return app;
  }

  return (
    <ProtectedRoute>
      <Layout title="Driving Licence & Parivahan">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border ${
                tab === t.id ? "bg-navy-800 text-white border-navy-800" : "bg-white text-navy-800 border-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "learner" && <LearnerForm onSubmit={submitApplication} />}
        {tab === "permanent" && <PermanentForm onSubmit={submitApplication} />}
        {tab === "vehicle" && <VehicleForm onSubmit={submitApplication} />}
        {tab === "status" && <StatusTracker apps={apps} />}
      </Layout>
    </ProtectedRoute>
  );
}

function Card({ children }) {
  return <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">{children}</div>;
}

function Receipt({ app }) {
  return (
    <div className="bg-safe-bg border border-safe-border rounded-xl p-4 mt-3">
      <p className="flex items-center gap-1.5 text-safe-text font-bold text-sm mb-1">
        <CheckCircle2 size={16} /> Application Submitted
      </p>
      <p className="text-lg font-mono font-bold text-navy-800">{app.id}</p>
      <p className="text-xs text-slate-500">Submitted {app.submittedAt} · Track it under "Track Status" tab.</p>
    </div>
  );
}

function LearnerForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", dob: "", vehicleClass: "Motorcycle (Gear)", state: "Madhya Pradesh" });
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await simulateLatency(600, 1200);
    setReceipt(onSubmit("learner", form));
    setSubmitting(false);
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><Car size={20} /> Learner's Licence (LL)</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Applicant Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Input label="Date of Birth" type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} required />
        <Select
          label="Vehicle Class"
          value={form.vehicleClass}
          onChange={(v) => setForm({ ...form, vehicleClass: v })}
          options={["Motorcycle (Gearless)", "Motorcycle (Gear)", "Light Motor Vehicle (LMV)", "Transport Vehicle"]}
        />
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5">
          Requires: Aadhaar, 2 passport photos, Form 1 (self-declaration), Form 1A (medical certificate for transport
          vehicles). A computer-based test on traffic rules is mandatory before LL is issued.
        </p>
        <SubmitBtn submitting={submitting} label="Submit LL Application" />
      </form>
      {receipt && <Receipt app={receipt} />}
    </Card>
  );
}

function PermanentForm({ onSubmit }) {
  const [form, setForm] = useState({ llNumber: "", testCenter: "Bhopal RTO", preferredDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await simulateLatency(600, 1200);
    setReceipt(onSubmit("permanent", form));
    setSubmitting(false);
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><FileCheck2 size={20} /> Permanent Driving Licence</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Learner's Licence Number" value={form.llNumber} onChange={(v) => setForm({ ...form, llNumber: v })} required />
        <Select label="Driving Test Centre" value={form.testCenter} onChange={(v) => setForm({ ...form, testCenter: v })}
          options={["Bhopal RTO", "Indore RTO", "Gwalior RTO", "Jabalpur RTO"]} />
        <Input label="Preferred Test Date" type="date" value={form.preferredDate} onChange={(v) => setForm({ ...form, preferredDate: v })} required />
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5">
          Eligible only after 30 days (and before 180 days) from LL issue date. Carry your LL, Aadhaar, and vehicle
          for the practical driving test.
        </p>
        <SubmitBtn submitting={submitting} label="Book Permanent DL Test" />
      </form>
      {receipt && <Receipt app={receipt} />}
    </Card>
  );
}

function VehicleForm({ onSubmit }) {
  const [form, setForm] = useState({ regType: "New Registration", vehicleNumber: "", chassisNumber: "" });
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await simulateLatency(600, 1200);
    setReceipt(onSubmit("vehicle", form));
    setSubmitting(false);
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><Car size={20} /> Vehicle Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Select label="Request Type" value={form.regType} onChange={(v) => setForm({ ...form, regType: v })}
          options={["New Registration", "Ownership Transfer", "Address Change on RC", "Duplicate RC"]} />
        {form.regType !== "New Registration" && (
          <Input label="Existing Vehicle Number" value={form.vehicleNumber} onChange={(v) => setForm({ ...form, vehicleNumber: v })} required />
        )}
        {form.regType === "New Registration" && (
          <Input label="Chassis Number" value={form.chassisNumber} onChange={(v) => setForm({ ...form, chassisNumber: v })} required />
        )}
        <SubmitBtn submitting={submitting} label="Submit RC Request" />
      </form>
      {receipt && <Receipt app={receipt} />}
    </Card>
  );
}

function StatusTracker({ apps }) {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState(null);
  const [searched, setSearched] = useState(false);

  function search() {
    setSearched(true);
    const match = apps.find((a) => a.id.toLowerCase() === query.trim().toLowerCase());
    setFound(match || null);
    if (match && match.stageIdx < STAGES.length - 1) {
      match.stageIdx += 1;
      match.status = STAGES[match.stageIdx];
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-navy-800 mb-3">Track Application Status</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Reference ID e.g. DL-2026-123456"
          className="flex-1 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:border-saffron-500 outline-none"
        />
        <button onClick={search} className="bg-navy-800 hover:bg-navy-900 text-white rounded-xl px-4 flex items-center gap-1.5 text-sm font-semibold">
          <Search size={16} /> Track
        </button>
      </div>

      {searched && !found && <p className="text-sm text-risk-text">No application found with that reference ID.</p>}

      {found && (
        <div>
          <p className="text-sm text-slate-500 mb-2">
            {found.type === "vehicle" ? "Vehicle Registration" : found.type === "permanent" ? "Permanent DL" : "Learner's Licence"} · {found.id}
          </p>
          <ol className="space-y-0">
            {STAGES.map((s, i) => {
              const done = i < found.stageIdx;
              const active = i === found.stageIdx;
              return (
                <li key={s} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                      done ? "bg-indiagreen-500 border-indiagreen-500 text-white" : active ? "bg-saffron-500 border-saffron-500 text-white" : "bg-white border-slate-300 text-slate-400"
                    }`}>{done ? "✓" : i + 1}</div>
                    {i < STAGES.length - 1 && <div className={`w-0.5 flex-1 min-h-[24px] ${done ? "bg-indiagreen-500" : "bg-slate-200"}`} />}
                  </div>
                  <p className={`text-sm pb-5 ${active || done ? "text-navy-800 font-semibold" : "text-slate-400"}`}>{s}</p>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {apps.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-500 mb-2">Your Applications</p>
          <div className="space-y-1.5">
            {apps.map((a) => (
              <button key={a.id} onClick={() => { setQuery(a.id); }} className="w-full text-left text-xs bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 flex justify-between">
                <span className="font-mono font-semibold">{a.id}</span>
                <span className="text-slate-500">{a.status}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function Input({ label, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-base focus:border-saffron-500 outline-none"
      />
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

function SubmitBtn({ submitting, label }) {
  return (
    <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-indiagreen-500 hover:bg-indiagreen-600 disabled:opacity-70 text-white font-bold rounded-xl py-3">
      {submitting && <Loader2 size={18} className="animate-spin" />}
      {label}
    </button>
  );
}
