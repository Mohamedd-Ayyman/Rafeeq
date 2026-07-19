import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import PrayerLog from "../models/PrayerLog.js";
import QuranProgress from "../models/QuranProgress.js";
import DhikrLog from "../models/DhikrLog.js";
import Milestone from "../models/Milestone.js";
import ChallengeParticipant from "../models/ChallengeParticipant.js";
import { updateStreak, grantXpAndCheckAchievements } from "../utils/journey.js";
import User from "../models/User.js";

const upserters = {
  prayer: async (item, user) => {
    const doc = await PrayerLog.findOneAndUpdate(
      { clientId: item.clientId, user: user._id },
      { ...item, user: user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return doc;
  },
  quran: async (item, user) => {
    return QuranProgress.findOneAndUpdate(
      { clientId: item.clientId, user: user._id },
      { ...item, user: user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },
  dhikr: async (item, user) => {
    return DhikrLog.findOneAndUpdate(
      { clientId: item.clientId, user: user._id },
      { ...item, user: user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },
  achievement: async (item, user) => {
    return Milestone.findOneAndUpdate(
      { clientId: item.clientId, user: user._id },
      { ...item, user: user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },
  challenge: async (item, user) => {
    return ChallengeParticipant.findOneAndUpdate(
      { clientId: item.clientId, user: user._id },
      { ...item, user: user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },
};

export const syncBatch = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;
  if (!Array.isArray(items)) throw new ApiError("items must be an array", 400);

  const user = await User.findById(req.user._id);
  const results = [];

  for (const item of items) {
    const type = item.type;
    if (!upserters[type]) {
      results.push({ clientId: item.clientId, status: "skipped", reason: "unknown type" });
      continue;
    }
    const saved = await upserters[type](item, user);
    results.push({ clientId: item.clientId, status: "ok", id: saved._id });
  }

  await updateStreak(user, "overall", new Date());
  await grantXpAndCheckAchievements(req, user, items.length, "general");
  await user.save();

  return ApiResponse.success(res, { results, synced: results.length }, "Sync complete");
});
