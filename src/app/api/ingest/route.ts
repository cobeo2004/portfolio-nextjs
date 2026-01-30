import { NextResponse } from "next/server";
import { loadAndPrepareCV } from "@/lib/pdf-loader";
import { storeDocuments, clearDocuments, hasDocuments } from "@/lib/vectorstore";

export async function POST() {
  const alreadyIngestedResult = await hasDocuments();
  if (alreadyIngestedResult.isErr()) {
    console.error("Check error:", alreadyIngestedResult.error);
    return NextResponse.json(
      { message: "Failed to check ingestion status", error: alreadyIngestedResult.error.message },
      { status: 500 }
    );
  }

  if (alreadyIngestedResult.value) {
    return NextResponse.json(
      {
        message: "Documents already ingested. Use DELETE to re-ingest.",
        status: "already_exists",
      },
      { status: 200 }
    );
  }

  console.log("Loading CV...");
  const documentsResult = await loadAndPrepareCV();
  if (documentsResult.isErr()) {
    console.error("Load error:", documentsResult.error);
    return NextResponse.json(
      { message: "Failed to load CV", error: documentsResult.error.message },
      { status: 500 }
    );
  }

  const documents = documentsResult.value;
  console.log(`Loaded ${documents.length} chunks`);

  console.log("Storing documents...");
  const storeResult = await storeDocuments(documents);
  if (storeResult.isErr()) {
    console.error("Store error:", storeResult.error);
    return NextResponse.json(
      { message: "Failed to store documents", error: storeResult.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "CV successfully ingested",
    status: "success",
    chunksProcessed: documents.length,
  });
}

export async function DELETE() {
  const clearResult = await clearDocuments();
  if (clearResult.isErr()) {
    console.error("Clear error:", clearResult.error);
    return NextResponse.json(
      {
        message: "Failed to clear documents",
        error: clearResult.error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "All documents cleared successfully",
    status: "success",
  });
}

export async function GET() {
  const existsResult = await hasDocuments();
  if (existsResult.isErr()) {
    console.error("Check error:", existsResult.error);
    return NextResponse.json(
      { error: "Failed to check ingestion status" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ingested: existsResult.value,
    status: existsResult.value ? "ready" : "not_ready",
  });
}
