"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlowButton from "@/components/GlowButton";
import GlassCard from "@/components/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      notify("Welcome back", "success");
      router.replace("/journey");
    } catch (err) {
      notify(err.message || "Login failed", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="aurora absolute inset-0 -z-10" />
      <GlassCard className="w-full max-w-md glow" glow>
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="opacity-70 mb-6 text-sm">Sign in to continue your journey.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl px-4 py-3 bg-white/10 border border-white/15 outline-none focus:border-emerald-400"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl px-4 py-3 bg-white/10 border border-white/15 outline-none focus:border-emerald-400"
          />
          <GlowButton type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </GlowButton>
        </form>
        <p className="mt-4 text-sm opacity-70">
          New here?{" "}
          <Link href="/register" className="text-emerald-300 underline">
            Create an account
          </Link>
        </p>
      </GlassCard>
    </main>
  );
}
