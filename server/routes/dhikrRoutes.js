import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { logDhikr, listDhikr, dailyAggregate } from "../controllers/dhikrController.js";

const router = express.Router();
router.use(protect);

router.post("/log", logDhikr);
router.get("/list", listDhikr);
router.get("/daily", dailyAggregate);

export default router;
