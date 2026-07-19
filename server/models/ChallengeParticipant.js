import mongoose from "mongoose";

const ChallengeParticipantSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    progress: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    clientId: { type: String, default: null, index: true },
  },
  { timestamps: true }
);

ChallengeParticipantSchema.index({ challenge: 1, user: 1 }, { unique: true });

const ChallengeParticipant = mongoose.model(
  "ChallengeParticipant",
  ChallengeParticipantSchema
);
export default ChallengeParticipant;
