import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const signToken = (payload) => {
  return jwt.sign(payload, config.secretKey, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.secretKey);
};
