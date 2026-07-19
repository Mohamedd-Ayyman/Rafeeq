"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingNav from "@/components/FloatingNav";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsInner />
      <FloatingNav />
    </ProtectedRoute>
  );
}

function SettingsInner() {
  const { theme, toggle } = useTheme();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => setRegistered(true))
        .catch(() => {});
    }
  }, []);

  return (
    <main className="min-h-screen px-4 pt-8 pb-32 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Settings</h1>
      <p className="opacity-70 mb-6">Make Rafeeq yours.</p>

      <GlassCard className="mb-4 flex justify-between items-center">
        <div>
          <div className="font-medium">Theme</div>
          <div className="text-sm opacity-70">Currently {theme}</div>
        </div>
        <GlowButton variant="ghost" onClick={toggle}>
          Toggle {theme === "dark" ? "Light" : "Dark"}
        </GlowButton>
      </GlassCard>

      <GlassCard className="mb-4 flex justify-between items-center">
        <div>
          <div className="font-medium">Offline mode</div>
          <div className="text-sm opacity-70">
            {registered ? "Service worker active" : "Not registered"}
          </div>
        </div>
      </GlassCard>
    </main>
  );
}
