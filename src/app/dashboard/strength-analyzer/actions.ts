"use server";

import { analyzeCaseStrength, type AnalyzeCaseStrengthOutput, AnalyzeCaseStrengthInput } from "@/ai/flows/analyze-case-strength";
import { z } from "zod";

export type CaseStrengthState = {
  status: "idle" | "loading" | "success" | "error";
  data: AnalyzeCaseStrengthOutput | null;
  error: string | null;
};

const StrengthSchema = z.object({
  problemNarration: z.string().min(20, "Please provide a detailed problem narration."),
  evidenceAvailability: z.string().min(10, "Please describe the available evidence."),
  jurisdiction: z.string().min(3, "Please specify the jurisdiction."),
  relevantLaws: z.string().optional(),
  pastJudgments: z.string().optional(),
});

export async function analyzeCaseStrengthAction(
  prevState: CaseStrengthState,
  formData: FormData
): Promise<CaseStrengthState> {
  
  const validatedFields = StrengthSchema.safeParse({
    problemNarration: formData.get("problemNarration"),
    evidenceAvailability: formData.get("evidenceAvailability"),
    jurisdiction: formData.get("jurisdiction"),
    relevantLaws: formData.get("relevantLaws"),
    pastJudgments: formData.get("pastJudgments"),
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
    const result = await analyzeCaseStrength(validatedFields.data as AnalyzeCaseStrengthInput);
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to analyze case strength. Please try again." };
  }
}
