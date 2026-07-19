"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import AnimatedProgressRing from "@/components/AnimatedProgressRing";
import { useNotification } from "@/context/NotificationContext";
import { useJourney } from "@/context/JourneyContext";
import { apiCall } from "@/lib/api";

const PRESETS = [
  { name: "SubhanAllah", category: "tasbih" },
  { name: "Alhamdulillah", category: "tasbih" },
  { name: "Allahu Akbar", category: "tasbih" },
  { name: "Astaghfirullah", category: "istighfar" },
  { name: "Salallahu alayhi wasallam", category: "salawat" },
];

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
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [name, setName] = useState(PRESETS[0].name);
  const [category, setCategory] = useState(PRESETS[0].category);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    apiCall("/api/dhikr/list?limit=30")
      .then((r) => setLogs(r.data.logs))
      .catch(() => {});
  }, []);

  const save = async () => {
    if (count === 0) return;
    try {
      await apiCall("/api/dhikr/log", {
        method: "POST",
        body: { name, category, count, target },
      });
      notify(`${count}× ${name}`, "success");
      setCount(0);
      refresh();
      const r = await apiCall("/api/dhikr/list?limit=30");
      setLogs(r.data.logs);
    } catch (e) {
      notify(e.message || "Failed", "error");
    }
  };

  const progress = target ? Math.min(100, (count / target) * 100) : 0;

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Dhikr</h1>
      <p className="opacity-70 mb-6">Remember Him, and He will remember you.</p>

      <GlassCard className="mb-6 text-center">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setName(p.name);
                setCategory(p.category);
              }}
              className={`px-3 py-2 rounded-xl text-xs ${
                name === p.name ? "bg-emerald-500 text-white" : "bg-white/10"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <AnimatedProgressRing progress={progress} size={200} label={count} sublabel={`/ ${target}`} />
        <div className="mt-4 text-lg font-medium">{name}</div>

        <div className="flex gap-3 justify-center mt-6">
          <GlowButton onClick={() => setCount((c) => c + 1)} className="text-2xl px-8">
            +
          </GlowButton>
          <GlowButton variant="ghost" onClick={() => setCount(0)}>
            Reset
          </GlowButton>
        </div>
        <div className="mt-4">
          <button onClick={save} className="text-emerald-300 underline text-sm">
            Save count
          </button>
        </div>
      </GlassCard>

      <div className="space-y-2">
        {logs.map((l) => (
          <div key={l._id} className="glass rounded-xl px-4 py-3 flex justify-between">
            <div className="font-medium">{l.name}</div>
            <div className="text-sm opacity-70">×{l.count}</div>
            <div className="text-xs opacity-50">{new Date(l.loggedAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
