"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";
import GlowButton from "./GlowButton";

export const WHEEL_SEGMENTS = [
  "10 XP", "25 XP", "Special Dua", "Streak Shield",
  "50 XP", "Guardian Badge", "5 XP", "Barakah Boost",
];

export default function WheelOfGoodDeeds({ canSpin = true, onSpin, onResult, result }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [localResult, setLocalResult] = useState(result || null);
  const [allowed, setAllowed] = useState(canSpin);
  const spins = useRef(0);

  useEffect(() => setAllowed(canSpin), [canSpin]);
  useEffect(() => setLocalResult(result || null), [result]);

  const spin = async () => {
    if (spinning || !allowed) return;
    setSpinning(true);
    try {
      const res = await onSpin?.();
      const reward = res?.data?.reward || res?.reward;
      const idx = WHEEL_SEGMENTS.indexOf(reward?.label);
      const seg = 360 / WHEEL_SEGMENTS.length;
      const target = 360 * 5 + (360 - idx * seg) - seg / 2;
      spins.current += 1;
      setRotation((r) => r + target);
      setLocalResult(reward);
      setAllowed(false);
      onResult?.(reward);
    } catch (e) {
      // surface but keep wheel usable if network error
    } finally {
      setSpinning(false);
    }
  };

  const seg = 360 / WHEEL_SEGMENTS.length;

  return (
    <GlassCard className="inline-block text-center" glow>
      <div className="relative mx-auto mb-4" style={{ width: 300, height: 300 }}>
        <motion.div
          className="w-full h-full rounded-full border-4 border-emerald-400/40 relative overflow-hidden"
          style={{ transform: `rotate(${rotation}deg)` }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
        >
          {WHEEL_SEGMENTS.map((s, i) => {
            const angle = seg * i;
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
                  className="mt-5 text-xs font-semibold w-24 text-center"
                  style={{ transform: `rotate(${90 - angle}deg)` }}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#f5c451] rounded-full glow" />
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#f5c451]" />
      </div>

      <GlowButton onClick={spin} disabled={spinning || !allowed} className="mt-2">
        {!allowed ? "Come back tomorrow" : spinning ? "Spinning…" : "Spin the Wheel"}
      </GlowButton>

      <AnimatePresence>
        {localResult && !spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="mt-4 text-lg font-semibold text-[#f5c451]"
          >
            🎉 {localResult.label}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
