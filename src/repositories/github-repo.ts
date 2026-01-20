import { z } from "zod";

export const GithubRepoInformations = z.array(
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
  }),
);

export type TGithubRepoInformations = z.infer<typeof GithubRepoInformations>;
