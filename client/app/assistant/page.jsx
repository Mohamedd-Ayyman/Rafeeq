"use client";
import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import { useNotification } from "@/context/NotificationContext";
import { apiCall, apiUpload } from "@/lib/api";

export default function AssistantPage() {
  return (
    <ProtectedRoute>
      <AssistantInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function AssistantInner() {
  const { notify } = useNotification();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [slot, setSlot] = useState("5");
  const [recs, setRecs] = useState(null);
  const [review, setReview] = useState(null);
  const [audio, setAudio] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await apiCall("/api/ai/chat", {
        method: "POST",
        body: { message: input, history },
      });
      setMessages([...next, { role: "assistant", content: res.data.reply, mode: res.data.mode }]);
    } catch (e) {
      notify(e.message || "Chat failed", "error");
    } finally {
      setBusy(false);
    }
  };

  const getRecs = async () => {
    try {
      const res = await apiCall("/api/ai/recommend", { method: "POST", body: { slot } });
      setRecs(res.data.items);
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const submitReview = async () => {
    if (!audio) return notify("Choose an audio file first", "warning");
    try {
      const res = await apiUpload("/api/ai/memorization-review", audio);
      setReview(res.data.review);
      notify("Review ready", "success");
    } catch (e) {
      notify(e.message || "Upload failed", "error");
    }
  };

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">AI Assistant</h1>
      <p className="opacity-70 mb-6">Ask, get recommendations, and review your recitation.</p>

      <GlassCard className="mb-6">
        <div className="h-72 overflow-y-auto space-y-3 mb-3">
          {messages.length === 0 && (
            <div className="opacity-60 text-sm">Ask anything about worship, routine, or guidance.</div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-xl px-4 py-2 max-w-[85%] ${
                m.role === "user" ? "ml-auto bg-emerald-500/20" : "bg-white/10"
              }`}
            >
              <div className="text-sm">{m.content}</div>
              {m.mode && <div className="text-[10px] opacity-50 mt-1">{m.mode}</div>}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type your message…"
            className="flex-1 rounded-xl px-4 py-2 bg-white/10 border border-white/15 outline-none"
          />
          <GlowButton onClick={send} disabled={busy}>
            {busy ? "…" : "Send"}
          </GlowButton>
        </div>
      </GlassCard>

      <GlassCard className="mb-6">
        <h3 className="font-semibold mb-2">Worship recommendation</h3>
        <div className="flex gap-2 mb-3">
          {["3", "5", "10", "30"].map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={`px-3 py-1 rounded-lg text-sm ${slot === s ? "bg-teal-500 text-white" : "bg-white/10"}`}
            >
              {s} min
            </button>
          ))}
          <GlowButton variant="ghost" onClick={getRecs}>
            Get
          </GlowButton>
        </div>
        {recs && (
          <ul className="space-y-1 text-sm">
            {recs.map((r, i) => (
              <li key={i} className="opacity-80">
                • {r.title} — {r.detail} (+{r.xp} XP)
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold mb-2">Memorization review</h3>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files?.[0] || null)}
          className="mb-3 block text-sm"
        />
        <GlowButton onClick={submitReview}>Upload & review</GlowButton>
        {review && (
          <div className="mt-4 text-sm space-y-1">
            <div>Score: {review.score}/100</div>
            <ul className="list-disc list-inside opacity-80">
              {review.tajweedNotes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
            <div className="opacity-70">{review.encouragement}</div>
            <div className="text-xs opacity-50">{review.reference}</div>
          </div>
        )}
      </GlassCard>
    </main>
  );
}
