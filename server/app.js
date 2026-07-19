import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import journeyRoutes from "./routes/journeyRoutes.js";
import prayerRoutes from "./routes/prayerRoutes.js";
import quranRoutes from "./routes/quranRoutes.js";
import dhikrRoutes from "./routes/dhikrRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import buddyRoutes from "./routes/buddyRoutes.js";
import wheelRoutes from "./routes/wheelRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import syncRoutes from "./routes/syncRoutes.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", time: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/journey", journeyRoutes);
  app.use("/api/prayer", prayerRoutes);
  app.use("/api/quran", quranRoutes);
  app.use("/api/dhikr", dhikrRoutes);
  app.use("/api/achievements", achievementRoutes);
  app.use("/api/challenges", challengeRoutes);
  app.use("/api/buddy", buddyRoutes);
  app.use("/api/wheel", wheelRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/sync", syncRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  return app;
};
