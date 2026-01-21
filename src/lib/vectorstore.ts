import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { supabaseAdmin } from "./supabase";
import { getEmbeddings } from "./embeddings";
import type { TRetrievedDocument } from "@/types";

/**
 * Initialize vector store with Supabase
 */
export const getVectorStore = async () => {
  const embeddings = getEmbeddings();

  return new SupabaseVectorStore(embeddings, {
    client: supabaseAdmin,
    tableName: "documents",
    queryName: "match_documents",
  });
};

/**
 * Store documents in vector database
 */
export const storeDocuments = async (documents: Document[]) => {
  const vectorStore = await getVectorStore();
  await vectorStore.addDocuments(documents);
};

/**
 * Search for similar documents
 */
export const searchSimilarDocuments = async (
  query: string,
  k: number = 5
): Promise<TRetrievedDocument[]> => {
  const vectorStore = await getVectorStore();
  const results = await vectorStore.similaritySearchWithScore(query, k);

  return results.map(([doc, score]) => ({
    id: doc.metadata.id || "",
    content: doc.pageContent,
    metadata: doc.metadata,
    similarity: score,
  }));
};

/**
 * Check if documents exist in the database
 */
export const hasDocuments = async (): Promise<boolean> => {
  const { count, error } = await supabaseAdmin
    .from("documents")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error checking documents:", error);
    return false;
  }

  return (count || 0) > 0;
};

/**
 * Clear all documents from the database
 */
export const clearDocuments = async () => {
  const { error } = await supabaseAdmin
    .from("documents")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  if (error) {
    throw new Error(`Failed to clear documents: ${error.message}`);
  }
};
