"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { useJourney } from "@/context/JourneyContext";
import { deriveLevel } from "@/lib/constants";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function ProfileInner() {
  const { user } = useAuth();
  const { summary } = useJourney();
  const level = deriveLevel(user?.xp || 0);

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Profile</h1>
      <p className="opacity-70 mb-6">Your worship identity.</p>

      <GlassCard className="mb-4">
        <div className="text-2xl font-bold">{user?.name}</div>
        <div className="opacity-70 text-sm">{user?.email}</div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-sm">{level.name}</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-sm">{user?.xp} XP</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-sm capitalize">{user?.role}</span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        {(summary?.streaks || []).map((s) => (
          <GlassCard key={s.type}>
            <div className="text-sm opacity-70 capitalize">{s.type} streak</div>
            <div className="text-2xl font-bold">{s.current}</div>
            <div className="text-xs opacity-50">longest {s.longest}</div>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
