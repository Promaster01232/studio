
"use server";

import { analyzeCaseStrength, type AnalyzeCaseStrengthOutput, AnalyzeCaseStrengthInput } from "@/ai/flows/analyze-case-strength";
import { z } from "zod";

export type CaseStrengthState = {
  status: "idle" | "loading" | "success" | "error";
  data: AnalyzeCaseStrengthOutput | null;
  error: string | null;
};

const StrengthSchema = z.object({
  caseDescription: z.string().min(20, "Please provide a detailed case description (min 20 chars)."),
  language: z.string().min(1, "Please select a language."),
});

export async function analyzeCaseStrengthAction(
  prevState: CaseStrengthState,
  formData: FormData
): Promise<CaseStrengthState> {
  
  const validatedFields = StrengthSchema.safeParse({
    caseDescription: formData.get("caseDescription"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return {
      status: "error",
      data: null,
      error: firstError || "Invalid input matrix.",
    };
  }

  // Resilient Execution Protocol
  let retries = 3;
  while (retries >= 0) {
    try {
      const result = await analyzeCaseStrength(validatedFields.data as AnalyzeCaseStrengthInput);
      return { status: "success", data: result, error: null };
    } catch (error: any) {
      if (retries > 0 && (error.message?.includes('429') || error.status === 429)) {
        console.warn(`[AI Audit] Rate limit hit. Retrying in 5s... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        retries--;
        continue;
      }
      console.error("[AI Audit] Fatal node error:", error);
      return { 
        status: "error", 
        data: null, 
        error: "Statutory Analysis Hub Busy. Please re-initialize in 30 seconds." 
      };
    }
  }
  
  return { status: "error", data: null, error: "AI Audit Node timed out. Please try again later." };
}
