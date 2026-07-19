import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { grantXpAndCheckAchievements } from "../utils/journey.js";
import WheelSpin from "../models/WheelSpin.js";
import User from "../models/User.js";

const REWARDS = [
  { label: "10 XP", kind: "xp", value: 10 },
  { label: "25 XP", kind: "xp", value: 25 },
  { label: "Special Dua", kind: "dua", value: 0 },
  { label: "Streak Shield", kind: "streak-shield", value: 0 },
  { label: "50 XP", kind: "xp", value: 50 },
  { label: "Guardian Badge", kind: "badge", value: 0 },
  { label: "5 XP", kind: "xp", value: 5 },
  { label: "Barakah Boost", kind: "xp", value: 15 },
];

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const spin = asyncHandler(async (req, res) => {
  const today = startOfToday();
  const already = await WheelSpin.findOne({
    user: req.user._id,
    spunAt: { $gte: today },
  });
  if (already) throw new ApiError("You have already spun the wheel today", 429);

  const idx = Math.floor(Math.random() * REWARDS.length);
  const reward = REWARDS[idx];
  const spin = await WheelSpin.create({ user: req.user._id, reward });

  const user = await User.findById(req.user._id);
  if (reward.kind === "xp") {
    await grantXpAndCheckAchievements(req, user, reward.value, "general");
  } else {
    await user.save();
  }

  const io = req.app.get("io");
  if (io) io.to(`journey:${user._id}`).emit("wheel-result", { reward, spin });

  return ApiResponse.success(res, { reward, spin, index: idx }, "Wheel spun", 201);
});

export const history = asyncHandler(async (req, res) => {
  const spins = await WheelSpin.find({ user: req.user._id })
    .sort({ spunAt: -1 })
    .limit(30);
  const canSpin = !(await WheelSpin.exists({
    user: req.user._id,
    spunAt: { $gte: startOfToday() },
  }));
  return ApiResponse.success(res, { spins, canSpin });
});
