"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import BuddyActivity from "@/components/BuddyActivity";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { apiCall } from "@/lib/api";

export default function BuddyPage() {
  return (
    <ProtectedRoute>
      <BuddyInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function BuddyInner() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [buddies, setBuddies] = useState([]);
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const load = useCallback(async () => {
    try {
      const [b, u] = await Promise.all([
        apiCall("/api/buddy/list"),
        apiCall("/api/auth/me").then(() => apiCall("/api/auth/users").catch(() => ({ data: { users: [] } }))),
      ]);
      setBuddies(b.data.buddies);
      setUsers(u.data.users || []);
    } catch (e) {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addByEmail = async () => {
    try {
      const found = users.find((u) => u.email === email);
      if (!found) return notify("User not found", "error");
      await apiCall("/api/buddy/add", { method: "POST", body: { addresseeId: found._id } });
      notify("Buddy request sent", "success");
      setEmail("");
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const respond = async (id, status) => {
    await apiCall("/api/buddy/respond", { method: "POST", body: { buddyId: id, status } });
    load();
  };

  const encourage = async (id) => {
    await apiCall("/api/buddy/encourage", { method: "POST", body: { buddyId: id } });
    notify("Encouragement sent", "success");
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Buddies</h1>
      <p className="opacity-70 mb-6">Walk the path together — no private worship data shared.</p>

      <GlassCard className="mb-6">
        <h3 className="font-semibold mb-2">Add a buddy by email</h3>
        <div className="flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@email.com"
            className="flex-1 rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none"
          />
          <GlowButton onClick={addByEmail}>Send</GlowButton>
        </div>
      </GlassCard>

      <BuddyActivity
        buddies={buddies}
        currentUserId={user?._id}
        onRespond={respond}
        onEncourage={encourage}
        onError={(m) => notify(m, "error")}
      />
    </main>
  );
}
