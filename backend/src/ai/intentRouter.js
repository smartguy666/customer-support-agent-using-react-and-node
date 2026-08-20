import { DNotifier } from "@dnotifier-realtime/dnotifier";

const intentAgent = DNotifier.defineAgent({
  name: "intent-agent",
  async run(ctx) {
    const result = await ctx.sendAI({
      message: {
        text: `Classify this as "status" (asking about an order/ticket status) or "general" (anything else). Question: ${ctx.input}`,
      },
      saveHistory: false,
      label: "Intent classification",
    });
    const text = (result?.data?.content ?? "").toLowerCase();
    const intent = text.includes("status") ? "status" : "general";
    ctx.state.intent = intent;
    return { intent };
  },
});

const generalAgent = DNotifier.defineAgent({
  name: "general-agent",
  async run(ctx) {
    const result = await ctx.sendAI({
      message: {
        useKnowledgeBase: true,
        text: `Answer briefly: ${ctx.input}`,
      },
      saveHistory: false,
      label: "General Q&A",
    });
    return { answer: result?.data?.content ?? "" };
  },
});

const supportWorkflow = new DNotifier.Workflow({
  name: "support-router",
  description: "Route customer messages to structured handlers or AI",
  observability: true,
  async entry(ctx) {
    const { intent } = await ctx.runAgent("intent-agent");

    if (intent === "status") {
      return { branch: "status", needsStructuredHandler: true };
    }

    const { answer } = await ctx.runAgent("general-agent", { input: ctx.input });
    return { branch: "general", answer };
  },
}).registerAgents({
  "intent-agent": intentAgent,
  "general-agent": generalAgent,
});

export { supportWorkflow };