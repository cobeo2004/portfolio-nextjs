import { NextResponse } from "next/server";
import z from "zod";

const GithubRepoInformations = z.array(
  z.object({
    id: z.number().nullable(),
    name: z.string().nullable(),
    full_name: z.string().nullable(),
    description: z.string().nullable(),
    url: z.string().nullable(),
    html_url: z.string().nullable(),
    language: z.string().nullable(),
    is_template: z.boolean().nullable(),
    stargazers_count: z.number().nullable(),
    watchers_count: z.number().nullable(),
    updated_at: z.string().nullable(),
    created_at: z
      .string()
      .nullable()
      .transform((arg) => (arg ? new Date(arg) : null)),
    pushed_at: z
      .string()
      .nullable()
      .transform((arg) => (arg ? new Date(arg) : null)),
  })
);

export type GithubRepoInformationsType = z.infer<typeof GithubRepoInformations>;

export async function GET() {
  try {
    const resp = await fetch(
      `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
      {
        headers: {
          Authorization: "Bearer " + process.env.GITHUB_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.mercy-preview+json",
        },
      }
    );
    const data = await resp.json();
    const parsedData = await GithubRepoInformations.parseAsync(data);
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
