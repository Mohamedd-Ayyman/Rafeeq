"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import DhikrCounter from "@/components/DhikrCounter";
import { useNotification } from "@/context/NotificationContext";
import { useJourney } from "@/context/JourneyContext";
import { apiCall } from "@/lib/api";

export default function DhikrPage() {
  return (
    <ProtectedRoute>
      <DhikrInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function DhikrInner() {
  const { notify } = useNotification();
  const { refresh } = useJourney();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    apiCall("/api/dhikr/list?limit=30")
      .then((r) => setLogs(r.data.logs))
      .catch(() => {});
  }, []);

  const save = async (payload) => {
    await apiCall("/api/dhikr/log", { method: "POST", body: payload });
    notify(`${payload.count}× ${payload.name}`, "success");
    refresh();
    const r = await apiCall("/api/dhikr/list?limit=30");
    setLogs(r.data.logs);
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Dhikr</h1>
      <p className="opacity-70 mb-6">Remember Him, and He will remember you.</p>

      <DhikrCounter logs={logs} onSave={save} onError={(m) => notify(m, "error")} />
    </main>
  );
}
