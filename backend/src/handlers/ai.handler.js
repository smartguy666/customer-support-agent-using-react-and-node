import { DNotifier } from "@dnotifier-realtime/dnotifier";

let aiNotifier = null;

async function getAINotifier() {
  if (aiNotifier) return aiNotifier;

  aiNotifier = new DNotifier({
    appId: process.env.DNOTIFIER_APP_ID,
    secret: process.env.DNOTIFIER_SECRET,
    transport: "http",
    userId: "svc-ai",
    onConnected: () => {},
    onMessage: () => {},
    onDisconnected: () => {},
  });

  await aiNotifier.connect();
  return aiNotifier;
}

export function registerAIHandler(agent) {
  agent.registerHandler("ask", async (query, userId) => {
    const notifier = await getAINotifier();

    const result = await notifier.sendAI({
      senderId: userId,
      message: {
        useKnowledgeBase: true,
        messages: [
          { role: "system", content: "Answer briefly using only the provided knowledge." },
          { role: "user", content: query.question },
        ],
      },
    });

    return { message: result?.data?.content ?? "I couldn't find an answer to that." };
  });
}