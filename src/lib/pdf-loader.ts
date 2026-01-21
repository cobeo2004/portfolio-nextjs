import "server-only";
import fs from "fs";
import path from "path";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { PDFParse } from "pdf-parse";

/**
 * Load and parse PDF file
 */
export const loadPDF = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = new PDFParse({ data: dataBuffer });
  const text = await data.getText();
  return text.text;
};

/**
 * Split text into chunks for embedding
 */
export const splitTextIntoChunks = async (
  text: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200,
): Promise<Document[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  const docs = await splitter.createDocuments([text]);

  // Add metadata to each chunk
  return docs.map((doc: Document, index: number) => ({
    ...doc,
    metadata: {
      ...doc.metadata,
      source: "CV.pdf",
      chunk: index,
      totalChunks: docs.length,
    },
  }));
};

/**
 * Load CV and prepare for ingestion
 */
export const loadAndPrepareCV = async (): Promise<Document[]> => {
  const cvPath = path.join(process.cwd(), "public", "assets", "pdf", "CV.pdf");

  if (!fs.existsSync(cvPath)) {
    throw new Error(`CV not found at ${cvPath}`);
  }

  const text = await loadPDF(cvPath);
  const chunks = await splitTextIntoChunks(text);

  return chunks;
};
