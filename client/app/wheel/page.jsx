"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import WheelOfGoodDeeds from "@/components/WheelOfGoodDeeds";
import { useNotification } from "@/context/NotificationContext";
import { apiCall } from "@/lib/api";

export default function WheelPage() {
  return (
    <ProtectedRoute>
      <WheelInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function WheelInner() {
  const { notify } = useNotification();
  const [canSpin, setCanSpin] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    apiCall("/api/wheel/history")
      .then((r) => setCanSpin(r.data.canSpin))
      .catch(() => {});
  }, []);

  const spin = async () => {
    try {
      const res = await apiCall("/api/wheel/spin", { method: "POST" });
      notify(`You won: ${res.data.reward.label}`, "success");
      return res;
    } catch (e) {
      notify(e.message || "Spin failed", "error");
      throw e;
    }
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-1">Wheel of Good Deeds</h1>
      <p className="opacity-70 mb-6">One blessed spin each day.</p>

      <WheelOfGoodDeeds
        canSpin={canSpin}
        result={result}
        onSpin={spin}
        onResult={setResult}
      />
    </main>
  );
}
