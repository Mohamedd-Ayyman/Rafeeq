import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { computeStreak } from "../utils/level.js";
import { updateStreak, grantXpAndCheckAchievements, unlockAchievement } from "../utils/journey.js";
import DhikrLog from "../models/DhikrLog.js";
import User from "../models/User.js";

const XP_PER_COUNT = 1;

export const logDhikr = asyncHandler(async (req, res) => {
  const { name, category, count, target, note } = req.body;
  if (!name) throw new ApiError("Dhikr name is required", 400);

  const log = await DhikrLog.create({
    user: req.user._id,
    name,
    category: category || "tasbih",
    count: count || 1,
    target: target || 0,
    note: note || "",
  });

  const user = await User.findById(req.user._id);
  await updateStreak(user, "dhikr", log.loggedAt);
  await updateStreak(user, "overall", log.loggedAt);
  await user.save();

  await grantXpAndCheckAchievements(req, user, (count || 1) * XP_PER_COUNT, "dhikr");

  const logs = await DhikrLog.find({ user: user._id });
  if (computeStreak(logs.map((l) => l.loggedAt)) >= 7)
    await unlockAchievement(req, user, "dhikr-streak-7");

  return ApiResponse.success(res, { log, streaks: user.streaks }, "Dhikr logged", 201);
});

export const listDhikr = asyncHandler(async (req, res) => {
  const { limit = 100 } = req.query;
  const logs = await DhikrLog.find({ user: req.user._id })
    .sort({ loggedAt: -1 })
    .limit(Number(limit));
  return ApiResponse.success(res, { logs });
});

export const dailyAggregate = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const from = new Date();
  from.setDate(from.getDate() - Number(days));
  const logs = await DhikrLog.find({ user: req.user._id, loggedAt: { $gte: from } });
  const totalCount = logs.reduce((s, l) => s + (l.count || 0), 0);
  const byDay = {};
  for (const log of logs) {
    const day = new Date(log.loggedAt).toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + (log.count || 0);
  }
  const streak = computeStreak(logs.map((l) => l.loggedAt));
  return ApiResponse.success(res, { byDay, streak, totalCount, total: logs.length });
});
