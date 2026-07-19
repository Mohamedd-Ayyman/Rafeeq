import User from "../models/User.js";
import Achievement from "../models/Achievement.js";
import Milestone from "../models/Milestone.js";
import { awardXp, deriveLevel } from "./level.js";

export const updateStreak = async (user, type, date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  let streak = user.streaks.find((s) => s.type === type) || {
    type,
    current: 0,
    longest: 0,
    lastActive: null,
  };
  if (!user.streaks.find((s) => s.type === type)) user.streaks.push(streak);

  const last = streak.lastActive ? new Date(streak.lastActive) : null;
  if (last) last.setHours(0, 0, 0, 0);

  if (!last) {
    streak.current = 1;
  } else if (last.getTime() === day.getTime()) {
    // same day, no change
  } else {
    const prev = new Date(last);
    prev.setDate(prev.getDate() + 1);
    streak.current = prev.getTime() === day.getTime() ? streak.current + 1 : 1;
  }
  streak.lastActive = day;
  if (streak.current > streak.longest) streak.longest = streak.current;
  return streak;
};

export const grantXpAndCheckAchievements = async (req, user, amount, category) => {
  const result = awardXp(user, amount);
  await user.save();

  const io = req.app.get("io");
  if (io) {
    io.to(`journey:${user._id}`).emit("streak-updated", {
      userId: user._id,
      streaks: user.streaks,
      level: deriveLevel(user.xp),
    });
  }

  if (result.leveledUp) {
    const milestone = await Milestone.create({
      user: user._id,
      title: `Reached ${result.after.name}`,
      description: `You advanced to the ${result.after.name} level.`,
    });
    if (io) {
      io.to(`journey:${user._id}`).emit("achievement-unlocked", {
        type: "level",
        level: result.after.name,
        milestone,
      });
    }
  }
  return result;
};

export const unlockAchievement = async (req, user, key) => {
  const def = await Achievement.findOne({ key });
  if (!def) return null;
  const exists = await Milestone.findOne({ user: user._id, title: def.title });
  if (exists) return null;

  const milestone = await Milestone.create({
    user: user._id,
    title: def.title,
    description: def.description,
  });
  if (def.xpReward) {
    const res = await grantXpAndCheckAchievements(req, user, def.xpReward, def.category);
  } else {
    await user.save();
  }
  const io = req.app.get("io");
  if (io) {
    io.to(`journey:${user._id}`).emit("achievement-unlocked", {
      type: "achievement",
      achievement: def,
      milestone,
    });
  }
  return def;
};
