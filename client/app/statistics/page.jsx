"use client";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import AnimatedProgressRing from "@/components/AnimatedProgressRing";
import { useNotification } from "@/context/NotificationContext";
import { apiCall } from "@/lib/api";
import { deriveLevel } from "@/lib/constants";

function StatsHeatmap({ heat }) {
  const days = useMemo(() => Object.keys(heat).sort(), [heat]);
  const max = Math.max(1, ...days.map((d) => heat[d].total));
  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((d) => {
        const v = heat[d].total;
        const intensity = Math.round((v / max) * 100);
        return (
          <div
            key={d}
            title={`${d}: ${v} actions`}
            className="aspect-square rounded-md"
            style={{
              background: `rgba(16,185,129,${0.15 + intensity / 130})`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function StatisticsPage() {
  return (
    <ProtectedRoute>
      <StatisticsInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function StatisticsInner() {
  const { notify } = useNotification();
  const [heat, setHeat] = useState({});
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    apiCall("/api/journey/heatmap?days=90")
      .then((r) => setHeat(r.data.heat))
      .catch((e) => notify(e.message, "error"));
    apiCall("/api/journey/summary")
      .then((r) => setSummary(r.data))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Statistics</h1>
      <p className="opacity-70 mb-6">A year is built one day at a time.</p>

      {summary && (
        <div className="flex items-center gap-4 mb-6">
          <AnimatedProgressRing
            progress={50}
            size={110}
            label={deriveLevel(summary.xp).name}
            sublabel={`${summary.xp} XP`}
          />
          <div className="flex-1 grid grid-cols-3 gap-2">
            <GlassCard>
              <div className="text-xl font-bold">{summary.counts.prayers}</div>
              <div className="text-xs opacity-70">Prayers</div>
            </GlassCard>
            <GlassCard>
              <div className="text-xl font-bold">{summary.counts.quranPages}</div>
              <div className="text-xs opacity-70">Quran</div>
            </GlassCard>
            <GlassCard>
              <div className="text-xl font-bold">{summary.counts.dhikr}</div>
              <div className="text-xs opacity-70">Dhikr</div>
            </GlassCard>
          </div>
        </div>
      )}

      <GlassCard>
        <h3 className="font-semibold mb-3">Activity heatmap (90 days)</h3>
        {Object.keys(heat).length ? (
          <StatsHeatmap heat={heat} />
        ) : (
          <div className="opacity-60">No activity yet.</div>
        )}
      </GlassCard>
    </main>
  );
}
