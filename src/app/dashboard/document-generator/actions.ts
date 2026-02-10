"use server";

import { generateLegalDocument, type GenerateLegalDocumentOutput } from "@/ai/flows/generate-legal-documents";
import { z } from "zod";

export type DocumentGeneratorState = {
  status: "idle" | "loading" | "success" | "error";
  data: GenerateLegalDocumentOutput | null;
  error: string | null;
};

const DocumentSchema = z.object({
  documentType: z.string().min(1, "Please select a document type."),
  language: z.string().min(1, "Please select a language."),
  details: z.string().min(20, "Please provide sufficient details for the document."),
});

export async function generateDocumentAction(
  prevState: DocumentGeneratorState,
  formData: FormData
): Promise<DocumentGeneratorState> {
  const validatedFields = DocumentSchema.safeParse({
    documentType: formData.get("documentType"),
    language: formData.get("language"),
    details: formData.get("details"),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      status: "error",
      data: null,
      error: firstError || "Invalid input.",
    };
  }

  try {
    const result = await generateLegalDocument(validatedFields.data);
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to generate the document. Please try again." };
  }
}
