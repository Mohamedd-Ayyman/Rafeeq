"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import AnimatedProgressRing from "@/components/AnimatedProgressRing";
import StreakFlame from "@/components/StreakFlame";
import JourneyMap from "@/components/JourneyMap";
import JourneyRecap from "@/components/JourneyRecap";
import { useJourney } from "@/context/JourneyContext";
import { useAuth } from "@/context/AuthContext";
import { deriveLevel } from "@/lib/constants";
import { apiCall } from "@/lib/api";

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
  const [heat, setHeat] = useState({});
  const level = deriveLevel(user?.xp || 0);

  useEffect(() => {
    apiCall("/api/journey/heatmap?days=90")
      .then((r) => setHeat(r.data.heat))
      .catch(() => {});
  }, []);

  const progress = summary
    ? {
        prayer: (summary.streaks || []).some((s) => s.type === "prayer" && s.current > 0) || summary.counts?.prayers > 0,
        quran: (summary.counts?.quranPages || 0) > 0,
        dhikr: (summary.counts?.dhikr || 0) > 0,
        wheel: summary.counts?.prayers > 0 && summary.counts?.quranPages > 0,
        challenges: false,
        buddy: false,
      }
    : {};

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Your Journey</h1>
      <p className="opacity-70 mb-6">Consistency is the quiet path to the heart&apos;s peace.</p>

      {summary && (
        <>
          <JourneyMap progress={progress} />

          <div className="flex items-center gap-6 my-6">
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

          <div className="grid grid-cols-3 gap-3 mb-6">
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

          <h3 className="font-semibold mb-2">Year in Review</h3>
          <JourneyRecap summary={summary} heat={heat} />
        </>
      )}
      {!summary && <div className="opacity-60">Loading your journey…</div>}
    </main>
  );
}
