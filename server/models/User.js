import mongoose from "mongoose";

const streakSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["prayer", "quran", "dhikr", "overall"],
      default: "overall",
    },
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActive: { type: Date, default: null },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isApproved: { type: Boolean, default: false },
    xp: { type: Number, default: 0 },
    level: { type: String, default: "Beginner" },
    streaks: {
      type: [streakSchema],
      default: () => [
        { type: "prayer", current: 0, longest: 0 },
        { type: "quran", current: 0, longest: 0 },
        { type: "dhikr", current: 0, longest: 0 },
        { type: "overall", current: 0, longest: 0 },
      ],
    },
    fcmToken: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model("User", UserSchema);
export default User;
