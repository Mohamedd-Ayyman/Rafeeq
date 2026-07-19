import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/config.js";
import User from "../models/User.js";
import Achievement from "../models/Achievement.js";
import Challenge from "../models/Challenge.js";
import PrayerLog from "../models/PrayerLog.js";
import Milestone from "../models/Milestone.js";

const ACHIEVEMENTS = [
  { key: "prayer-streak-7", title: "Week of Prayer", description: "Prayed consistently for 7 days", category: "streak", icon: "flame", xpReward: 20, threshold: 7 },
  { key: "quran-streak-7", title: "Week of Qur'an", description: "Engaged with Qur'an for 7 days", category: "streak", icon: "book", xpReward: 20, threshold: 7 },
  { key: "dhikr-streak-7", title: "Week of Dhikr", description: "Made dhikr for 7 days", category: "streak", icon: "heart", xpReward: 20, threshold: 7 },
  { key: "challenge-complete", title: "Challenge Champion", description: "Completed a worship challenge", category: "community", icon: "trophy", xpReward: 50, threshold: 1 },
  { key: "first-prayer", title: "First Steps", description: "Logged your first prayer", category: "prayer", icon: "star", xpReward: 10, threshold: 1 },
  { key: "level-steadfast", title: "Steadfast", description: "Reached the Steadfast level", category: "general", icon: "mountain", xpReward: 30, threshold: 1 },
];

const seed = async () => {
  await mongoose.connect(config.connString);
  console.log("Connected to MongoDB for seeding");

  await User.deleteMany({});
  await Achievement.deleteMany({});
  await Challenge.deleteMany({});
  await PrayerLog.deleteMany({});
  await Milestone.deleteMany({});

  await Achievement.insertMany(ACHIEVEMENTS);

  const adminHash = await bcrypt.hash("admin1234", 12);
  const admin = await User.create({
    name: "Admin Rafeeq",
    email: "admin@rafeeq.app",
    passwordHash: adminHash,
    role: "admin",
    isApproved: true,
    xp: 0,
    level: "Beginner",
  });

  const demoHash = await bcrypt.hash("demo1234", 12);
  const demo = await User.create({
    name: "Demo Muslim",
    email: "demo@rafeeq.app",
    passwordHash: demoHash,
    role: "user",
    isApproved: true,
    xp: 120,
    level: "Consistent",
  });

  const challenge = await Challenge.create({
    title: "30 Days of Fajr",
    description: "Pray Fajr on time for 30 days",
    category: "prayer",
    goal: 30,
    unit: "prayers",
    createdBy: admin._id,
  });

  const prayerNames = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  for (let d = 14; d >= 1; d--) {
    const day = new Date();
    day.setDate(day.getDate() - d);
    for (const p of prayerNames) {
      await PrayerLog.create({
        user: demo._id,
        prayer: p,
        status: "onTime",
        prayedAt: day,
      });
    }
  }

  await Milestone.create({ user: demo._id, title: "Week of Prayer", description: "Prayed consistently for 7 days" });

  console.log("Seed complete:");
  console.log("  Admin : admin@rafeeq.app / admin1234");
  console.log("  Demo  : demo@rafeeq.app / demo1234");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
