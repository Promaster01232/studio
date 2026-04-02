"use server";

import { understandLegalDocument, type UnderstandLegalDocumentOutput } from "@/ai/flows/understand-legal-document";

export type DocumentIntelligenceState = {
  status: "idle" | "loading" | "success" | "error";
  data: UnderstandLegalDocumentOutput | null;
  error: string | null;
  resolution?: string[];
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
    
    // INSTITUTIONAL RESILIENCE PROTOCOL: 15-Stage Retry with Jittered Cooling
    let retries = 15;
    let delay = 5000;

    while (retries >= 0) {
        try {
            const result = await understandLegalDocument({
                documentDataUri,
                language,
            });
            return { status: "success", data: result, error: null };
        } catch (error: any) {
            const isTransient = 
                error.message?.includes('429') || 
                error.status === 429 || 
                error.message?.toLowerCase().includes('busy') || 
                error.message?.toLowerCase().includes('quota') ||
                error.message?.toLowerCase().includes('limit');

            if (retries > 0 && isTransient) {
                console.warn(`[AI DOC NODE] Hub busy. Retrying in ${delay/1000}s... (${retries} left)`);
                await new Promise(r => setTimeout(r, delay));
                delay = Math.min(delay * 1.3 + Math.random() * 2000, 30000);
                retries--;
                continue;
            }
            throw error;
        }
    }
    throw new Error("Threshold reached.");
  } catch (error) {
    console.error("[AI DOC NODE] Analysis Failure:", error);
    return { 
        status: "error", 
        data: null, 
        error: "Failed to analyze document node. The forensic engine is saturated.",
        resolution: [
            "Ensure the document is a legible PDF or Image.",
            "Verify file size is under 5MB for optimal scanning.",
            "Check that the document contains clear statutory clauses.",
            "Try re-uploading in 60 seconds."
        ]
    };
  }
}
