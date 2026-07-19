import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Buddy from "../models/Buddy.js";
import User from "../models/User.js";

export const addBuddy = asyncHandler(async (req, res) => {
  const { addresseeId } = req.body;
  if (!addresseeId) throw new ApiError("addresseeId is required", 400);
  if (addresseeId === String(req.user._id))
    throw new ApiError("Cannot add yourself as buddy", 400);

  const addressee = await User.findById(addresseeId);
  if (!addressee) throw new ApiError("User not found", 404);

  const existing = await Buddy.findOne({
    requester: req.user._id,
    addressee: addresseeId,
  });
  if (existing) throw new ApiError("Buddy request already sent", 409);

  const buddy = await Buddy.create({ requester: req.user._id, addressee: addresseeId });

  const io = req.app.get("io");
  if (io) {
    io.to(`role:user`).emit("buddy-notification", {
      type: "request",
      from: req.user._id,
      to: addresseeId,
      buddy,
    });
  }

  return ApiResponse.success(res, { buddy }, "Buddy request sent", 201);
});

export const respondBuddy = asyncHandler(async (req, res) => {
  const { buddyId, status } = req.body;
  if (!buddyId || !["accepted", "declined"].includes(status))
    throw new ApiError("buddyId and valid status required", 400);

  const buddy = await Buddy.findById(buddyId);
  if (!buddy) throw new ApiError("Buddy request not found", 404);
  if (String(buddy.addressee) !== String(req.user._id))
    throw new ApiError("Not authorized", 403);

  buddy.status = status;
  await buddy.save();
  return ApiResponse.success(res, { buddy }, "Buddy request updated");
});

export const encourageBuddy = asyncHandler(async (req, res) => {
  const { buddyId, message } = req.body;
  const buddy = await Buddy.findById(buddyId);
  if (!buddy || buddy.status !== "accepted") throw new ApiError("Buddy not found", 404);

  const io = req.app.get("io");
  const target =
    String(buddy.requester) === String(req.user._id) ? buddy.addressee : buddy.requester;
  if (io) {
    io.to(`role:user`).emit("buddy-notification", {
      type: "encourage",
      from: req.user._id,
      to: target,
      message: message || "Keep going, may Allah bless your journey!",
    });
  }
  return ApiResponse.success(res, { sent: true }, "Encouragement sent");
});

export const celebrateBuddy = asyncHandler(async (req, res) => {
  const { buddyId } = req.body;
  const buddy = await Buddy.findById(buddyId);
  if (!buddy || buddy.status !== "accepted") throw new ApiError("Buddy not found", 404);

  const io = req.app.get("io");
  const target =
    String(buddy.requester) === String(req.user._id) ? buddy.addressee : buddy.requester;
  if (io) {
    io.to(`role:user`).emit("buddy-notification", {
      type: "celebrate",
      from: req.user._id,
      to: target,
      milestone: "a worship milestone",
    });
  }
  return ApiResponse.success(res, { sent: true }, "Celebration sent");
});

export const listBuddies = asyncHandler(async (req, res) => {
  const buddies = await Buddy.find({
    $or: [{ requester: req.user._id }, { addressee: req.user._id }],
  })
    .populate("requester", "name email")
    .populate("addressee", "name email");
  return ApiResponse.success(res, { buddies });
});
