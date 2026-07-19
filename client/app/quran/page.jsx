"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import { useNotification } from "@/context/NotificationContext";
import { useJourney } from "@/context/JourneyContext";
import { apiCall } from "@/lib/api";

const MODES = ["read", "listen", "memorize"];

export default function QuranPage() {
  return (
    <ProtectedRoute>
      <QuranInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function QuranInner() {
  const { notify } = useNotification();
  const { refresh } = useJourney();
  const [logs, setLogs] = useState([]);
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [mode, setMode] = useState("read");
  const [pages, setPages] = useState(1);

  const load = useCallback(async () => {
    try {
      const res = await apiCall("/api/quran/list?limit=50");
      setLogs(res.data.logs);
    } catch (e) {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const log = async () => {
    try {
      await apiCall("/api/quran/log", {
        method: "POST",
        body: { surah: Number(surah), ayah: Number(ayah), mode, pagesRead: Number(pages) },
      });
      notify("Quran progress saved", "success");
      await load();
      refresh();
    } catch (e) {
      notify(e.message || "Failed", "error");
    }
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Qur&apos;an</h1>
      <p className="opacity-70 mb-6">Read, listen, and memorize — one page at a time.</p>

      <GlassCard className="mb-6">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="text-sm opacity-70">
            Surah
            <input
              type="number"
              min={1}
              max={114}
              value={surah}
              onChange={(e) => setSurah(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none"
            />
          </label>
          <label className="text-sm opacity-70">
            Ayah
            <input
              type="number"
              min={1}
              value={ayah}
              onChange={(e) => setAyah(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none"
            />
          </label>
        </div>
        <div className="flex gap-2 mb-3">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-2 rounded-xl text-sm capitalize ${
                mode === m ? "bg-teal-500 text-white" : "bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <label className="text-sm opacity-70">
          Pages read
          <input
            type="number"
            min={0}
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none"
          />
        </label>
        <GlowButton onClick={log} className="w-full mt-4">
          Save progress
        </GlowButton>
      </GlassCard>

      <div className="space-y-2">
        {logs.map((l) => (
          <div key={l._id} className="glass rounded-xl px-4 py-3 flex justify-between">
            <div className="font-medium">
              Surah {l.surah}:{l.ayah}
            </div>
            <div className="text-sm opacity-70 capitalize">{l.mode}</div>
            <div className="text-xs opacity-50">{new Date(l.loggedAt).toLocaleDateString()}</div>
          </div>
        ))}
        {logs.length === 0 && <div className="opacity-60">No progress logged yet.</div>}
      </div>
    </main>
  );
}
