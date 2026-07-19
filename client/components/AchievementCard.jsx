"use client";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

const CATEGORY_ICON = {
  prayer: "🕌",
  quran: "📖",
  dhikr: "📿",
  streak: "🔥",
  charity: "🤝",
  community: "🤲",
  default: "🏅",
};

export default function AchievementCard({ achievement, onClick, className = "" }) {
  const a = achievement;
  const unlocked = !!a.unlocked;
  const icon = CATEGORY_ICON[a.category] || CATEGORY_ICON.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <GlassCard
        className={`text-center cursor-pointer ${unlocked ? "border-emerald-400/50" : "opacity-60"} ${className}`}
        glow={unlocked}
      >
        <motion.div
          className="text-4xl mb-2"
          animate={unlocked ? { rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {unlocked ? icon : "🔒"}
        </motion.div>
        <div className="font-semibold leading-tight">{a.title}</div>
        <div className="text-sm opacity-70 mt-1 min-h-[2.5rem]">{a.description}</div>
        <div className="text-xs opacity-50 mt-2">
          +{a.xpReward} XP · <span className="capitalize">{a.category}</span>
        </div>
        {unlocked && a.unlockedAt && (
          <div className="text-[10px] opacity-40 mt-1">
            {new Date(a.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
