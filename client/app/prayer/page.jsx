"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PrayerTimeline from "@/components/PrayerTimeline";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useJourney } from "@/context/JourneyContext";
import { apiCall } from "@/lib/api";
import { enqueue, getQueue } from "@/lib/offlineSync";
import { PRAYERS, STATUS_OPTIONS } from "@/lib/constants";

export default function PrayerPage() {
  return (
    <ProtectedRoute>
      <PrayerInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function PrayerInner() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const { refresh } = useJourney();
  const [logs, setLogs] = useState([]);
  const [prayer, setPrayer] = useState("fajr");
  const [status, setStatus] = useState("onTime");

  const load = useCallback(async () => {
    try {
      const res = await apiCall("/api/prayer/list?limit=50");
      setLogs(res.data.logs);
    } catch (e) {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const log = async () => {
    const payload = {
      type: "prayer",
      prayer,
      status,
      prayedAt: new Date().toISOString(),
    };
    if (navigator.onLine) {
      try {
        await apiCall("/api/prayer/log", { method: "POST", body: payload });
        notify("Prayer logged", "success");
        await load();
        refresh();
        return;
      } catch (e) {
        notify("Saved offline", "warning");
      }
    }
    await enqueue(payload);
    notify("Saved offline — will sync", "warning");
    await load();
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Prayer</h1>
      <p className="opacity-70 mb-6">Record each salah with intention.</p>

      <PrayerTimeline logs={logs} onLog={(p) => { setPrayer(p); log(); }} />

      <GlassCard className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {PRAYERS.map((p) => (
            <button
              key={p}
              onClick={() => setPrayer(p)}
              className={`px-3 py-2 rounded-xl text-sm capitalize ${
                prayer === p ? "bg-emerald-500 text-white" : "bg-white/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl px-3 py-2 bg-white/10 border border-white/15 mb-4 w-full outline-none capitalize"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="text-black">
              {s}
            </option>
          ))}
        </select>
        <GlowButton onClick={log} className="w-full">
          Log prayer
        </GlowButton>
      </GlassCard>

      <div className="space-y-2">
        {logs.map((l) => (
          <div key={l._id} className="glass rounded-xl px-4 py-3 flex justify-between items-center">
            <div className="capitalize font-medium">{l.prayer}</div>
            <div className="text-sm opacity-70 capitalize">{l.status}</div>
            <div className="text-xs opacity-50">
              {new Date(l.prayedAt).toLocaleString()}
            </div>
          </div>
        ))}
        {logs.length === 0 && <div className="opacity-60">No prayers logged yet.</div>}
      </div>
    </main>
  );
}
