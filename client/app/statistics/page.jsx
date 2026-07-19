"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import AnimatedProgressRing from "@/components/AnimatedProgressRing";
import StatsHeatmap from "@/components/StatsHeatmap";
import JourneyRecap from "@/components/JourneyRecap";
import { useNotification } from "@/context/NotificationContext";
import { apiCall } from "@/lib/api";
import { deriveLevel } from "@/lib/constants";

const Chart = dynamic(() => import("@/components/StatsCharts"), { ssr: false });

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

  const chartData = useMemo(
    () =>
      Object.keys(heat)
        .sort()
        .slice(-28)
        .map((d) => ({ date: d.slice(5), ...heat[d] })),
    [heat]
  );

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

      <GlassCard className="mb-4">
        <h3 className="font-semibold mb-3">Activity (last 28 days)</h3>
        <Chart data={chartData} />
      </GlassCard>

      <h3 className="font-semibold mb-2">Activity heatmap (90 days)</h3>
      <StatsHeatmap heat={heat} days={90} />

      {summary && (
        <>
          <h3 className="font-semibold mt-6 mb-2">Year Recap</h3>
          <JourneyRecap summary={summary} heat={heat} />
        </>
      )}
    </main>
  );
}
