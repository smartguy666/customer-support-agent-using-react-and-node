import mongoose, { Schema } from "mongoose";

const rateLimitSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  count: { type: Number, default: 0 },
  windowStart: { type: Date, default: Date.now },
});

export const RateLimit = mongoose.model("RateLimit", rateLimitSchema);