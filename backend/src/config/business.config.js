export const businessConfig = {
  businessName: "Example Store",

  faqs: {
    hours: "We're open 9am–9pm, Monday to Saturday.",
    contact: "You can reach us at support@example.com.",
    shipping: "Delivery takes THREE TO FIVE days",
    return_policy: "Returns are accepted within 7 days of delivery.",
    payment: "We accept credit cards, debit cards, and cash on delivery.",
  },

  rateLimit: {
    maxRequests: 100,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
  },

  agentId: process.env.AGENT_ID,

  fallbackMessage: "Sorry, I didn't understand that. Try asking about hours, shipping, or your order status.",
};