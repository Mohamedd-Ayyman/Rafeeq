"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function StatsCharts({ data = [] }) {
  if (!data.length) {
    return <div className="opacity-60 text-sm">No activity yet.</div>;
  }

  const totals = data.map((d) => ({ date: d.date, total: d.total }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={totals} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} interval={3} />
          <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} width={24} />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(16,185,129,0.4)",
              borderRadius: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradTotal)"
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} interval={3} />
          <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} width={24} />
          <Tooltip
            cursor={{ fill: "rgba(16,185,129,0.1)" }}
            contentStyle={{
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(16,185,129,0.4)",
              borderRadius: 12,
            }}
          />
          <Bar dataKey="prayer" stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} animationDuration={900} />
          <Bar dataKey="quran" stackId="a" fill="#14b8a6" radius={[3, 3, 0, 0]} animationDuration={900} />
          <Bar dataKey="dhikr" stackId="a" fill="#f5c451" radius={[3, 3, 0, 0]} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
