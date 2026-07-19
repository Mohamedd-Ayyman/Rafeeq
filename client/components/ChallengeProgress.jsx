"use client";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import GlowButton from "./GlowButton";

export default function ChallengeProgress({
  challenges = [],
  mine = [],
  onCreate,
  onJoin,
  onProgress,
  onError,
}) {
  const myMap = Object.fromEntries(
    (mine || []).map((m) => [String(m.challenge?._id || m.challenge), m])
  );

  const create = (title, goal) => onCreate?.({ title, goal }).catch(onError);
  const join = (id) => onJoin?.(id).catch(onError);
  const progress = (id) => onProgress?.(id).catch(onError);

  return (
    <div className="space-y-3">
      {challenges.map((c) => {
        const joined = myMap[String(c._id)];
        const pct = joined ? Math.min(100, (joined.progress / c.goal) * 100) : 0;
        return (
          <GlassCard key={c._id} className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm opacity-70">
                  {c.goal} {c.unit} · <span className="capitalize">{c.category}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {joined ? (
                  <GlowButton variant="ghost" onClick={() => progress(c._id)}>
                    +1
                  </GlowButton>
                ) : (
                  <GlowButton onClick={() => join(c._id)}>Join</GlowButton>
                )}
              </div>
            </div>

            {joined && (
              <div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  />
                </div>
                <div className="text-xs opacity-60 mt-1 flex justify-between">
                  <span>
                    {joined.progress}/{c.goal} {c.unit}
                  </span>
                  <span>{joined.completed ? "✓ Complete" : `${(pct).toFixed(0)}%`}</span>
                </div>
              </div>
            )}
          </GlassCard>
        );
      })}
      {challenges.length === 0 && (
        <div className="opacity-60">No challenges available yet.</div>
      )}
    </div>
  );
}
