import { ApiError } from "./apiError.js";

export class ApiResponse {
  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static error(res, message, statusCode = 400) {
    return res.status(statusCode).json({ success: false, message });
  }
}

export const throwError = (message, statusCode) => {
  throw new ApiError(message, statusCode);
};
