"use client";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
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
    try {
      await apiCall("/api/buddy/respond", { method: "POST", body: { buddyId: id, status } });
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const encourage = async (id) => {
    try {
      await apiCall("/api/buddy/encourage", { method: "POST", body: { buddyId: id } });
      notify("Encouragement sent", "success");
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const otherOf = (b) =>
    String(b.requester?._id) === String(user._id) ? b.addressee : b.requester;

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

      <div className="space-y-3">
        {buddies.map((b) => {
          const other = otherOf(b);
          return (
            <GlassCard key={b._id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{other?.name}</div>
                <div className="text-xs opacity-70">
                  {b.status}
                  {String(b.addressee?._id) === String(user._id) && b.status === "pending"
                    ? " · awaiting your response"
                    : ""}
                </div>
              </div>
              <div className="flex gap-2">
                {String(b.addressee?._id) === String(user._id) && b.status === "pending" && (
                  <>
                    <GlowButton onClick={() => respond(b._id, "accepted")}>Accept</GlowButton>
                    <GlowButton variant="ghost" onClick={() => respond(b._id, "declined")}>
                      Decline
                    </GlowButton>
                  </>
                )}
                {b.status === "accepted" && (
                  <GlowButton variant="ghost" onClick={() => encourage(b._id)}>
                    Encourage
                  </GlowButton>
                )}
              </div>
            </GlassCard>
          );
        })}
        {buddies.length === 0 && <div className="opacity-60">No buddies yet.</div>}
      </div>
    </main>
  );
}
