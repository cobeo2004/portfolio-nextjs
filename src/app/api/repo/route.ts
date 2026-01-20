import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/lib/env";
import { rateLimit, redis } from "@/lib/redis";
import { getIp } from "@/utils/get-ip";
import {
  GithubRepoInformations,
  TGithubRepoInformations,
} from "@/repositories/github-repo";

const retrieveGithubRepoWithCache =
  async (): Promise<TGithubRepoInformations> => {
    let data;
    if (await redis.get("github-repo")) {
      data = await redis.get("github-repo");
      return (
        typeof data === "string" ? JSON.parse(data) : data
      ) as TGithubRepoInformations;
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
    return parsedData as TGithubRepoInformations;
  };

export async function GET(req: NextRequest) {
  try {
    const { success } = await rateLimit.limit(getIp(req) ?? "default");
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }
    const data = await retrieveGithubRepoWithCache();
    return NextResponse.json(data, { status: 200 });
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
