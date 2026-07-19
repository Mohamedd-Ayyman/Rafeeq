import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { logQuran, listQuran, dailyAggregate } from "../controllers/quranController.js";

const router = express.Router();
router.use(protect);

router.post("/log", logQuran);
router.get("/list", listQuran);
router.get("/daily", dailyAggregate);

export default router;
