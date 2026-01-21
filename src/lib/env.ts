import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";
export const env = createEnv({
  server: {
    GITHUB_TOKEN: z.string(),
    GITHUB_USERNAME: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    // OpenRouter & AI Configuration
    OPENROUTER_API_KEY: z.string(),
    OPENROUTER_MODEL: z.string().default("anthropic/claude-3-haiku"),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    OPENAI_API_KEY: z.string(),
    EMBEDDING_MODEL: z.string().default("openai/text-embedding-3-small"),
  },
  client: {
    NEXT_PUBLIC_SERVICE_ID: z.string(),
    NEXT_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_TEMPLATE_ID: z.string(),
    NEXT_PUBLIC_README_STATS: z.string(),
    // Supabase Public Configuration
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },
  runtimeEnv: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_SERVICE_ID: process.env.NEXT_PUBLIC_SERVICE_ID,
    NEXT_PUBLIC_KEY: process.env.NEXT_PUBLIC_KEY,
    NEXT_PUBLIC_TEMPLATE_ID: process.env.NEXT_PUBLIC_TEMPLATE_ID,
    NEXT_PUBLIC_README_STATS: process.env.NEXT_PUBLIC_README_STATS,
    // OpenRouter & AI Configuration
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    EMBEDDING_MODEL: process.env.EMBEDDING_MODEL,
    // Supabase Public Configuration
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
