import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectBridge, sendToAgent } from "./bridge.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/support", async (req, res) => {
  try {
    const { demoUserId, ...query } = req.body;
    if (!demoUserId) {
      return res.status(400).json({ message: "demoUserId is required for this demo." });
    }
    const response = await sendToAgent(demoUserId, query);
    res.status(200).json(response);
  } catch (err) {
    console.error("Demo server error:", err.message);
    res.status(500).json({ message: "Something went wrong talking to the agent." });
  }
});

const PORT = process.env.DEMO_SERVER_PORT || 4000;

connectBridge().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Demo server listening on http://localhost:${PORT}`);
  });
});