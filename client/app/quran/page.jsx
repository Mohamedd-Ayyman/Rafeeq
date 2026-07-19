"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import QuranReader from "@/components/QuranReader";
import { useNotification } from "@/context/NotificationContext";
import { useJourney } from "@/context/JourneyContext";
import { apiCall } from "@/lib/api";

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

  const load = useCallback(async () => {
    try {
      const res = await apiCall("/api/quran/list?limit=50");
      setLogs(res.data.logs);
    } catch (e) {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (payload) => {
    await apiCall("/api/quran/log", { method: "POST", body: payload });
    notify("Quran progress saved", "success");
    await load();
    refresh();
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Qur&apos;an</h1>
      <p className="opacity-70 mb-6">Read, listen, and memorize — one page at a time.</p>

      <QuranReader logs={logs} onSave={save} onError={(m) => notify(m, "error")} />
    </main>
  );
}
