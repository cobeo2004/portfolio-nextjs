import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create rate limiter: 10 requests per 15 minutes
export const chatRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
  prefix: "chatbot",
});

export const githubRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "20 s"),
  analytics: true,
  prefix: "github",
});

export const checkGithubRateLimit = async (
  identifier: string,
): Promise<boolean> => {
  const { success } = await githubRateLimit.limit(identifier);
  return success;
};

/**
 * Check if request is rate limited
 * Returns true if allowed, false if rate limited
 */
export const checkRateLimit = async (identifier: string): Promise<boolean> => {
  const { success } = await chatRateLimit.limit(identifier);
  return success;
};
