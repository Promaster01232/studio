
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
  const language = formData.get("language")?.toString() || "English";

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      data: null,
      error: "Please select a valid statutory document to upload.",
    };
  }

  try {
    const documentDataUri = await fileToDataURI(file);
    
    // Resilient Execution Protocol
    let retries = 2;
    while (retries >= 0) {
        try {
            const result = await understandLegalDocument({
                documentDataUri,
                language,
            });
            return { status: "success", data: result, error: null };
        } catch (error: any) {
            if (retries > 0 && (error.message?.includes('429') || error.status === 429)) {
                await new Promise(r => setTimeout(r, 5000));
                retries--;
                continue;
            }
            throw error;
        }
    }
    throw new Error("Timeout");
  } catch (error) {
    console.error("[AI Audit] Failure:", error);
    return { status: "error", data: null, error: "Failed to analyze document node. The forensic engine is under heavy load." };
  }
}
