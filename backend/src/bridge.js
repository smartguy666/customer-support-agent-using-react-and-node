import { DNotifier } from "@dnotifier-realtime/dnotifier";
import WebSocket from "ws";

const AGENT_ID = process.env.AGENT_ID || "support_agent";
const pendingRequests = new Map();

const bridge = new DNotifier({
  appId: process.env.DNOTIFIER_APP_ID,
  secret: process.env.DNOTIFIER_SECRET,
  transport: "ws",
  userId: "demo_bridge",
  WebSocketImpl: WebSocket,
  onConnected: () => console.log("✓ [demo_bridge] Connected"),
  onMessage: (data) => {
    const response = data.payload.toJSON();
    const { requestId } = response;

    if (requestId && pendingRequests.has(requestId)) {
      const { resolve } = pendingRequests.get(requestId);
      resolve(response);
      pendingRequests.delete(requestId);
    }
  },
  onDisconnected: () => console.log("✗ [demo_bridge] Disconnected"),
});

async function connectBridge() {
  await bridge.connect();
}

function sendToAgent(userId, query, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const requestId =
      Date.now().toString() +
      Math.random().toString(36).slice(2);

    const timer = setTimeout(() => {
      pendingRequests.delete(requestId);
      reject(new Error("Agent response timeout"));
    }, timeoutMs);

    pendingRequests.set(requestId, {
      resolve: (data) => {
        clearTimeout(timer);
        resolve(data);
      },
    });

    bridge.send({
      senderId: "demo_bridge",
      receiverId: AGENT_ID,
      data: {
        ...query,
        requestId,
        __proxiedUserId: userId,
      },
    });
  });
}

export { connectBridge, sendToAgent };