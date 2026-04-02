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
    
    // INSTITUTIONAL RESILIENCE PROTOCOL: 15-Stage Retry with Jittered Cooling
    let retries = 15;
    let delay = 5000;

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
                console.warn(`[AI NARRATE NODE] Saturation detected. Retrying in ${delay/1000}s... (${retries} left)`);
                await new Promise(r => setTimeout(r, delay));
                delay = Math.min(delay * 1.3 + Math.random() * 2000, 30000);
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
        error: "Failed to deconstruct narration. The AI forensic engine is saturated.",
        resolution: [
            "Ensure the audio recording is clear and under 2 minutes.",
            "Avoid significant background noise during capture.",
            "Retry with a shorter, more direct narration.",
            "Wait 60 seconds for node capacity to reset."
        ]
    };
  }
}
