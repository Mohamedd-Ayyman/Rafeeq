import mongoose from "mongoose";

const QuranProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    surah: { type: Number, required: true, min: 1, max: 114 },
    ayah: { type: Number, required: true, min: 1 },
    mode: {
      type: String,
      enum: ["read", "listen", "memorize"],
      default: "read",
    },
    durationMinutes: { type: Number, default: 0 },
    pagesRead: { type: Number, default: 0 },
    note: { type: String, default: "" },
    clientId: { type: String, default: null, index: true },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QuranProgressSchema.index({ user: 1, loggedAt: -1 });

const QuranProgress = mongoose.model("QuranProgress", QuranProgressSchema);
export default QuranProgress;
