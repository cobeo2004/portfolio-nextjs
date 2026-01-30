import "server-only";
import fs from "fs";
import path from "path";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFParse } from "pdf-parse";
import { ok, err, ResultAsync } from "neverthrow";
import { errors } from "./errors";

type TextResult = { text: string };

export const loadPDF = async (filePath: string): Promise<ResultAsync<string, Error>> => {
  if (!fs.existsSync(filePath)) {
    return ResultAsync.fromPromise(
      Promise.reject(errors.pdfNotFound(filePath)),
      (e) => e as Error
    );
  }

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = new PDFParse({ data: dataBuffer });
    const result = await data.getText() as TextResult;
    return ResultAsync.fromPromise(
      Promise.resolve(result.text),
      (e) => e instanceof Error ? e : errors.pdfReadError(filePath)
    );
  } catch (e) {
    return ResultAsync.fromPromise(
      Promise.reject(e),
      (err) => err instanceof Error ? err : errors.pdfReadError(filePath)
    );
  }
};

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

export const loadAndPrepareCV = async (): Promise<ResultAsync<Document[], Error>> => {
  const cvPath = path.join(process.cwd(), "public", "assets", "pdf", "CV.pdf");

  if (!fs.existsSync(cvPath)) {
    return ResultAsync.fromPromise(
      Promise.reject(errors.pdfNotFound(cvPath)),
      (e) => e as Error
    );
  }

  const textResult = await loadPDF(cvPath);
  if (textResult.isErr()) {
    return ResultAsync.fromPromise(
      Promise.reject(textResult.error),
      (e) => e as Error
    );
  }

  const chunks = await splitTextIntoChunks(textResult.value);
  return ResultAsync.fromPromise(Promise.resolve(chunks), (e) => e as Error);
};
