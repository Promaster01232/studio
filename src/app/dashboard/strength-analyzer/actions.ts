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

  // INSTITUTIONAL RESILIENCE PROTOCOL: 5-Stage Retry with Neural Cooling
  let retries = 5;
  while (retries >= 0) {
    try {
      const result = await analyzeCaseStrength(validatedFields.data as AnalyzeCaseStrengthInput);
      return { status: "success", data: result, error: null };
    } catch (error: any) {
      const isTransientError = 
        error.message?.includes('429') || 
        error.status === 429 || 
        error.message?.toLowerCase().includes('busy') || 
        error.message?.toLowerCase().includes('quota') ||
        error.message?.toLowerCase().includes('rate limit');
      
      if (retries > 0 && isTransientError) {
        console.warn(`[AI STRENGTH NODE] Neural load high. Initializing Cooling Phase (${retries} left). Retrying in 15s...`);
        await new Promise(resolve => setTimeout(resolve, 15000));
        retries--;
        continue;
      }
      
      console.error("[AI STRENGTH NODE] Fatal error:", error);
      return { 
        status: "error", 
        data: null, 
        error: "The Statutory Analysis Hub is under heavy neural load. Our forensic engines are currently saturated. Please re-initialize the audit in a few moments." 
      };
    }
  }
  
  return { status: "error", data: null, error: "AI Audit Node timed out after 5 attempts. Please try again later." };
}
