import { PendingConfirmation } from "../db/models/pendingConfirmation.model.js";
import { updateRecordStatus } from "../db/dataLayer.js";

export function registerConfirmationHandler(agent) {
  agent.registerHandler("cancel_with_confirmation", async (query, userId) => {
    if (!query.referenceId) return { message: "Please provide a referenceId to cancel." };

    await PendingConfirmation.findOneAndUpdate(
      { userId },
      { referenceId: query.referenceId },
      { upsert: true, new: true }
    );

    return {
      message: `Confirm cancelling ${query.referenceId}? Reply with type "confirm_yes" or "confirm_no".`,
    };
  });

  agent.registerHandler("confirm_yes", async (_query, userId) => {
    const pending = await PendingConfirmation.findOne({ userId });
    if (!pending) return { message: "No pending confirmation found." };

    await PendingConfirmation.deleteOne({ userId });

    const updated = await updateRecordStatus(userId, pending.referenceId, "cancelled");
    if (!updated) return { message: "Could not find that record to cancel." };

    return { message: `${pending.referenceId} has been cancelled.` };
  });

  agent.registerHandler("confirm_no", async (_query, userId) => {
    await PendingConfirmation.deleteOne({ userId });
    return { message: "Cancellation aborted." };
  });
}