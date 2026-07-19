"use client";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

const STEPS = [
  { key: "prayer", label: "Prayer", emoji: "🕌", href: "/prayer" },
  { key: "quran", label: "Qur'an", emoji: "📖", href: "/quran" },
  { key: "dhikr", label: "Dhikr", emoji: "📿", href: "/dhikr" },
  { key: "wheel", label: "Good Deeds", emoji: "🎡", href: "/wheel" },
  { key: "challenges", label: "Challenges", emoji: "🤝", href: "/challenges" },
  { key: "buddy", label: "Buddies", emoji: "🤲", href: "/buddy" },
];

export default function JourneyMap({ progress = {} }) {
  const total = STEPS.length;
  const done = STEPS.filter((s) => progress[s.key]).length;
  const pct = total ? (done / total) * 100 : 0;

  return (
    <GlassCard className="relative overflow-hidden" glow>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Your Spiritual Path</h3>
        <span className="text-sm opacity-70">{done}/{total} milestones</span>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-7 h-1 rounded-full bg-white/10" />
        <motion.div
          className="absolute left-0 top-7 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((s, i) => {
            const active = !!progress[s.key];
            return (
              <motion.a
                key={s.key}
                href={s.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.12 }}
                className="flex flex-col items-center gap-2 w-16"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 transition-colors ${
                    active
                      ? "bg-emerald-500/20 border-emerald-400 glow"
                      : "bg-white/5 border-white/15"
                  }`}
                >
                  {active ? s.emoji : "○"}
                </div>
                <span className="text-[10px] opacity-70 text-center leading-tight">
                  {s.label}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
