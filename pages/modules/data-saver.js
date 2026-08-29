import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { BatteryLow, Wifi, WifiOff, CheckCircle2 } from "lucide-react";

export default function DataSaverSettings() {
  const { dataSaver, setDataSaver } = useApp();

  return (
    <ProtectedRoute>
      <Layout title="Low-Bandwidth Mode">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-1 flex items-center gap-2"><BatteryLow size={20} /> Data Saver Mode</h2>
          <p className="text-sm text-slate-500 mb-4">Optimized for 2G/3G connections and low-RAM devices.</p>

          <button
            onClick={() => setDataSaver(!dataSaver)}
            className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 ${
              dataSaver ? "bg-indiagreen-500 border-indiagreen-500 text-white" : "bg-slate-50 border-slate-200 text-navy-800"
            }`}
          >
            <span className="flex items-center gap-2 font-bold text-sm">
              {dataSaver ? <WifiOff size={18} /> : <Wifi size={18} />}
              {dataSaver ? "Data Saver is ON" : "Data Saver is OFF"}
            </span>
            <span className={`w-12 h-7 rounded-full p-1 transition-colors ${dataSaver ? "bg-white/30" : "bg-slate-300"}`}>
              <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${dataSaver ? "translate-x-5" : ""}`} />
            </span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <p className="text-sm font-semibold text-navy-800 mb-3">What changes when Data Saver is ON:</p>
          <ul className="space-y-2">
            {[
              "All shadows, animations, and scan-line effects are removed",
              "Document/photo previews are hidden across the Vault and Inspector modules",
              "Gradient backgrounds are stripped to flat, high-contrast colors",
              "Simplified, larger-text views are used throughout for faster rendering",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 bg-slate-50 rounded-lg p-2.5 text-sm text-navy-800">
                <CheckCircle2 size={15} className="text-indiagreen-500 shrink-0 mt-0.5" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
