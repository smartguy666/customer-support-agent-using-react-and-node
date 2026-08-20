import "dotenv/config";
import { connectDB } from "./connect.js";
import { Record } from "./models/record.model.js";

await connectDB();

await Record.create([
  { ownerId: "demo-user-1", referenceId: "REQ-1001", status: "in_progress" },
  { ownerId: "demo-user-1", referenceId: "REQ-1002", status: "completed" },
]);

console.log("✓ Seeded test records");
process.exit(0);