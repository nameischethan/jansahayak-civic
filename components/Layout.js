import { useRouter } from "next/router";
import { ArrowLeft, Wifi, WifiOff, LogOut, Landmark } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Layout({ children, title, showBack = true }) {
  const router = useRouter();
  const { dataSaver, setDataSaver, user, logout } = useApp();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-16">
      <header className="bg-navy-800 text-white sticky top-0 z-30 shadow-card">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {showBack && router.pathname !== "/dashboard" ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-navy-900 flex items-center justify-center shrink-0"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-saffron-500 flex items-center justify-center shrink-0">
                <Landmark size={20} />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-base leading-tight truncate">{title || "JanSahayak"}</p>
              {user?.name && <p className="text-[11px] text-slate-300 leading-tight truncate">Hi, {user.name}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className="flex items-center gap-1.5 bg-navy-700 hover:bg-navy-900 px-2.5 py-2 rounded-lg text-xs font-semibold"
              aria-pressed={dataSaver}
              title="Toggle Data Saver / Low-Bandwidth Mode"
            >
              {dataSaver ? <WifiOff size={15} /> : <Wifi size={15} />}
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-navy-700 hover:bg-navy-900 px-2.5 py-2 rounded-lg text-xs font-semibold"
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-5 space-y-5">{children}</main>
    </div>
  );
}
