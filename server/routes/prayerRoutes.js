import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { logPrayer, listPrayers, dailyAggregate } from "../controllers/prayerController.js";

const router = express.Router();
router.use(protect);

router.post("/log", logPrayer);
router.get("/list", listPrayers);
router.get("/daily", dailyAggregate);

export default router;
