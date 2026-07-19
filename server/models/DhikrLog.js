import mongoose from "mongoose";

const DhikrLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["tasbih", "istighfar", "salawat", "dua", "custom"],
      default: "tasbih",
    },
    count: { type: Number, default: 1, min: 1 },
    target: { type: Number, default: 0 },
    loggedAt: { type: Date, default: Date.now },
    note: { type: String, default: "" },
    clientId: { type: String, default: null, index: true },
  },
  { timestamps: true }
);

DhikrLogSchema.index({ user: 1, loggedAt: -1 });

const DhikrLog = mongoose.model("DhikrLog", DhikrLogSchema);
export default DhikrLog;
