import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { computeStreak } from "../utils/level.js";
import { updateStreak, grantXpAndCheckAchievements, unlockAchievement } from "../utils/journey.js";
import QuranProgress from "../models/QuranProgress.js";
import User from "../models/User.js";

const XP_PER_PAGE = 2;

export const logQuran = asyncHandler(async (req, res) => {
  const { surah, ayah, mode, durationMinutes, pagesRead, note } = req.body;
  if (!surah || !ayah) throw new ApiError("Surah and ayah are required", 400);

  const log = await QuranProgress.create({
    user: req.user._id,
    surah,
    ayah,
    mode: mode || "read",
    durationMinutes: durationMinutes || 0,
    pagesRead: pagesRead || 0,
    note: note || "",
  });

  const user = await User.findById(req.user._id);
  await updateStreak(user, "quran", log.loggedAt);
  await updateStreak(user, "overall", log.loggedAt);
  await user.save();

  const xp = (pagesRead || 1) * XP_PER_PAGE;
  await grantXpAndCheckAchievements(req, user, xp, "quran");

  const logs = await QuranProgress.find({ user: user._id });
  if (computeStreak(logs.map((l) => l.loggedAt)) >= 7)
    await unlockAchievement(req, user, "quran-streak-7");

  return ApiResponse.success(res, { log, streaks: user.streaks }, "Quran progress logged", 201);
});

export const listQuran = asyncHandler(async (req, res) => {
  const { limit = 100 } = req.query;
  const logs = await QuranProgress.find({ user: req.user._id })
    .sort({ loggedAt: -1 })
    .limit(Number(limit));
  return ApiResponse.success(res, { logs });
});

export const dailyAggregate = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const from = new Date();
  from.setDate(from.getDate() - Number(days));
  const logs = await QuranProgress.find({ user: req.user._id, loggedAt: { $gte: from } });
  const pagesTotal = logs.reduce((s, l) => s + (l.pagesRead || 0), 0);
  const byDay = {};
  for (const log of logs) {
    const day = new Date(log.loggedAt).toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }
  const streak = computeStreak(logs.map((l) => l.loggedAt));
  return ApiResponse.success(res, { byDay, streak, pagesTotal, total: logs.length });
});
