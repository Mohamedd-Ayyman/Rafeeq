"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import GlowButton from "./GlowButton";

const PRESETS = [
  { name: "SubhanAllah", category: "tasbih" },
  { name: "Alhamdulillah", category: "tasbih" },
  { name: "Allahu Akbar", category: "tasbih" },
  { name: "Astaghfirullah", category: "istighfar" },
  { name: "Salallahu alayhi wasallam", category: "salawat" },
];

export default function DhikrCounter({
  logs = [],
  onSave,
  onError,
}) {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [name, setName] = useState(PRESETS[0].name);
  const [category, setCategory] = useState(PRESETS[0].category);

  const progress = target ? Math.min(100, (count / target) * 100) : 0;
  const done = target > 0 && count >= target;

  const handleSave = async () => {
    if (count === 0) return;
    try {
      await onSave?.({ name, category, count, target });
      setCount(0);
    } catch (e) {
      onError?.(e.message || "Failed");
    }
  };

  return (
    <GlassCard className="text-center">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => {
              setName(p.name);
              setCategory(p.category);
            }}
            className={`px-3 py-2 rounded-xl text-xs transition-colors ${
              name === p.name ? "bg-emerald-500 text-white" : "bg-white/10"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <motion.div
        key={count}
        initial={{ scale: 0.94 }}
        animate={{ scale: 1 }}
        className="text-6xl font-bold tabular-nums my-2"
        style={{ textShadow: "0 0 24px rgba(16,185,129,0.5)" }}
      >
        {count}
      </motion.div>
      <div className="text-sm opacity-70 mb-1">
        of {target} · {name}
      </div>

      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="flex gap-3 justify-center items-center">
        <GlowButton onClick={() => setCount((c) => c + 1)} className="text-2xl px-8">
          +
        </GlowButton>
        <div className="flex flex-col gap-1">
          <GlowButton variant="ghost" onClick={() => setCount(0)}>
            Reset
          </GlowButton>
          <button onClick={handleSave} className="text-emerald-300 underline text-xs">
            Save count
          </button>
        </div>
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-emerald-300 font-semibold"
        >
          Target reached — MashaAllah 🌿
        </motion.div>
      )}

      {logs.length > 0 && (
        <div className="mt-4 space-y-1 text-left">
          {logs.slice(0, 5).map((l) => (
            <div key={l._id} className="glass rounded-xl px-3 py-2 flex justify-between text-sm">
              <span className="font-medium">{l.name}</span>
              <span className="opacity-70">×{l.count}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
