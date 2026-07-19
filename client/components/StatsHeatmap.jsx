"use client";
import { useMemo } from "react";
import GlassCard from "./GlassCard";

export default function StatsHeatmap({ heat = {}, days = 90, height = "auto" }) {
  const cells = useMemo(() => {
    const keys = Object.keys(heat).sort();
    const max = Math.max(1, ...keys.map((d) => heat[d].total || 0));
    return keys.map((d) => ({
      date: d,
      total: heat[d].total || 0,
      intensity: (heat[d].total || 0) / max,
    }));
  }, [heat]);

  if (cells.length === 0) {
    return (
      <GlassCard>
        <div className="opacity-60 text-sm">No activity recorded yet.</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          maxWidth: "100%",
        }}
      >
        {cells.map((c) => (
          <div
            key={c.date}
            title={`${c.date}: ${c.total} actions`}
            className="aspect-square rounded-md transition-transform hover:scale-125"
            style={{
              background: `rgba(16,185,129,${0.12 + c.intensity * 0.78})`,
              boxShadow: c.intensity > 0.66 ? "0 0 8px rgba(16,185,129,0.6)" : "none",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs opacity-50 mt-3">
        <span>{cells[0].date}</span>
        <span>{cells[cells.length - 1].date}</span>
      </div>
    </GlassCard>
  );
}
