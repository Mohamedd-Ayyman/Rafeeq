import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getSummary, getHeatmap } from "../controllers/journeyController.js";

const router = express.Router();
router.use(protect);

router.get("/summary", getSummary);
router.get("/heatmap", getHeatmap);

export default router;
