import express from "express";
import { register, login, me, approve, logout, listUsers } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/approve", protect, restrictTo("admin"), approve);
router.post("/logout", protect, logout);
router.get("/users", protect, listUsers);

export default router;
