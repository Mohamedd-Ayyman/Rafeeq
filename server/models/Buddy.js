import mongoose from "mongoose";

const BuddySchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    addressee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BuddySchema.index({ requester: 1, addressee: 1 }, { unique: true });

const Buddy = mongoose.model("Buddy", BuddySchema);
export default Buddy;
