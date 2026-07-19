import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { computeStreak } from "../utils/level.js";
import { updateStreak, grantXpAndCheckAchievements, unlockAchievement } from "../utils/journey.js";
import PrayerLog from "../models/PrayerLog.js";
import User from "../models/User.js";

const XP_PER_PRAYER = 5;

export const logPrayer = asyncHandler(async (req, res) => {
  const { prayer, status, prayedAt, location, note } = req.body;
  if (!prayer) throw new ApiError("Prayer name is required", 400);

  const log = await PrayerLog.create({
    user: req.user._id,
    prayer,
    status: status || "onTime",
    prayedAt: prayedAt || Date.now(),
    location: location || "",
    note: note || "",
  });

  const user = await User.findById(req.user._id);
  await updateStreak(user, "prayer", log.prayedAt);
  await updateStreak(user, "overall", log.prayedAt);
  await user.save();

  if (status !== "missed") {
    await grantXpAndCheckAchievements(req, user, XP_PER_PRAYER, "prayer");
    const dayLogs = await PrayerLog.find({ user: user._id });
    const dates = dayLogs.map((l) => l.prayedAt);
    if (computeStreak(dates) >= 7) await unlockAchievement(req, user, "prayer-streak-7");
  }

  return ApiResponse.success(res, { log, streaks: user.streaks }, "Prayer logged", 201);
});

export const listPrayers = asyncHandler(async (req, res) => {
  const { from, to, limit = 100 } = req.query;
  const filter = { user: req.user._id };
  if (from || to) {
    filter.prayedAt = {};
    if (from) filter.prayedAt.$gte = new Date(from);
    if (to) filter.prayedAt.$lte = new Date(to);
  }
  const logs = await PrayerLog.find(filter).sort({ prayedAt: -1 }).limit(Number(limit));
  return ApiResponse.success(res, { logs });
});

export const dailyAggregate = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const from = new Date();
  from.setDate(from.getDate() - Number(days));

  const logs = await PrayerLog.find({
    user: req.user._id,
    prayedAt: { $gte: from },
  });

  const byDay = {};
  for (const log of logs) {
    const day = new Date(log.prayedAt).toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }
  const streak = computeStreak(logs.map((l) => l.prayedAt));
  return ApiResponse.success(res, { byDay, streak, total: logs.length });
});
