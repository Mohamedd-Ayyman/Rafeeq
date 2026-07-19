import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";
import { chat, recommend, memorizationReview } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", protect, chat);
router.post("/recommend", protect, recommend);
router.post("/memorization-review", protect, upload.single("audio"), memorizationReview);

export default router;
