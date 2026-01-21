import { OpenAIEmbeddings } from "@langchain/openai";
import { env } from "@/lib/env";

export const getEmbeddings = () => {
  return new OpenAIEmbeddings({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: env.EMBEDDING_MODEL,
    // OpenRouter uses OpenAI-compatible API
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
  });
};
