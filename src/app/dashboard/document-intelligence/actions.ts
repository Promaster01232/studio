"use server";

import { understandLegalDocument, type UnderstandLegalDocumentOutput } from "@/ai/flows/understand-legal-document";

export type DocumentIntelligenceState = {
  status: "idle" | "loading" | "success" | "error";
  data: UnderstandLegalDocumentOutput | null;
  error: string | null;
};

async function fileToDataURI(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function understandDocumentAction(
  prevState: DocumentIntelligenceState,
  formData: FormData
): Promise<DocumentIntelligenceState> {
  const file = formData.get("document");

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      data: null,
      error: "Please select a valid document to upload.",
    };
  }

  try {
    const documentDataUri = await fileToDataURI(file);
    
    const result = await understandLegalDocument({
      documentDataUri,
    });
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to analyze the document. The file may be corrupt or in an unsupported format. Please try again." };
  }
}
