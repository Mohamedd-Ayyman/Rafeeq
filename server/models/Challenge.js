import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["prayer", "quran", "dhikr", "general"],
      default: "general",
    },
    goal: { type: Number, default: 30 },
    unit: { type: String, default: "actions" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Challenge = mongoose.model("Challenge", ChallengeSchema);
export default Challenge;
