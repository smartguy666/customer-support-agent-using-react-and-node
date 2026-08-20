import mongoose, { Schema } from "mongoose";

const recordSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    referenceId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export const Record = mongoose.model("Record", recordSchema);