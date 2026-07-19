"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import { useNotification } from "@/context/NotificationContext";
import { apiCall } from "@/lib/api";
import { getQueue, clearQueue } from "@/lib/offlineSync";

export default function OfflinePage() {
  return (
    <ProtectedRoute>
      <OfflineInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function OfflineInner() {
  const { notify } = useNotification();
  const [queue, setQueue] = useState([]);

  const load = useCallback(async () => {
    setQueue(await getQueue());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sync = async () => {
    const items = await getQueue();
    if (items.length === 0) return notify("Queue is empty", "info");
    if (!navigator.onLine) return notify("You're offline — try later", "warning");
    try {
      await apiCall("/api/sync/batch", { method: "POST", body: { items } });
      await clearQueue();
      notify("Synced successfully", "success");
      load();
    } catch (e) {
      notify(e.message || "Sync failed", "error");
    }
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Offline Sync</h1>
      <p className="opacity-70 mb-6">Items logged without a connection wait here.</p>

      <GlassCard className="mb-4">
        <GlowButton onClick={sync} className="w-full">
          Sync now ({queue.length})
        </GlowButton>
      </GlassCard>

      <div className="space-y-2">
        {queue.map((q) => (
          <div key={q.clientId} className="glass rounded-xl px-4 py-3">
            <div className="font-medium capitalize">{q.type}</div>
            <div className="text-xs opacity-60">
              {new Date(q.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        {queue.length === 0 && <div className="opacity-60">Nothing queued.</div>}
      </div>
    </main>
  );
}
