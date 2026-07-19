"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import AnimatedProgressRing from "@/components/AnimatedProgressRing";
import { useJourney } from "@/context/JourneyContext";
import { useAuth } from "@/context/AuthContext";
import { deriveLevel } from "@/lib/constants";

function StreakFlame({ value, label }) {
  const emojis = ["", "🔥", "🔥🔥", "🔥🔥🔥", "🌟🔥", "🌟⭐🔥"];
  return (
    <GlassCard>
      <div className="text-3xl">{emojis[Math.min(value, 4)] || "🌟⭐🔥"}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className="text-sm opacity-70">{label}</div>
    </GlassCard>
  );
}

export default function JourneyPage() {
  return (
    <ProtectedRoute>
      <JourneyInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function JourneyInner() {
  const { summary } = useJourney();
  const { user } = useAuth();
  const level = deriveLevel(user?.xp || 0);

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Your Journey</h1>
      <p className="opacity-70 mb-6">Consistency is the quiet path to the heart&apos;s peace.</p>

      {summary && (
        <>
          <div className="flex items-center gap-6 mb-6">
            <AnimatedProgressRing
              progress={level.nextLevel ? (level.xpToNext / (level.xp + level.xpToNext || 1)) * 100 : 100}
              size={140}
              label={level.name}
              sublabel={`${level.xp} XP`}
            />
            <div className="flex-1">
              <div className="text-sm opacity-70">Current level</div>
              <div className="text-2xl font-bold">{level.name}</div>
              {level.nextLevel && (
                <div className="text-sm opacity-70 mt-1">
                  {level.xpToNext} XP to {level.nextLevel}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {(summary.streaks || []).map((s) => (
              <StreakFlame key={s.type} value={s.current} label={s.type} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <GlassCard>
              <div className="text-2xl font-bold">{summary.counts.prayers}</div>
              <div className="text-sm opacity-70">Prayers</div>
            </GlassCard>
            <GlassCard>
              <div className="text-2xl font-bold">{summary.counts.quranPages}</div>
              <div className="text-sm opacity-70">Quran pages</div>
            </GlassCard>
            <GlassCard>
              <div className="text-2xl font-bold">{summary.counts.dhikr}</div>
              <div className="text-sm opacity-70">Dhikr</div>
            </GlassCard>
          </div>
        </>
      )}
      {!summary && <div className="opacity-60">Loading your journey…</div>}
    </main>
  );
}
