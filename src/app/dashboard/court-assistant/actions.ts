"use server";

import { generateCrossExaminationQuestions, type GenerateCrossExaminationQuestionsOutput } from "@/ai/flows/generate-cross-examination-questions";
import { z } from "zod";

export type CourtAssistantState = {
  status: "idle" | "loading" | "success" | "error";
  data: GenerateCrossExaminationQuestionsOutput | null;
  error: string | null;
};

const QuestionSchema = z.object({
  witnessName: z.string().min(1, "Witness name is required."),
  topic: z.string().min(1, "Topic is required."),
});

export async function generateQuestionsAction(
  prevState: CourtAssistantState,
  formData: FormData
): Promise<CourtAssistantState> {
  
  const validatedFields = QuestionSchema.safeParse({
    witnessName: formData.get("witnessName"),
    topic: formData.get("topic"),
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
    const result = await generateCrossExaminationQuestions(validatedFields.data);
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to generate questions. Please try again." };
  }
}
