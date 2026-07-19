import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { deriveLevel } from "../utils/level.js";
import User from "../models/User.js";
import Milestone from "../models/Milestone.js";
import PrayerLog from "../models/PrayerLog.js";
import QuranProgress from "../models/QuranProgress.js";
import DhikrLog from "../models/DhikrLog.js";

export const getSummary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const [prayers, quran, dhikr, milestones] = await Promise.all([
    PrayerLog.find({ user: user._id }),
    QuranProgress.find({ user: user._id }),
    DhikrLog.find({ user: user._id }),
    Milestone.find({ user: user._id }).sort({ unlockedAt: -1 }),
  ]);

  const summary = {
    xp: user.xp,
    level: deriveLevel(user.xp),
    streaks: user.streaks,
    counts: {
      prayers: prayers.length,
      quranPages: quran.reduce((s, l) => s + (l.pagesRead || 0), 0),
      dhikr: dhikr.reduce((s, l) => s + (l.count || 0), 0),
    },
    milestones,
  };
  return ApiResponse.success(res, summary);
});

export const getHeatmap = asyncHandler(async (req, res) => {
  const { days = 90 } = req.query;
  const from = new Date();
  from.setDate(from.getDate() - Number(days));

  const [prayers, quran, dhikr] = await Promise.all([
    PrayerLog.find({ user: req.user._id, prayedAt: { $gte: from } }),
    QuranProgress.find({ user: req.user._id, loggedAt: { $gte: from } }),
    DhikrLog.find({ user: req.user._id, loggedAt: { $gte: from } }),
  ]);

  const heat = {};
  const bump = (date, key) => {
    const day = new Date(date).toISOString().slice(0, 10);
    if (!heat[day]) heat[day] = { prayer: 0, quran: 0, dhikr: 0, total: 0 };
    heat[day][key] += 1;
    heat[day].total += 1;
  };
  prayers.forEach((p) => bump(p.prayedAt, "prayer"));
  quran.forEach((q) => bump(q.loggedAt, "quran"));
  dhikr.forEach((d) => bump(d.loggedAt, "dhikr"));

  return ApiResponse.success(res, { heat, days: Number(days) });
});
