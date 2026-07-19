import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    kind: { type: String, enum: ["xp", "badge", "dua", "streak-shield"], default: "xp" },
    value: { type: Number, default: 0 },
  },
  { _id: false }
);

const WheelSpinSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    spunAt: { type: Date, default: Date.now },
    reward: { type: RewardSchema, required: true },
  },
  { timestamps: true }
);

WheelSpinSchema.index({ user: 1, spunAt: -1 });

const WheelSpin = mongoose.model("WheelSpin", WheelSpinSchema);
export default WheelSpin;
