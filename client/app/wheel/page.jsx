"use client";
import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import { useNotification } from "@/context/NotificationContext";
import { apiCall } from "@/lib/api";

const SEGMENTS = [
  "10 XP", "25 XP", "Special Dua", "Streak Shield",
  "50 XP", "Guardian Badge", "5 XP", "Barakah Boost",
];

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
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [canSpin, setCanSpin] = useState(true);
  const wheelRef = useRef(null);

  useEffect(() => {
    apiCall("/api/wheel/history")
      .then((r) => setCanSpin(r.data.canSpin))
      .catch(() => {});
  }, []);

  const spin = async () => {
    if (spinning || !canSpin) return;
    setSpinning(true);
    try {
      const res = await apiCall("/api/wheel/spin", { method: "POST" });
      const idx = SEGMENTS.indexOf(res.data.reward.label);
      const seg = 360 / SEGMENTS.length;
      const target = 360 * 5 + (360 - idx * seg) - seg / 2;
      setRotation((r) => r + target);
      setResult(res.data.reward);
      setCanSpin(false);
      notify(`You won: ${res.data.reward.label}`, "success");
    } catch (e) {
      notify(e.message || "Spin failed", "error");
    } finally {
      setSpinning(false);
    }
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-1">Wheel of Good Deeds</h1>
      <p className="opacity-70 mb-6">One blessed spin each day.</p>

      <GlassCard className="inline-block">
        <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full border-4 border-emerald-400/40 relative overflow-hidden transition-transform duration-[3000ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SEGMENTS.map((s, i) => {
              const angle = (360 / SEGMENTS.length) * i;
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-start justify-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    background: i % 2 ? "rgba(20,184,166,0.25)" : "rgba(16,185,129,0.25)",
                    clipPath: "polygon(50% 50%, 100% 0, 100% 100%)",
                  }}
                >
                  <span
                    className="mt-4 text-xs font-semibold w-20 text-center"
                    style={{ transform: `rotate(${90 - angle}deg)` }}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#f5c451] rounded-full" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#f5c451]" />
        </div>

        <GlowButton onClick={spin} disabled={spinning || !canSpin} className="mt-6">
          {!canSpin ? "Come back tomorrow" : spinning ? "Spinning…" : "Spin"}
        </GlowButton>

        {result && (
          <div className="mt-4 text-lg font-semibold">Result: {result.label}</div>
        )}
      </GlassCard>
    </main>
  );
}
