import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Achievement from "../models/Achievement.js";
import Milestone from "../models/Milestone.js";

export const listAchievements = asyncHandler(async (req, res) => {
  const defs = await Achievement.find().sort({ xpReward: -1 });
  const unlocked = await Milestone.find({ user: req.user._id }).sort({ unlockedAt: -1 });
  const unlockedKeys = new Set(unlocked.map((m) => m.title));
  const data = defs.map((d) => ({
    ...d.toObject(),
    unlocked: unlockedKeys.has(d.title),
  }));
  return ApiResponse.success(res, { achievements: data, unlocked });
});

export const listMilestones = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find({ user: req.user._id }).sort({ unlockedAt: -1 });
  return ApiResponse.success(res, { milestones });
});
