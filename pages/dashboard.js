import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import ModuleCard from "../components/ModuleCard";
import { useApp } from "../context/AppContext";
import { Info } from "lucide-react";

const MODULES = [
  { href: "/modules/voice-assistant", icon: "Languages", title: "Voice & Text Assistant", desc: "Speak or type in 40+ Indian languages & dialects", badge: "1" },
  { href: "/modules/guided-wizards", icon: "GitBranch", title: "Guided Wizards", desc: "Step-by-step help for Aadhaar, address & revenue changes", badge: "2" },
  { href: "/modules/driving-license", icon: "Car", title: "Driving Licence & Parivahan", desc: "Learner's/Permanent DL, RC transfer, status tracking", badge: "3" },
  { href: "/modules/education-verifier", icon: "GraduationCap", title: "Education Document Verifier", desc: "Scan SSC, Inter, Degree & Migration certificates", badge: "4" },
  { href: "/modules/passport-seva", icon: "BookOpenCheck", title: "Passport Seva Workflow", desc: "Checklist, appointment wizard & Annexure builder", badge: "5" },
  { href: "/modules/visa-guidance", icon: "Plane", title: "Visa & Immigration Guidance", desc: "Overseas documentation checklists by visa type", badge: "6" },
  { href: "/modules/vital-records", icon: "FileHeart", title: "Vital Records Portal", desc: "Birth, Death & Marriage certificates + corrections", badge: "7" },
  { href: "/modules/emergency-sos", icon: "Siren", title: "Emergency SOS Hotline", desc: "One-tap dial to police, ambulance & utility helplines", badge: "8" },
  { href: "/modules/scheme-matchmaker", icon: "Gift", title: "Welfare Scheme Matchmaker", desc: "Find Central & State schemes you qualify for", badge: "9" },
  { href: "/modules/grievance-portal", icon: "ShieldAlert", title: "Anti-Corruption Grievance", desc: "File anonymous, encrypted bribery complaints", badge: "10" },
  { href: "/modules/certificate-portal", icon: "Landmark", title: "Government Certificate Portal", desc: "MRO, Income, Caste, Community & Nativity certs", badge: "11" },
  { href: "/modules/doc-inspector", icon: "ScanSearch", title: "AI Document Inspector", desc: "Detect blur, missing stamps & name mismatches", badge: "12" },
  { href: "/modules/document-vault", icon: "Vault", title: "Secure Document Vault", desc: "Upload, preview & store encrypted certificates", badge: "13" },
  { href: "/modules/jargon-translator", icon: "MessagesSquare", title: "Jargon & Status Translator", desc: "Plain-language meaning of official terms & codes", badge: "14" },
  { href: "/modules/data-saver", icon: "BatteryLow", title: "Low-Bandwidth Mode", desc: "Configure your 2G/3G Data Saver experience", badge: "15" },
];

export default function Dashboard() {
  const { user, t } = useApp();

  return (
    <ProtectedRoute>
      <Layout title={t("dashboard")} showBack={false}>
        <div className="bg-navy-800 text-white rounded-2xl p-5">
          <p className="text-sm text-slate-300">{t("welcome")},</p>
          <h1 className="text-2xl font-extrabold">{user?.name || "Citizen"}</h1>
          {user?.state && (
            <p className="text-xs text-slate-300 mt-1">
              {user.state} · {user.category} · {user.age ? `${user.age} yrs` : ""}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl px-3 py-2.5">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p>
            Demo build — all documents, certificates, and application statuses shown across every
            module are synthetic. No live government backend is contacted.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-6">
          {MODULES.map((m) => (
            <ModuleCard key={m.href} {...m} />
          ))}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
