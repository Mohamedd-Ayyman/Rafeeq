import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { signToken } from "../utils/jwt.js";
import { awardXp } from "../utils/level.js";
import User from "../models/User.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError("Name, email and password are required", 400);
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError("Email already registered", 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    isApproved: false,
  });

  return ApiResponse.success(
    res,
    { user: user.toSafeJSON() },
    "Registration received. Account pending approval.",
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError("Email and password required", 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash"
  );
  if (!user) throw new ApiError("Invalid credentials", 401);

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new ApiError("Invalid credentials", 401);

  if (!user.isApproved) throw new ApiError("Account pending approval", 403);

  const token = signToken({ id: user._id, role: user.role });
  return ApiResponse.success(res, { token, user: user.toSafeJSON() }, "Login successful");
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError("User not found", 404);
  return ApiResponse.success(res, { user: user.toSafeJSON() });
});

export const approve = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new ApiError("userId is required", 400);
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);
  user.isApproved = true;
  await user.save();
  return ApiResponse.success(res, { user: user.toSafeJSON() }, "User approved");
});

export const logout = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, null, "Logged out");
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isApproved: true }).select("name email role");
  return ApiResponse.success(res, { users });
});
