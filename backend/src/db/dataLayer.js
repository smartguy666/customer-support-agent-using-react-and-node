import { Record } from "./models/record.model.js";

async function findUserRecord(ownerId, referenceId) {
  return Record.findOne({ ownerId, referenceId });
}

async function listUserRecords(ownerId, limit = 5) {
  return Record.find({ ownerId }).sort({ createdAt: -1 }).limit(limit);
}

async function updateRecordStatus(ownerId, referenceId, newStatus) {
  return Record.findOneAndUpdate(
    { ownerId, referenceId },
    { status: newStatus },
    { new: true }
  );
}

export { findUserRecord, listUserRecords, updateRecordStatus };