import { NextResponse } from "next/server";
import { loadAndPrepareCV } from "@/lib/pdf-loader";
import { storeDocuments, clearDocuments, hasDocuments } from "@/lib/vectorstore";

export async function POST() {
  try {
    // Check if already ingested
    const alreadyIngested = await hasDocuments();

    if (alreadyIngested) {
      return NextResponse.json(
        {
          message: "Documents already ingested. Use DELETE to re-ingest.",
          status: "already_exists",
        },
        { status: 200 }
      );
    }

    // Load and prepare CV
    console.log("Loading CV...");
    const documents = await loadAndPrepareCV();
    console.log(`Loaded ${documents.length} chunks`);

    // Store in vector database
    console.log("Storing documents...");
    await storeDocuments(documents);

    return NextResponse.json({
      message: "CV successfully ingested",
      status: "success",
      chunksProcessed: documents.length,
    });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      {
        message: "Failed to ingest CV",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearDocuments();
    return NextResponse.json({
      message: "All documents cleared successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Clear error:", error);
    return NextResponse.json(
      {
        message: "Failed to clear documents",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const exists = await hasDocuments();
    return NextResponse.json({
      ingested: exists,
      status: exists ? "ready" : "not_ready",
    });
  } catch (error) {
    console.error("Check error:", error);
    return NextResponse.json(
      { error: "Failed to check ingestion status" },
      { status: 500 }
    );
  }
}
