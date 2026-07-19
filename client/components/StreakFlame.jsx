"use client";
import { motion } from "framer-motion";

const FLAMES = [
  { emoji: "🌱", color: "#10b981" },
  { emoji: "🔥", color: "#f59e0b" },
  { emoji: "🔥🔥", color: "#f97316" },
  { emoji: "🔥🔥🔥", color: "#ef4444" },
  { emoji: "🌟🔥", color: "#eab308" },
  { emoji: "🌟⭐🔥", color: "#f5c451" },
];

export default function StreakFlame({ value = 0, label = "", size = "md" }) {
  const tier = Math.min(FLAMES.length - 1, Math.max(0, Math.floor(value / 7)));
  const { emoji, color } = FLAMES[tier];
  const dim = size === "sm" ? "text-2xl" : size === "lg" ? "text-5xl" : "text-3xl";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.06 }}
      className="glass rounded-2xl p-4 text-center relative overflow-hidden"
      style={{ boxShadow: `0 0 20px ${color}33` }}
    >
      <motion.div
        className={dim}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {emoji}
      </motion.div>
      <div className="text-2xl font-bold mt-1 tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-xs opacity-70 capitalize">{label}</div>
      {value === 0 && (
        <div className="text-[10px] opacity-60 mt-1">A fresh start awaits 🌿</div>
      )}
    </motion.div>
  );
}
