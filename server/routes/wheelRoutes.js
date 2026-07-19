import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";
import { spin, history } from "../controllers/wheelController.js";

const router = express.Router();
router.use(protect);

router.post("/spin", spin);
router.get("/history", history);

export default router;
