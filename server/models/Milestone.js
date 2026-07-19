import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    unlockedAt: { type: Date, default: Date.now },
    acknowledged: { type: Boolean, default: false },
    clientId: { type: String, default: null, index: true },
  },
  { timestamps: true }
);

const Milestone = mongoose.model("Milestone", MilestoneSchema);
export default Milestone;
