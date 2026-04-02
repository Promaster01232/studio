
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
  caseDescription: z.string().min(10, "Please provide more detail for a precise audit."),
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

  // INSTITUTIONAL RESILIENCE PROTOCOL: 25-Stage Retry with Jittered Neural Cooling
  let retries = 25;
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
        console.warn(`[AI SUCCESS NODE] Hub Saturation. Retry ${25 - retries}/25 in ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Optimized linear scaling with jitter
        delay = Math.min(delay + 1500 + Math.random() * 1000, 20000);
        retries--;
        continue;
      }
      
      console.error("[AI STRENGTH NODE] Forensic Failure:", error);
      return { 
        status: "error", 
        data: null, 
        error: "The Statutory Research Hub is currently saturated after 25 audit attempts.",
        resolution: [
            "Wait 60 seconds for the node capacity to reset.",
            "Simplify the input to focus on core facts.",
            "Try re-initializing the audit during off-peak hours.",
            "Check your internet ingress stability."
        ]
      };
    }
  }
  
  return { 
    status: "error", 
    data: null, 
    error: "AI Research Node timed out. Neural gateway saturated.",
    resolution: ["Please wait 2 minutes and initialize the audit protocol again."]
  };
}
