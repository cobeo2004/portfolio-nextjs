import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { ResultAsync, ok, err, Result } from "neverthrow";
import { getSupabaseClients } from "./supabase";
import { getEmbeddings } from "./embeddings";
import type { TRetrievedDocument } from "@/types";
import { errors } from "./errors";

export const getVectorStore = async (): Promise<Result<SupabaseVectorStore, Error>> => {
  const clients = getSupabaseClients();
  if (clients.isErr()) {
    return err(errors.supabaseInit());
  }

  try {
    const embeddings = getEmbeddings();
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: clients.value.admin,
      tableName: "documents",
      queryName: "match_documents",
    });
    return ok(vectorStore);
  } catch (e) {
    return err(e instanceof Error ? e : new Error("Failed to create vector store"));
  }
};

export const storeDocuments = async (
  documents: Document[],
): Promise<Result<void, Error>> => {
  const vectorStoreResult = await getVectorStore();
  if (vectorStoreResult.isErr()) {
    return err(vectorStoreResult.error);
  }

  try {
    await vectorStoreResult.value.addDocuments(documents);
    return ok(undefined);
  } catch (e) {
    return err(e instanceof Error ? e : errors.documentsStore("Unknown error"));
  }
};

export const searchSimilarDocuments = async (
  query: string,
  k: number = 5,
): Promise<TRetrievedDocument[]> => {
  const vectorStoreResult = await getVectorStore();
  if (vectorStoreResult.isErr()) {
    console.error("Vector store error:", vectorStoreResult.error);
    return [];
  }

  try {
    const results = await vectorStoreResult.value.similaritySearchWithScore(query, k);
    return results.map(([doc, score]) => ({
      id: doc.metadata.id || "",
      content: doc.pageContent,
      metadata: doc.metadata,
      similarity: score,
    }));
  } catch (e) {
    console.error("Search error:", e);
    return [];
  }
};

export const hasDocuments = async (): Promise<Result<boolean, Error>> => {
  const clients = getSupabaseClients();
  if (clients.isErr()) {
    return err(clients.error);
  }

  try {
    const { count, error } = await clients.value.admin
      .from("documents")
      .select("*", { count: "exact", head: true });

    if (error) {
      return err(errors.documentsCheck(error.message));
    }

    return ok((count || 0) > 0);
  } catch (e) {
    return err(e instanceof Error ? e : errors.documentsCheck("Unknown error"));
  }
};

export const clearDocuments = async (): Promise<Result<void, Error>> => {
  const clients = getSupabaseClients();
  if (clients.isErr()) {
    return err(clients.error);
  }

  try {
    const { error } = await clients.value.admin
      .from("documents")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return err(errors.documentsClear(error.message));
    }

    return ok(undefined);
  } catch (e) {
    return err(e instanceof Error ? e : errors.documentsClear("Unknown error"));
  }
};
