import { useState, useRef, useEffect } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { INDIAN_LANGUAGES } from "../../lib/data/languages";
import { Mic, Volume2, Languages as LangIcon, Info, Loader2 } from "lucide-react";

export default function VoiceAssistant() {
  const { language, setLanguage } = useApp();
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState({ tts: false, stt: false });
  const recognitionRef = useRef(null);

  useEffect(() => {
    const tts = typeof window !== "undefined" && "speechSynthesis" in window;
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSpeechSupported({ tts, stt: !!SR });
  }, []);

  function handleSpeak() {
    if (!speechSupported.tts || !text.trim()) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function handleListen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  const currentLangLabel = INDIAN_LANGUAGES.find((l) => l.tag === language)?.label || language;

  return (
    <ProtectedRoute>
      <Layout title="Voice & Text Assistant">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-1 flex items-center gap-2">
            <LangIcon size={20} /> Choose Your Language
          </h2>
          <p className="text-sm text-slate-500 mb-3">
            Powers both speech-to-text and text-to-speech below via your device's built-in voice engine.
          </p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-3 text-base bg-white focus:border-saffron-500 outline-none"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.tag} value={l.tag}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-3">Speak or Type Your Request</h2>

          <button
            onClick={handleListen}
            disabled={!speechSupported.stt || listening}
            className="w-full flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl py-3 mb-3"
          >
            {listening ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
            {listening ? `Listening in ${currentLangLabel}…` : "Tap to Speak"}
          </button>

          {!speechSupported.stt && (
            <p className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
              <Info size={14} className="shrink-0 mt-0.5" />
              Your current browser doesn't expose the Web Speech Recognition API — try Chrome on
              Android/desktop for live mic input. Typing still works below.
            </p>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Apna sawaal yahan likhein... / Type your question here..."
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-base focus:border-saffron-500 outline-none resize-none mb-3"
          />

          <button
            onClick={handleSpeak}
            disabled={!speechSupported.tts || !text.trim()}
            className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-900 disabled:opacity-60 text-white font-semibold rounded-xl py-3"
          >
            <Volume2 size={18} /> Read Aloud in {currentLangLabel}
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center px-4">
          Voice quality depends on the language voice-packs installed on this device/browser.
          The selector above ships 40+ Indian languages and dialects; the architecture extends to
          the full scheduled + dialect list as more voice packs are registered.
        </p>
      </Layout>
    </ProtectedRoute>
  );
}
