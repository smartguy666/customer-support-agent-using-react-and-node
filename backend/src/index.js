import "dotenv/config";
import { DNotifier } from "@dnotifier-realtime/dnotifier";
import { connectDB } from "./db/connect.js";
import { SupportAgent } from "./core/SupportAgent.js";
import { businessConfig } from "./config/business.config.js";
import { registerFaqHandler } from "./handlers/faq.handler.js";
import { registerStatusHandler } from "./handlers/status.handler.js";
import { registerAIHandler } from "./handlers/ai.handler.js";
import { registerConfirmationHandler } from "./handlers/confirmation.handler.js";
import { supportWorkflow } from "./ai/intentRouter.js";

await connectDB();

const agent = new SupportAgent({
  appId: process.env.DNOTIFIER_APP_ID,
  secret: process.env.DNOTIFIER_SECRET,
  agentId: businessConfig.agentId,
  fallbackMessage: businessConfig.fallbackMessage,
  rateLimit: businessConfig.rateLimit,
});

registerFaqHandler(agent);
registerStatusHandler(agent);
registerAIHandler(agent);
registerConfirmationHandler(agent);

agent.registerHandler("smart_ask", async (query, userId) => {
    console.log(">>> SMART ASK RECEIVED:", query);

  const workflowNotifier = new DNotifier({
    appId: process.env.DNOTIFIER_APP_ID,
    secret: process.env.DNOTIFIER_SECRET,
    transport: "http",
    userId: "workflow-runner",
    onConnected: () => {},
    onMessage: () => {},
    onDisconnected: () => {},
  });
  await workflowNotifier.connect();

  const run = await workflowNotifier.runWorkflow({
    workflow: supportWorkflow,
    input: query.question,
  });

  return { message: run.result?.answer ?? "Let me check that for you.", executionId: run.executionId };
});

await agent.connect();
console.log(`✓ ${businessConfig.businessName} agent ready. Query types:`, agent.listHandlerTypes());

export { agent };