import { useEffect } from "react";
import { useRouter } from "next/router";
import { useApp } from "../context/AppContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { session, hydrated } = useApp();

  useEffect(() => {
    if (hydrated && !session) router.replace("/auth");
  }, [hydrated, session, router]);

  if (!hydrated || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <Loader2 className="animate-spin text-saffron-500" size={32} />
      </div>
    );
  }
  return children;
}
