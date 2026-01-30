import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/lib/env";
import { redis } from "@/lib/redis";
import { checkGithubRateLimit } from "@/lib/rate-limit";
import { getIp } from "@/utils/get-ip";
import {
  GithubRepoInformations,
  TGithubRepoInformations,
} from "@/repositories/github-repo";
import { ResultAsync, ok } from "neverthrow";

const retrieveGithubRepoWithCache = async (): Promise<
  ResultAsync<TGithubRepoInformations, Error>
> => {
  let data;
  if (await redis.get("github-repo")) {
    data = await redis.get("github-repo");
    return ok(
      (typeof data === "string"
        ? JSON.parse(data)
        : data) as TGithubRepoInformations,
    );
  }
  const resp = await fetch(
    `https://api.github.com/users/${env.GITHUB_USERNAME}/repos`,
    {
      headers: {
        Authorization: "Bearer " + env.GITHUB_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.mercy-preview+json",
      },
    },
  );
  data = await resp.json();
  const parsedData = await GithubRepoInformations.parseAsync(data);
  await redis.set("github-repo", JSON.stringify(parsedData), {
    ex: 60 * 30,
  });
  return ok(parsedData as TGithubRepoInformations);
};

export async function GET(req: NextRequest) {
  const rateLimitResult = await checkGithubRateLimit(getIp(req) ?? "default");
  if (rateLimitResult.isErr()) {
    console.error("Rate limit error:", rateLimitResult.error);
    return NextResponse.json(
      { error: "Rate limit check failed" },
      { status: 500 },
    );
  }

  if (!rateLimitResult.value) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const data = await retrieveGithubRepoWithCache();
    if (data.isErr()) {
      return NextResponse.json(
        { error: "Failed to fetch repositories" },
        { status: 500 },
      );
    }
    return NextResponse.json(data.value, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 },
    );
  }
}
