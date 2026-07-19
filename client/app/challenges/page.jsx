"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import ChallengeProgress from "@/components/ChallengeProgress";
import { useNotification } from "@/context/NotificationContext";
import { apiCall } from "@/lib/api";

export default function ChallengesPage() {
  return (
    <ProtectedRoute>
      <ChallengesInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function ChallengesInner() {
  const { notify } = useNotification();
  const [challenges, setChallenges] = useState([]);
  const [mine, setMine] = useState([]);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState(30);

  const load = useCallback(async () => {
    try {
      const [all, my] = await Promise.all([
        apiCall("/api/challenges"),
        apiCall("/api/challenges/mine"),
      ]);
      setChallenges(all.data.challenges);
      setMine(my.data.participants);
    } catch (e) {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!title) return notify("Title required", "warning");
    try {
      await apiCall("/api/challenges", { method: "POST", body: { title, goal } });
      setTitle("");
      notify("Challenge created", "success");
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const join = async (id) => {
    await apiCall("/api/challenges/join", { method: "POST", body: { challengeId: id } });
    notify("Joined!", "success");
    load();
  };

  const progress = async (id) => {
    await apiCall("/api/challenges/progress", { method: "POST", body: { challengeId: id, amount: 1 } });
    load();
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Challenges</h1>
      <p className="opacity-70 mb-6">Grow through accountable community goals.</p>

      <GlassCard className="mb-6">
        <h3 className="font-semibold mb-2">Create a challenge</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Challenge title"
          className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none mb-2"
        />
        <div className="flex gap-2 items-center mb-3">
          <span className="text-sm opacity-70">Goal</span>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none w-24"
          />
        </div>
        <GlowButton onClick={create}>Create</GlowButton>
      </GlassCard>

      <h3 className="font-semibold mb-2">Available</h3>
      <ChallengeProgress
        challenges={challenges}
        mine={mine}
        onCreate={create}
        onJoin={join}
        onProgress={progress}
        onError={(m) => notify(m, "error")}
      />
    </main>
  );
}
