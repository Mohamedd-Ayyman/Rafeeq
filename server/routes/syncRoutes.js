import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { syncBatch } from "../controllers/syncController.js";

const router = express.Router();
router.use(protect);

router.post("/batch", syncBatch);

export default router;
