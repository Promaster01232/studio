"use server";

import { generateCaseSummary, type GenerateCaseSummaryOutput } from "@/ai/flows/generate-case-summary";

export type CaseSummaryState = {
  status: "idle" | "loading" | "success" | "error";
  data: GenerateCaseSummaryOutput | null;
  error: string | null;
  resolution?: string[];
};

async function fileToDataURI(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function summarizeCaseAction(
  prevState: CaseSummaryState,
  formData: FormData
): Promise<CaseSummaryState> {
  const file = formData.get("problemAudio");
  const language = formData.get("language")?.toString() || "English";

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      data: null,
      error: "Please record your problem narration before initializing analysis.",
    };
  }
  
  try {
    const audioDataUri = await fileToDataURI(file);
    
    // INSTITUTIONAL RESILIENCE PROTOCOL: 20-Stage Retry with Jittered Cooling
    let retries = 20;
    let delay = 3000;

    while (retries >= 0) {
        try {
            const result = await generateCaseSummary({
                problemAudio: audioDataUri,
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
                console.warn(`[AI SUCCESS NODE] Hub Saturation. Retry ${20 - retries}/20 in ${delay/1000}s...`);
                await new Promise(r => setTimeout(r, delay));
                delay = Math.min(delay + 2000 + Math.random() * 1000, 25000);
                retries--;
                continue;
            }
            throw error;
        }
    }
    throw new Error("Maximum retry threshold reached.");
  } catch (error) {
    console.error("[AI NARRATE NODE] Neural Failure:", error);
    return { 
        status: "error", 
        data: null, 
        error: "Failed to deconstruct narration. The AI forensic hub is saturated after 20 attempts.",
        resolution: [
            "Ensure the audio recording is clear and under 2 minutes.",
            "Wait 60 seconds for the node capacity to reset.",
            "Retry with a shorter, more direct narration.",
            "Check your internet bandwidth ingress."
        ]
    };
  }
}
