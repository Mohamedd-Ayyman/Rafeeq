import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";
import {
  createChallenge,
  listChallenges,
  joinChallenge,
  updateProgress,
  myChallenges,
} from "../controllers/challengeController.js";

const router = express.Router();
router.use(protect);

router.post("/", restrictTo("admin"), createChallenge);
router.get("/", listChallenges);
router.get("/mine", myChallenges);
router.post("/join", joinChallenge);
router.post("/progress", updateProgress);

export default router;
