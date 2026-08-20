import "dotenv/config";
import { DNotifier } from "@dnotifier-realtime/dnotifier";
import { businessConfig } from "../config/business.config.js";

const notifier = new DNotifier({
  appId: process.env.DNOTIFIER_APP_ID,
  secret: process.env.DNOTIFIER_SECRET,
  transport: "http",
  userId: "svc-ai",
  onConnected: () => {},
  onMessage: () => {},
  onDisconnected: () => {},
});

await notifier.connect();

for (const [topic, content] of Object.entries(businessConfig.faqs)) {
  await notifier.addDocument({
    senderId: "svc-ai",
    recordId: `faq-${topic}`,
    content,
    type: "faq",
  });
  console.log(`✓ Indexed: faq-${topic}`);
}

console.log("Done seeding knowledge base.");
process.exit(0);