"use client";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { PRAYERS } from "@/lib/constants";

const STATUS_STYLES = {
  onTime: "text-emerald-300",
  late: "text-amber-300",
  missed: "text-red-300",
  excused: "text-slate-400",
};

export default function PrayerTimeline({ logs = [], onLog }) {
  const today = new Date().toDateString();
  const todays = logs.filter((l) => new Date(l.prayedAt).toDateString() === today);
  const byPrayer = Object.fromEntries(todays.map((l) => [l.prayer, l]));

  return (
    <GlassCard className="mb-6">
      <h3 className="font-semibold mb-3">Today&apos;s Prayer Path</h3>
      <div className="flex flex-col gap-2">
        {PRAYERS.map((p, i) => {
          const entry = byPrayer[p];
          const status = entry?.status || "pending";
          return (
            <motion.div
              key={p}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  status === "onTime"
                    ? "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                    : status === "late" || status === "excused"
                    ? "bg-amber-400"
                    : status === "missed"
                    ? "bg-red-400"
                    : "bg-white/20"
                }`}
              />
              <div className="capitalize w-16 font-medium">{p}</div>
              <div className={`text-sm ${STATUS_STYLES[status] || "opacity-50"}`}>
                {status === "pending" ? "—" : status}
              </div>
              {status === "pending" && onLog && (
                <button
                  onClick={() => onLog(p)}
                  className="ml-auto text-xs text-emerald-300 underline"
                >
                  Log
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
