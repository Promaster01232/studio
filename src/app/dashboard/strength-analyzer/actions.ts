"use server";

import { analyzeCaseStrength, type AnalyzeCaseStrengthOutput, AnalyzeCaseStrengthInput } from "@/ai/flows/analyze-case-strength";
import { z } from "zod";

export type CaseStrengthState = {
  status: "idle" | "loading" | "success" | "error";
  data: AnalyzeCaseStrengthOutput | null;
  error: string | null;
  resolution?: string[];
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

  // INSTITUTIONAL RESILIENCE PROTOCOL: 15-Stage Retry with Jittered Neural Cooling
  let retries = 15;
  let delay = 2000;

  while (retries >= 0) {
    try {
      const result = await analyzeCaseStrength(validatedFields.data as AnalyzeCaseStrengthInput);
      return { status: "success", data: result, error: null };
    } catch (error: any) {
      const isTransient = 
        error.message?.includes('429') || 
        error.status === 429 || 
        error.message?.toLowerCase().includes('busy') || 
        error.message?.toLowerCase().includes('quota') ||
        error.message?.toLowerCase().includes('limit');
      
      if (retries > 0 && isTransient) {
        console.warn(`[AI STRENGTH NODE] High load detected. Attempting re-entry in ${delay/1000}s... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Gradual backoff with jitter
        delay = Math.min(delay * 1.3 + Math.random() * 1000, 20000);
        retries--;
        continue;
      }
      
      console.error("[AI STRENGTH NODE] Forensic Failure:", error);
      return { 
        status: "error", 
        data: null, 
        error: "The Statutory Analysis Hub is currently saturated after 15 audit attempts.",
        resolution: [
            "Wait for the 60-second statutory cooldown period to end.",
            "Simplify the case description to remove complex legal jargon.",
            "Verify that your input is strictly factual.",
            "Initialize the audit again during off-peak hours."
        ]
      };
    }
  }
  
  return { 
    status: "error", 
    data: null, 
    error: "AI Audit Node timed out. Neural gateway saturated.",
    resolution: ["Please wait 2 minutes and initialize the audit protocol again."]
  };
}
