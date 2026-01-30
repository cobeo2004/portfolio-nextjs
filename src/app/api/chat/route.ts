import { NextRequest } from "next/server";
import { streamText } from "ai";
import { getChatModel } from "@/lib/openrouter";
import { searchSimilarDocuments, hasDocuments } from "@/lib/vectorstore";
import { checkRateLimit } from "@/lib/rate-limit";
import type { TChatMessage } from "@/types";

// System prompt that defines chatbot personality and constraints
const SYSTEM_PROMPT = `You are a friendly and conversational AI assistant representing Simon Nguyen. Your role is to answer questions about Simon's professional background, skills, experience, education, and projects based on the provided context from his CV.

Important guidelines:
1. Always be friendly, warm, and conversational in your tone
2. Use the context provided to give accurate, specific answers about Simon
3. If asked about topics NOT related to Simon Nguyen's professional background, politely decline and redirect: "I'm here to help answer questions about Simon's professional background, skills, and experience. Is there something specific you'd like to know about Simon?"
4. If the context doesn't contain enough information to answer a question about Simon, be honest: "I don't have that specific information in Simon's CV, but I'd be happy to help with other questions about his background!"
5. Keep responses concise but informative (2-4 sentences unless more detail is requested)
6. Reference specific details from the context when possible

Remember: You only answer questions about Simon Nguyen. Politely decline all other requests.`;

// Helper to check if query is about Simon
const isRelevantQuery = async (query: string): Promise<boolean> => {
  // Simple keyword-based check for common off-topic queries
  const offTopicKeywords = [
    "weather",
    "joke",
    "recipe",
    "cook",
    "news",
    "stock",
    "bitcoin",
    "crypto",
    "movie",
    "music recommendation",
    "game",
    "translate",
    "calculation",
    "math problem",
  ];

  const lowerQuery = query.toLowerCase();
  const hasOffTopicKeyword = offTopicKeywords.some((keyword) =>
    lowerQuery.includes(keyword)
  );

  if (hasOffTopicKeyword) {
    return false;
  }

  // If no obvious off-topic keywords, allow the query
  // The system prompt will handle edge cases
  return true;
};

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { messages } = body as { messages: TChatMessage[] };

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400 }
      );
    }

    // Get IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    const rateLimitResult = await checkRateLimit(ip);
    if (rateLimitResult.isErr()) {
      if (rateLimitResult.error.message === "Rate limit exceeded") {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a few minutes.",
          }),
          { status: 429 }
        );
      }
      console.error("Rate limit error:", rateLimitResult.error);
      return new Response(
        JSON.stringify({
          error: "Rate limit check failed. Please try again.",
        }),
        { status: 500 }
      );
    }

    // Check if documents are ingested
    const documentsExistResult = await hasDocuments();
    if (documentsExistResult.isErr()) {
      console.error("Documents check error:", documentsExistResult.error);
      return new Response(
        JSON.stringify({
          error: "Failed to check knowledge base. Please try again.",
        }),
        { status: 500 }
      );
    }

    if (!documentsExistResult.value) {
      // Auto-trigger ingestion
      console.log("No documents found. Triggering ingestion...");

      try {
        const ingestResponse = await fetch(
          `${req.nextUrl.origin}/api/ingest`,
          { method: "POST" }
        );

        if (!ingestResponse.ok) {
          throw new Error("Ingestion failed");
        }

        console.log("Ingestion completed successfully");
      } catch (error) {
        console.error("Auto-ingestion error:", error);
        return new Response(
          JSON.stringify({
            error: "Failed to load knowledge base. Please try again.",
          }),
          { status: 500 }
        );
      }
    }

    // Get last user message
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    console.log("User query:", userQuery);

    // Check if query is relevant
    const isRelevant = await isRelevantQuery(userQuery);
    console.log("Is relevant:", isRelevant);

    if (!isRelevant) {
      // Return polite rejection as a text stream
      const rejectionMessage =
        "I'm here to help answer questions about Simon's professional background, skills, and experience. Is there something specific you'd like to know about Simon?";
      
      return new Response(rejectionMessage, {
        status: 200,
        headers: { 
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Retrieve relevant context from vector database
    const relevantDocs = await searchSimilarDocuments(userQuery, 5);
    console.log(`Retrieved ${relevantDocs.length} relevant documents`);

    // Build context string
    const context = relevantDocs
      .map((doc, idx) => `[Context ${idx + 1}]:\n${doc.content}`)
      .join("\n\n");

    // Format messages for the model (include conversation history)
    const formattedMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      {
        role: "system" as const,
        content: `Here is relevant context from Simon's CV:\n\n${context}`,
      },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Stream response
    const model = getChatModel();

    const result = streamText({
      model,
      messages: formattedMessages,
      temperature: 0.7,
    });

    // Create a text stream response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.textStream) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
      { status: 500 }
    );
  }
}
