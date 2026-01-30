import "server-only";
import { Redis } from "@upstash/redis";
import { okAsync, errAsync, ResultAsync } from "neverthrow";

export const redis = Redis.fromEnv();

export const getRedis = (): ResultAsync<Redis, Error> => {
  try {
    return okAsync(redis);
  } catch (e) {
    const error = e instanceof Error ? e : new Error("Failed to initialize Redis");
    return errAsync(error);
  }
};
