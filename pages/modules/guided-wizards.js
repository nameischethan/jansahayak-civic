import { useState } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { WIZARDS } from "../../lib/data/wizards";
import { GitBranch, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import * as Icons from "lucide-react";

export default function GuidedWizards() {
  const [activeId, setActiveId] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [outcome, setOutcome] = useState(null);

  const wizard = WIZARDS.find((w) => w.id === activeId);

  function start(id) {
    setActiveId(id);
    setStepIdx(0);
    setAnswers({});
    setOutcome(null);
  }

  function reset() {
    setActiveId(null);
    setStepIdx(0);
    setAnswers({});
    setOutcome(null);
  }

  function answer(questionId, value) {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    if (stepIdx + 1 < wizard.questions.length) {
      setStepIdx(stepIdx + 1);
    } else {
      setOutcome(wizard.resolve(next));
    }
  }

  return (
    <ProtectedRoute>
      <Layout title="Guided Wizards">
        {!wizard && (
          <div className="grid gap-3">
            {WIZARDS.map((w) => {
              const Icon = Icons[toPascal(w.icon)] || GitBranch;
              return (
                <button
                  key={w.id}
                  onClick={() => start(w.id)}
                  className="flex items-center gap-3 bg-white rounded-2xl shadow-card border border-slate-100 p-4 text-left hover:border-saffron-400"
                >
                  <div className="w-11 h-11 rounded-xl bg-navy-800 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-800 text-sm">{w.title}</p>
                    <p className="text-xs text-slate-500">{w.titleHi}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {wizard && !outcome && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-1">
              {wizard.title} · Question {stepIdx + 1} of {wizard.questions.length}
            </p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4">
              <div
                className="h-1.5 bg-saffron-500 rounded-full transition-all"
                style={{ width: `${((stepIdx) / wizard.questions.length) * 100}%` }}
              />
            </div>
            <h2 className="text-lg font-bold text-navy-800 mb-1">{wizard.questions[stepIdx].text}</h2>
            <p className="text-sm text-slate-500 mb-4">{wizard.questions[stepIdx].textHi}</p>
            <div className="space-y-2">
              {wizard.questions[stepIdx].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => answer(wizard.questions[stepIdx].id, opt)}
                  className="w-full text-left bg-slate-50 hover:bg-saffron-50 border border-slate-200 hover:border-saffron-400 rounded-xl px-4 py-3 font-semibold text-navy-800 text-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {wizard && outcome && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <p className="flex items-center gap-1.5 text-safe-text font-bold text-sm mb-1">
              <CheckCircle2 size={16} /> Your Personalized Plan
            </p>
            <h2 className="text-lg font-bold text-navy-800">{outcome.title}</h2>
            <p className="text-sm text-slate-500 mb-3">{outcome.titleHi}</p>
            <ul className="space-y-2">
              {outcome.checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg p-2.5 text-sm text-navy-800">
                  <CheckCircle2 size={15} className="text-indiagreen-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            {outcome.note && (
              <p className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-3">
                <AlertCircle size={14} className="shrink-0 mt-0.5" /> {outcome.note}
              </p>
            )}
            <button
              onClick={reset}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold rounded-xl py-3"
            >
              <RotateCcw size={16} /> Try Another Wizard
            </button>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

function toPascal(kebab) {
  return kebab.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("");
}
