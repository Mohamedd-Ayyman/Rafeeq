"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import GlowButton from "./GlowButton";

const MODES = ["read", "listen", "memorize"];

export default function QuranReader({
  logs = [],
  onSave,
  onError,
}) {
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [mode, setMode] = useState("read");
  const [pages, setPages] = useState(1);

  const save = async () => {
    try {
      await onSave?.({
        surah: Number(surah),
        ayah: Number(ayah),
        mode,
        pagesRead: Number(pages),
      });
    } catch (e) {
      onError?.(e.message || "Failed");
    }
  };

  return (
    <GlassCard className="mb-6">
      <h3 className="font-semibold mb-3">Qur&apos;an Progress</h3>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <label className="text-sm opacity-70">
          Surah
          <input
            type="number"
            min={1}
            max={114}
            value={surah}
            onChange={(e) => setSurah(e.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none"
          />
        </label>
        <label className="text-sm opacity-70">
          Ayah
          <input
            type="number"
            min={1}
            value={ayah}
            onChange={(e) => setAyah(e.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none"
          />
        </label>
      </div>

      <div className="flex gap-2 mb-3">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-2 rounded-xl text-sm capitalize transition-colors ${
              mode === m ? "bg-teal-500 text-white" : "bg-white/10"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <label className="text-sm opacity-70">
        Pages read
        <input
          type="number"
          min={0}
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 outline-none"
        />
      </label>

      <GlowButton onClick={save} className="w-full mt-4">
        Save progress
      </GlowButton>

      <div className="mt-4 space-y-1">
        {logs.slice(0, 6).map((l) => (
          <motion.div
            key={l._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl px-3 py-2 flex justify-between text-sm"
          >
            <span className="font-medium">
              Surah {l.surah}:{l.ayah}
            </span>
            <span className="opacity-70 capitalize">{l.mode}</span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
