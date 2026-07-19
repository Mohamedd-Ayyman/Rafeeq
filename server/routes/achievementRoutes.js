import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { listAchievements, listMilestones } from "../controllers/achievementController.js";

const router = express.Router();
router.use(protect);

router.get("/", listAchievements);
router.get("/milestones", listMilestones);

export default router;
