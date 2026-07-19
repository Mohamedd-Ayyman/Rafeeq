"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import { useNotification } from "@/context/NotificationContext";
import { apiCall } from "@/lib/api";

export default function AchievementsPage() {
  return (
    <ProtectedRoute>
      <AchievementsInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function AchievementCard({ a }) {
  return (
    <GlassCard className={a.unlocked ? "border-emerald-400/50" : "opacity-60"}>
      <div className="text-3xl mb-2">
        {a.unlocked ? "🏅" : "🔒"}
      </div>
      <div className="font-semibold">{a.title}</div>
      <div className="text-sm opacity-70">{a.description}</div>
      <div className="text-xs opacity-50 mt-1">+{a.xpReward} XP · {a.category}</div>
    </GlassCard>
  );
}

function AchievementsInner() {
  const { notify } = useNotification();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall("/api/achievements")
      .then((r) => setAchievements(r.data.achievements))
      .catch((e) => notify(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Achievements</h1>
      <p className="opacity-70 mb-6">
        {unlockedCount}/{achievements.length} unlocked
      </p>
      {loading ? (
        <div className="opacity-60">Loading…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((a) => (
            <AchievementCard key={a._id} a={a} />
          ))}
        </div>
      )}
    </main>
  );
}
