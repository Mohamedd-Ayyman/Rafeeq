import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addBuddy,
  respondBuddy,
  encourageBuddy,
  celebrateBuddy,
  listBuddies,
} from "../controllers/buddyController.js";

const router = express.Router();
router.use(protect);

router.post("/add", addBuddy);
router.post("/respond", respondBuddy);
router.post("/encourage", encourageBuddy);
router.post("/celebrate", celebrateBuddy);
router.get("/list", listBuddies);

export default router;
