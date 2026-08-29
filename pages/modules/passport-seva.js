import { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { lsGet, lsSet, generateReferenceId, simulateLatency } from "../../lib/storage";
import { BookOpenCheck, CheckCircle2, Loader2, CalendarCheck, FileEdit } from "lucide-react";

const SUB_TABS = [
  { id: "checklist", label: "Document Checklist" },
  { id: "appointment", label: "Book Appointment" },
  { id: "annexure", label: "Annexure Builder" },
];

function getChecklist({ applicantType, passportType, isMinor }) {
  const base = ["Aadhaar Card", "2 recent passport-size photographs (white background)", "Proof of Date of Birth"];
  if (passportType === "Reissue") base.push("Old/expired passport (original)");
  if (isMinor) base.push("Annexure C — Parental consent affidavit", "Both parents' Aadhaar & photographs");
  if (applicantType === "Government Employee") base.push("Annexure B — No Objection Certificate (NOC) from employer / Identity Certificate");
  if (applicantType === "Married Applicant") base.push("Marriage Certificate (if surname is being changed)");
  base.push("Address proof (utility bill / rent agreement / Aadhaar)");
  return base;
}

export default function PassportSeva() {
  const [tab, setTab] = useState("checklist");
  return (
    <ProtectedRoute>
      <Layout title="Passport Seva Workflow">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {SUB_TABS.map((t) => (
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
        {tab === "checklist" && <ChecklistGenerator />}
        {tab === "appointment" && <AppointmentWizard />}
        {tab === "annexure" && <AnnexureBuilder />}
      </Layout>
    </ProtectedRoute>
  );
}

function ChecklistGenerator() {
  const [form, setForm] = useState({ passportType: "Fresh", applicantType: "Standard Applicant", isMinor: false });
  const checklist = getChecklist(form);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
      <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><BookOpenCheck size={20} /> Personalized Document Checklist</h2>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Select label="Passport Type" value={form.passportType} onChange={(v) => setForm({ ...form, passportType: v })} options={["Fresh", "Reissue"]} />
        <Select label="Applicant Category" value={form.applicantType} onChange={(v) => setForm({ ...form, applicantType: v })}
          options={["Standard Applicant", "Government Employee", "Married Applicant"]} />
      </div>
      <label className="flex items-center gap-2 text-sm text-navy-800 mb-4">
        <input type="checkbox" checked={form.isMinor} onChange={(e) => setForm({ ...form, isMinor: e.target.checked })} className="w-4 h-4" />
        Applicant is a minor (below 18 years)
      </label>
      <ul className="space-y-2">
        {checklist.map((item, i) => (
          <li key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg p-2.5 text-sm text-navy-800">
            <CheckCircle2 size={15} className="text-indiagreen-500 shrink-0 mt-0.5" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppointmentWizard() {
  const { user } = useApp();
  const [form, setForm] = useState({ city: "Bhopal PSK", date: "", slot: "10:00 AM" });
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await simulateLatency(700, 1400);
    const appt = { id: generateReferenceId("PSK"), phone: user?.phone, ...form, bookedAt: new Date().toLocaleString("en-IN") };
    const all = lsGet("passportAppointments", []);
    all.push(appt);
    lsSet("passportAppointments", all);
    setBooking(appt);
    setSubmitting(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
      <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><CalendarCheck size={20} /> Book PSK Appointment</h2>
      {!booking ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Select label="Passport Seva Kendra" value={form.city} onChange={(v) => setForm({ ...form, city: v })}
            options={["Bhopal PSK", "Indore PSK", "Gwalior PSK", "Jabalpur PSK"]} />
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Preferred Date</label>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-base focus:border-saffron-500 outline-none" />
          </div>
          <Select label="Preferred Time Slot" value={form.slot} onChange={(v) => setForm({ ...form, slot: v })}
            options={["9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM"]} />
          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-indiagreen-500 hover:bg-indiagreen-600 disabled:opacity-70 text-white font-bold rounded-xl py-3">
            {submitting && <Loader2 size={18} className="animate-spin" />} Confirm Appointment
          </button>
        </form>
      ) : (
        <div className="bg-safe-bg border border-safe-border rounded-xl p-4">
          <p className="flex items-center gap-1.5 text-safe-text font-bold text-sm mb-1"><CheckCircle2 size={16} /> Appointment Confirmed</p>
          <p className="text-lg font-mono font-bold text-navy-800">{booking.id}</p>
          <p className="text-sm text-navy-800 mt-1">{booking.city} · {booking.date} · {booking.slot}</p>
          <p className="text-xs text-slate-500 mt-2">Arrive 15 minutes early with printed application + originals of all documents.</p>
        </div>
      )}
    </div>
  );
}

function AnnexureBuilder() {
  const [type, setType] = useState("Annexure C (Minor Passport Consent)");
  const [form, setForm] = useState({ parentName: "", childName: "", relation: "Father" });

  const preview = type.startsWith("Annexure C")
    ? `I, ${form.parentName || "[Parent Name]"}, ${form.relation.toLowerCase()} of ${form.childName || "[Child Name]"}, hereby give my consent for issuance of an Indian passport to my child and undertake full responsibility for the correctness of information provided in the application.`
    : `I, ${form.parentName || "[Applicant Name]"}, working as a Government servant, request that a No Objection Certificate be treated as annexed to my passport application, and undertake to inform my department upon issuance.`;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
      <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><FileEdit size={20} /> Annexure Builder</h2>
      <Select label="Annexure Type" value={type} onChange={setType}
        options={["Annexure C (Minor Passport Consent)", "Annexure B (Govt. Employee NOC Statement)"]} />
      <div className="grid grid-cols-2 gap-2 my-3">
        <Input label={type.startsWith("Annexure C") ? "Parent's Name" : "Applicant's Name"} value={form.parentName} onChange={(v) => setForm({ ...form, parentName: v })} />
        {type.startsWith("Annexure C") && <Input label="Child's Name" value={form.childName} onChange={(v) => setForm({ ...form, childName: v })} />}
        {type.startsWith("Annexure C") && (
          <Select label="Relation" value={form.relation} onChange={(v) => setForm({ ...form, relation: v })} options={["Father", "Mother", "Legal Guardian"]} />
        )}
      </div>
      <label className="text-xs font-semibold text-slate-500 mb-1 block">Generated Declaration Preview</label>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-navy-800 leading-relaxed">{preview}</div>
      <p className="text-xs text-slate-400 mt-2">Print this text on plain paper, sign it, and get it notarized/attested as instructed on the official Passport Seva checklist.</p>
    </div>
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
