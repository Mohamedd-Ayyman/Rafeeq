export const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
export const STATUS_OPTIONS = ["onTime", "late", "missed", "excused"];

export const LEVELS = [
  { name: "Beginner", minXp: 0 },
  { name: "Consistent", minXp: 100 },
  { name: "Dedicated", minXp: 300 },
  { name: "Steadfast", minXp: 700 },
  { name: "Ihsan", minXp: 1500 },
];

export const deriveLevel = (xp) => {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.minXp) current = l;
  const idx = LEVELS.findIndex((l) => l.name === current.name);
  const next = LEVELS[idx + 1] || null;
  return {
    name: current.name,
    xp,
    levelIndex: idx,
    nextLevel: next ? next.name : null,
    xpToNext: next ? next.minXp - xp : 0,
  };
};
