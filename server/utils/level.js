export const LEVELS = [
  { name: "Beginner", minXp: 0 },
  { name: "Consistent", minXp: 100 },
  { name: "Dedicated", minXp: 300 },
  { name: "Steadfast", minXp: 700 },
  { name: "Ihsan", minXp: 1500 },
];

export const deriveLevel = (xp) => {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
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

export const awardXp = (user, amount) => {
  const before = deriveLevel(user.xp || 0);
  user.xp = (user.xp || 0) + amount;
  const after = deriveLevel(user.xp);
  return { before, after, leveledUp: before.name !== after.name };
};

export const computeStreak = (dates) => {
  if (!dates || dates.length === 0) return 0;
  const daySet = new Set(
    dates.map((d) => new Date(d).toISOString().slice(0, 10))
  );
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (daySet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
