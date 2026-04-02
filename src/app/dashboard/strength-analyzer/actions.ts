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

  // INSTITUTIONAL RESILIENCE PROTOCOL: 7-Stage Retry with Jittered Neural Cooling
  let retries = 7;
  let delay = 10000; // Base delay of 10s

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
        error.message?.toLowerCase().includes('rate limit') ||
        error.message?.toLowerCase().includes('too many requests');
      
      if (retries > 0 && isTransientError) {
        console.warn(`[AI STRENGTH NODE] Neural load high. Initializing Cooling Phase (${retries} left). Retrying in ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff with jitter
        delay = Math.min(delay * 1.5 + Math.random() * 5000, 45000);
        retries--;
        continue;
      }
      
      console.error("[AI STRENGTH NODE] Fatal error:", error);
      return { 
        status: "error", 
        data: null, 
        error: "The Statutory Analysis Hub is under extreme neural load. Our forensic engines are currently processing a massive volume of reports. Please wait 30 seconds and initialize the audit again." 
      };
    }
  }
  
  return { status: "error", data: null, error: "AI Audit Node timed out after 7 attempts. The neural gateway is currently saturated." };
}
