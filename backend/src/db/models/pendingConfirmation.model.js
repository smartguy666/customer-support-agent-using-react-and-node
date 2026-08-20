import mongoose, { Schema } from "mongoose";

const pendingConfirmationSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    referenceId: { type: String, required: true },
  },
  { timestamps: true }
);

// Auto-delete confirmations older than 10 minutes (TTL index)
pendingConfirmationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export const PendingConfirmation = mongoose.model(
  "PendingConfirmation",
  pendingConfirmationSchema
);