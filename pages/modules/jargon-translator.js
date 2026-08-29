import { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { JARGON_DICTIONARY } from "../../lib/data/jargonDictionary";
import { MessagesSquare, Search, Info } from "lucide-react";

export default function JargonTranslator() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return JARGON_DICTIONARY;
    const q = query.toLowerCase();
    return JARGON_DICTIONARY.filter(
      (j) => j.term.toLowerCase().includes(q) || j.category.toLowerCase().includes(q) || j.plain.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <ProtectedRoute>
      <Layout title="Jargon & Status Translator">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2"><MessagesSquare size={20} /> Search Any Term or Status Code</h2>
          <div className="flex items-center border border-slate-300 rounded-xl px-3 focus-within:border-saffron-500">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g. "Encumbrance Certificate" or "Section 14-B"'
              className="flex-1 px-2 py-3 outline-none text-base"
            />
          </div>
        </div>

        <div className="space-y-3">
          {results.map((j) => (
            <div key={j.term} className="bg-white rounded-2xl shadow-card border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-navy-800 text-sm">{j.term}</p>
                <span className="text-[10px] font-bold uppercase bg-info-bg text-info-text px-2 py-0.5 rounded-full">{j.category}</span>
              </div>
              <p className="text-sm text-navy-800 mb-1">{j.plain}</p>
              <p className="text-sm text-slate-600">{j.plainHi}</p>
            </div>
          ))}
          {results.length === 0 && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 flex items-start gap-2">
              <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-500">
                No exact match in our dictionary yet. Try simpler keywords (e.g. "mutation" instead of
                the full clause number), or ask about it at your local office quoting the exact code.
              </p>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
