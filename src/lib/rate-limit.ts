import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import { errors } from "./errors";

const chatRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
  prefix: "chatbot",
});

const githubRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "20 s"),
  analytics: true,
  prefix: "github",
});

export const checkGithubRateLimit = async (
  identifier: string,
): Promise<ResultAsync<boolean, Error>> => {
  try {
    const { success } = await githubRateLimit.limit(identifier);
    return okAsync(success);
  } catch (e) {
    return errAsync(e instanceof Error ? e : errors.rateLimitError("Unknown error"));
  }
};

export const checkRateLimit = async (
  identifier: string,
): Promise<ResultAsync<void, Error>> => {
  try {
    const { success } = await chatRateLimit.limit(identifier);
    if (!success) {
      return errAsync(errors.rateLimitExceeded());
    }
    return okAsync(undefined);
  } catch (e) {
    return errAsync(e instanceof Error ? e : errors.rateLimitError("Unknown error"));
  }
};
