"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "./GlassCard";
import AnimatedProgressRing from "./AnimatedProgressRing";
import { deriveLevel } from "@/lib/constants";

function Counter({ to, label, duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <GlassCard ref={ref} className="text-center">
      <div className="text-3xl font-bold tabular-nums">{val.toLocaleString()}</div>
      <div className="text-xs opacity-70 mt-1">{label}</div>
    </GlassCard>
  );
}

export default function JourneyRecap({ summary, heat = {} }) {
  if (!summary) return null;
  const level = deriveLevel(summary.xp || 0);
  const activeDays = Object.keys(heat).filter((d) => (heat[d].total || 0) > 0).length;

  const timeline = [
    { label: "Prayers offered", value: summary.counts?.prayers || 0 },
    { label: "Qur'an pages", value: summary.counts?.quranPages || 0 },
    { label: "Dhikr recited", value: summary.counts?.dhikr || 0 },
    { label: "Active days", value: activeDays },
  ];

  return (
    <div className="space-y-4">
      <GlassCard className="flex items-center gap-5" glow>
        <AnimatedProgressRing
          progress={level.nextLevel ? (level.xp / (level.xp + level.xpToNext)) * 100 : 100}
          size={120}
          label={level.name}
          sublabel={`${summary.xp} XP`}
        />
        <div>
          <div className="text-sm opacity-70">Your Ihsan Journey</div>
          <div className="text-2xl font-bold">{level.name}</div>
          {level.nextLevel && (
            <div className="text-sm opacity-70">{level.xpToNext} XP to {level.nextLevel}</div>
          )}
          <div className="text-xs opacity-50 mt-1">Growth is measured in consistency.</div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {timeline.map((t) => (
          <Counter key={t.label} to={t.value} label={t.label} />
        ))}
      </div>

      <GlassCard>
        <h3 className="font-semibold mb-2">Growth Timeline</h3>
        <p className="text-sm opacity-70">
          Over the recorded period you have shown up{" "}
          <span className="text-emerald-300 font-semibold">{activeDays}</span> active
          days. Every single day is a step on the path.
        </p>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          className="h-2 mt-3 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-[#f5c451]"
        />
      </GlassCard>
    </div>
  );
}
