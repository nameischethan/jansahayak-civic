import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSession, getUserByPhone, logout as authLogout } from "../lib/auth";
import { lsGet, lsSet } from "../lib/storage";

const AppContext = createContext(null);

// Minimal UI-string dictionary powering the app-wide language switcher
// (module 1 hooks into the same `language` state for TTS/STT locale).
const STRINGS = {
  "en-IN": { dashboard: "Dashboard", welcome: "Welcome", logout: "Logout" },
  "hi-IN": { dashboard: "डैशबोर्ड", welcome: "स्वागत है", logout: "लॉगआउट" },
  "te-IN": { dashboard: "డాష్‌బోర్డ్", welcome: "స్వాగతం", logout: "లాగ్ అవుట్" },
  "ta-IN": { dashboard: "டாஷ்போர்டு", welcome: "வரவேற்பு", logout: "வெளியேறு" },
  "bn-IN": { dashboard: "ড্যাশবোর্ড", welcome: "স্বাগতম", logout: "লগআউট" },
};

export function AppProvider({ children }) {
  const [session, setSessionState] = useState(null);
  const [user, setUser] = useState(null);
  const [dataSaver, setDataSaverState] = useState(false);
  const [language, setLanguageState] = useState("en-IN");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
    setDataSaverState(lsGet("dataSaver", false));
    setLanguageState(lsGet("language", "en-IN"));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (session?.phone) setUser(getUserByPhone(session.phone));
    else setUser(null);
  }, [session]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("data-saver", dataSaver);
    }
  }, [dataSaver]);

  const refreshSession = useCallback(() => setSessionState(getSession()), []);
  const refreshUser = useCallback(() => {
    if (session?.phone) setUser(getUserByPhone(session.phone));
  }, [session]);

  const setDataSaver = useCallback((v) => {
    setDataSaverState(v);
    lsSet("dataSaver", v);
  }, []);

  const setLanguage = useCallback((tag) => {
    setLanguageState(tag);
    lsSet("language", tag);
  }, []);

  const t = useCallback(
    (key) => (STRINGS[language] && STRINGS[language][key]) || STRINGS["en-IN"][key] || key,
    [language]
  );

  const logout = useCallback(() => {
    authLogout();
    setSessionState(null);
    setUser(null);
  }, []);

  return (
    <AppContext.Provider
      value={{ session, user, dataSaver, setDataSaver, language, setLanguage, t, refreshSession, refreshUser, logout, hydrated }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
