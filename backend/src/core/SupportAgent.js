import { DNotifier } from "@dnotifier-realtime/dnotifier";
import WebSocket from "ws";
import { checkRateLimit } from "./rateLimiter.js";

class SupportAgent {
  constructor({ appId, secret, agentId, fallbackMessage, rateLimit }) {
    if (!appId || !secret || !agentId) {
      throw new Error("SupportAgent requires appId, secret, and agentId");
    }

    this.agentId = agentId;
    this.handlers = new Map();
    this.fallbackMessage = fallbackMessage ?? "Sorry, I didn't understand that request.";
    this.rateLimit = rateLimit ?? { maxRequests: 20, windowMs: 24 * 60 * 60 * 1000 };

    this.notifier = new DNotifier({
      appId,
      secret,
      transport: "ws",
      userId: agentId,
      WebSocketImpl: WebSocket,
      onConnected: () => console.log(`✓ [${agentId}] Connected`),
      onMessage: (data) => this._handleIncoming(data),
      onDisconnected: ({ reason } = {}) =>
        console.log(`✗ [${agentId}] Disconnected${reason ? `: ${reason}` : ""}`),
    });
  }

  registerHandler(type, handlerFn) {
    if (typeof handlerFn !== "function") {
      throw new Error(`Handler for "${type}" must be a function`);
    }
    this.handlers.set(type, handlerFn);
    return this;
  }

  listHandlerTypes() {
    return Array.from(this.handlers.keys());
  }

  async _reply(receiverId, data) {
    try {
      await this.notifier.send({ senderId: this.agentId, receiverId, data });
    } catch (err) {
      console.error(`[${this.agentId}] Failed to send reply to ${receiverId}:`, err.message);
    }
  }

  async _handleIncoming(data) {
    const senderBareId = data.metadata.sender.split(":")[1] ?? "unknown";
    let customerId = senderBareId;

    try {
      const query = data.payload.toJSON();

      customerId = query.__proxiedUserId ?? senderBareId;
      delete query.__proxiedUserId;

      const { allowed, remaining } = await checkRateLimit(customerId, this.rateLimit);
      if (!allowed) {
        return this._reply(senderBareId, {
          message: "You've reached today's request limit. Please try again tomorrow.",
          requestId: query.requestId,
        });
      }

      const handler = this.handlers.get(query.type);
      if (!handler) {
        return this._reply(senderBareId, {
          message: this.fallbackMessage,
          availableTypes: this.listHandlerTypes(),
          requestId: query.requestId,
        });
      }

      const response = await handler(query, customerId);
      response._remainingRequests = remaining;
      response.requestId = query.requestId; // lets the bridge correlate the reply
      await this._reply(senderBareId, response);
    } catch (err) {
      console.error(`[${this.agentId}] Error handling message from ${customerId}:`, err);
      await this._reply(senderBareId, {
        message: "Something went wrong processing your request. Please try again.",
      });
    }
  }

  async connect() {
    await this.notifier.connect();
    return this;
  }
}

export { SupportAgent };