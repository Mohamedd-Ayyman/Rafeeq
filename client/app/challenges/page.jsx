"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
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
    try {
      await apiCall("/api/challenges/join", { method: "POST", body: { challengeId: id } });
      notify("Joined!", "success");
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const progress = async (id, amount = 1) => {
    try {
      await apiCall("/api/challenges/progress", { method: "POST", body: { challengeId: id, amount } });
      load();
    } catch (e) {
      notify(e.message, "error");
    }
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
      <div className="space-y-3 mb-6">
        {challenges.map((c) => {
          const joined = mine.find((m) => String(m.challenge?._id) === String(c._id));
          return (
            <GlassCard key={c._id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{c.title}</div>
                <div className="text-sm opacity-70">
                  {c.goal} {c.unit} · {c.category}
                </div>
                {joined && (
                  <div className="text-xs opacity-60 mt-1">
                    Your progress: {joined.progress}/{c.goal} {joined.completed ? "✓" : ""}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {joined ? (
                  <GlowButton variant="ghost" onClick={() => progress(c._id)}>
                    +1
                  </GlowButton>
                ) : (
                  <GlowButton onClick={() => join(c._id)}>Join</GlowButton>
                )}
              </div>
            </GlassCard>
          );
        })}
        {challenges.length === 0 && <div className="opacity-60">No challenges yet.</div>}
      </div>
    </main>
  );
}
