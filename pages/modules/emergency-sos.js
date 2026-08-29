import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { EMERGENCY_CONTACTS } from "../../lib/data/emergencyContacts";
import * as Icons from "lucide-react";
import { PhoneCall, AlertTriangle } from "lucide-react";

function toPascal(kebab) {
  return kebab.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("");
}

export default function EmergencySOS() {
  return (
    <ProtectedRoute>
      <Layout title="Emergency SOS Hotline">
        <div className="bg-risk-bg border border-risk-border rounded-2xl p-4 flex items-start gap-2">
          <AlertTriangle size={18} className="text-risk-text shrink-0 mt-0.5" />
          <p className="text-sm text-risk-text">
            In a life-threatening emergency, tap <strong>112</strong> (All-in-One) immediately. These
            buttons trigger your phone's real dialer — no data is sent anywhere by this app.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {EMERGENCY_CONTACTS.map((c) => {
            const Icon = Icons[toPascal(c.icon)] || PhoneCall;
            return (
              <a
                key={c.id}
                href={`tel:${c.number}`}
                className="flex flex-col gap-2 bg-white rounded-2xl shadow-card border border-slate-100 p-4 active:scale-95 transition-transform"
              >
                <div className="w-11 h-11 rounded-xl bg-risk-bg flex items-center justify-center">
                  <Icon size={22} className="text-risk-text" />
                </div>
                <p className="text-sm font-bold text-navy-800 leading-snug">{c.label}</p>
                <p className="text-xs text-slate-500 leading-snug">{c.desc}</p>
                <p className="text-lg font-mono font-extrabold text-indiagreen-500">{c.number}</p>
              </a>
            );
          })}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
