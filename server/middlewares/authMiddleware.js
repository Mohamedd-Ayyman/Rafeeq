import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError("Not authorized, no token", 401);
  }
  const token = header.split(" ")[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new ApiError("Not authorized, token failed", 401);
  }
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError("User no longer exists", 401);
  if (!user.isApproved) throw new ApiError("Account pending approval", 403);
  req.user = user;
  next();
});
