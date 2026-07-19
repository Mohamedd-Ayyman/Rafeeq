import mongoose from "mongoose";

const PrayerLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    prayer: {
      type: String,
      enum: ["fajr", "dhuhr", "asr", "maghrib", "isha", "sunrise", "taraweeh", "witr"],
      required: true,
    },
    status: {
      type: String,
      enum: ["onTime", "late", "missed", "excused"],
      default: "onTime",
    },
    prayedAt: { type: Date, default: Date.now },
    location: { type: String, default: "" },
    note: { type: String, default: "" },
    clientId: { type: String, default: null, index: true },
  },
  { timestamps: true }
);

PrayerLogSchema.index({ user: 1, prayedAt: -1 });

const PrayerLog = mongoose.model("PrayerLog", PrayerLogSchema);
export default PrayerLog;
