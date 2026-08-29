import { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Plane, CheckCircle2 } from "lucide-react";

const COUNTRIES = ["UAE", "Saudi Arabia", "USA", "United Kingdom", "Canada", "Germany", "Singapore"];
const VISA_TYPES = ["Work Visa", "Student Visa", "Tourist Visa", "Dependent/Family Visa"];

function buildChecklist(country, visaType) {
  const common = ["Valid Passport (6+ months validity)", "Passport-size photographs per embassy spec", "Confirmed travel itinerary / return ticket"];
  const byType = {
    "Work Visa": ["Employment offer letter / contract", "Employer's sponsorship or LOI", "Educational & experience certificates (attested)", "Medical fitness certificate"],
    "Student Visa": ["University admission/offer letter", "Proof of tuition fee payment", "Bank statement showing sufficient funds", "Academic transcripts (attested)"],
    "Tourist Visa": ["Hotel booking confirmation", "Bank statement (last 3-6 months)", "Cover letter stating purpose of visit"],
    "Dependent/Family Visa": ["Sponsor's visa/residency copy", "Marriage/birth certificate showing relationship", "Sponsor's salary certificate"],
  };
  const byCountry = {
    "Saudi Arabia": ["Certificate attestation from MOFA (home country) + Saudi Embassy"],
    UAE: ["Certificate attestation from MOFAIC"],
    USA: ["DS-160 confirmation page", "Visa interview appointment confirmation"],
    "United Kingdom": ["Tuberculosis (TB) test certificate (if applicable)"],
  };
  return [...common, ...(byType[visaType] || []), ...(byCountry[country] || [])];
}

export default function VisaGuidance() {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [visaType, setVisaType] = useState(VISA_TYPES[0]);
  const checklist = buildChecklist(country, visaType);

  return (
    <ProtectedRoute>
      <Layout title="Visa & Immigration Guidance">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><Plane size={20} /> Build Your Visa Checklist</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Destination Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:border-saffron-500 outline-none">
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Visa Type</label>
              <select value={visaType} onChange={(e) => setVisaType(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:border-saffron-500 outline-none">
                {VISA_TYPES.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-3">Recommended documents for a {visaType.toLowerCase()} to {country}:</p>
          <ul className="space-y-2">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg p-2.5 text-sm text-navy-800">
                <CheckCircle2 size={15} className="text-indiagreen-500 shrink-0 mt-0.5" /> {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-3">
            This is general guidance only — always cross-check exact requirements on the destination
            country's official embassy/VFS Global page before applying.
          </p>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
