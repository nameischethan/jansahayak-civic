import { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { WELFARE_SCHEMES, CATEGORY_OPTIONS, INDIAN_STATES } from "../../lib/data/schemes";
import { Gift, CheckCircle2, SlidersHorizontal } from "lucide-react";

export default function SchemeMatchmaker() {
  const { user } = useApp();
  const [filters, setFilters] = useState({
    age: user?.age || 30,
    income: user?.income || 200000,
    category: user?.category || "General",
    state: user?.state || "Madhya Pradesh",
  });

  const matches = useMemo(() => {
    return WELFARE_SCHEMES.filter((s) => {
      const ageOk = filters.age >= s.minAge && filters.age <= s.maxAge;
      const incomeOk = Number(filters.income) <= s.maxIncome;
      const categoryOk = s.eligibleCategories.includes(filters.category);
      const stateOk = s.states.includes("All") || s.states.includes(filters.state);
      return ageOk && incomeOk && categoryOk && stateOk;
    });
  }, [filters]);

  return (
    <ProtectedRoute>
      <Layout title="Welfare Scheme Matchmaker">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><SlidersHorizontal size={20} /> Your Details</h2>
          <div className="grid grid-cols-2 gap-3 mb-1">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Age: {filters.age}</label>
              <input type="range" min="0" max="90" value={filters.age} onChange={(e) => setFilters({ ...filters, age: Number(e.target.value) })} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Annual Income: ₹{Number(filters.income).toLocaleString("en-IN")}</label>
              <input type="range" min="0" max="1000000" step="10000" value={filters.income} onChange={(e) => setFilters({ ...filters, income: Number(e.target.value) })} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Category</label>
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:border-saffron-500 outline-none">
                {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">State</label>
              <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:border-saffron-500 outline-none">
                {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-1.5"><Gift size={16} /> {matches.length} scheme(s) you may be eligible for</p>
          <div className="space-y-3">
            {matches.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl shadow-card border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-navy-800 text-sm">{s.name}</p>
                  <span className="text-[10px] font-bold uppercase bg-info-bg text-info-text px-2 py-0.5 rounded-full">{s.level}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{s.category}</p>
                <p className="text-sm text-indiagreen-500 font-semibold mb-2">{s.benefit}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.docsNeeded.map((d) => (
                    <span key={d} className="text-[11px] bg-slate-50 border border-slate-200 rounded-full px-2 py-1 text-slate-600">{d}</span>
                  ))}
                </div>
              </div>
            ))}
            {matches.length === 0 && (
              <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 text-center text-sm text-slate-500">
                No schemes match these filters yet — try adjusting age, income, or state.
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
