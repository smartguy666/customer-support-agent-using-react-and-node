import { businessConfig } from "../config/business.config.js";

export function registerFaqHandler(agent) {
  agent.registerHandler("faq", async (query) => {
    const topic = query.topic;
    const answer = businessConfig.faqs[topic];

    if (!answer) {
      return {
        message: "I don't have an answer for that topic yet.",
        availableTopics: Object.keys(businessConfig.faqs),
      };
    }

    return { message: answer };
  });
}