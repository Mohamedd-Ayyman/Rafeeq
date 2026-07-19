import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { unlockAchievement } from "../utils/journey.js";
import Challenge from "../models/Challenge.js";
import ChallengeParticipant from "../models/ChallengeParticipant.js";
import User from "../models/User.js";

export const createChallenge = asyncHandler(async (req, res) => {
  const { title, description, category, goal, unit, endDate } = req.body;
  if (!title) throw new ApiError("Title is required", 400);
  const challenge = await Challenge.create({
    title,
    description: description || "",
    category: category || "general",
    goal: goal || 30,
    unit: unit || "actions",
    endDate: endDate || null,
    createdBy: req.user._id,
  });
  await ChallengeParticipant.create({ challenge: challenge._id, user: req.user._id });
  return ApiResponse.success(res, { challenge }, "Challenge created", 201);
});

export const listChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenge.find({ isActive: true }).sort({ createdAt: -1 });
  return ApiResponse.success(res, { challenges });
});

export const joinChallenge = asyncHandler(async (req, res) => {
  const { challengeId } = req.body;
  if (!challengeId) throw new ApiError("challengeId is required", 400);
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) throw new ApiError("Challenge not found", 404);

  const existing = await ChallengeParticipant.findOne({
    challenge: challengeId,
    user: req.user._id,
  });
  if (existing) throw new ApiError("Already joined", 409);

  const participant = await ChallengeParticipant.create({
    challenge: challengeId,
    user: req.user._id,
  });

  const io = req.app.get("io");
  if (io)
    io.to(`challenge:${challengeId}`).emit("challenge-progress", {
      challengeId,
      participant: req.user._id,
      joined: true,
    });

  return ApiResponse.success(res, { participant }, "Joined challenge", 201);
});

export const updateProgress = asyncHandler(async (req, res) => {
  const { challengeId, amount = 1 } = req.body;
  if (!challengeId) throw new ApiError("challengeId is required", 400);

  const participant = await ChallengeParticipant.findOneAndUpdate(
    { challenge: challengeId, user: req.user._id },
    { $inc: { progress: amount } },
    { new: true }
  );
  if (!participant) throw new ApiError("Not a participant", 404);

  const challenge = await Challenge.findById(challengeId);
  if (challenge && participant.progress >= challenge.goal && !participant.completed) {
    participant.completed = true;
    await participant.save();
    await unlockAchievement(req, await User.findById(req.user._id), "challenge-complete");
  }

  const io = req.app.get("io");
  if (io)
    io.to(`challenge:${challengeId}`).emit("challenge-progress", {
      challengeId,
      participant: req.user._id,
      progress: participant.progress,
      completed: participant.completed,
    });

  return ApiResponse.success(res, { participant });
});

export const myChallenges = asyncHandler(async (req, res) => {
  const participants = await ChallengeParticipant.find({ user: req.user._id }).populate(
    "challenge"
  );
  return ApiResponse.success(res, { participants });
});
