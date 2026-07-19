import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const restrictTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError("Not authorized for this action", 403);
    }
    next();
  });
