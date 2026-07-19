import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["prayer", "quran", "dhikr", "streak", "community", "general"],
      default: "general",
    },
    icon: { type: String, default: "star" },
    xpReward: { type: Number, default: 10 },
    threshold: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Achievement = mongoose.model("Achievement", AchievementSchema);
export default Achievement;
