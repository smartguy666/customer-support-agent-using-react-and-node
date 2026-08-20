// src/core/rateLimiter.js
import { RateLimit } from "../db/models/rateLimit.model.js";

async function checkRateLimit(userId, { maxRequests = 20, windowMs = 24 * 60 * 60 * 1000 } = {}) {
  const now = new Date();
  let record = await RateLimit.findOne({ userId });

  if (!record || now - record.windowStart > windowMs) {
    record = await RateLimit.findOneAndUpdate(
      { userId },
      { count: 1, windowStart: now },
      { upsert: true, new: true }
    );
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  await record.save();
  return { allowed: true, remaining: maxRequests - record.count };
}

export { checkRateLimit };