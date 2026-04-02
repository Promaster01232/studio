"use server";

import { generateCaseSummary, type GenerateCaseSummaryOutput } from "@/ai/flows/generate-case-summary";

export type CaseSummaryState = {
  status: "idle" | "loading" | "success" | "error";
  data: GenerateCaseSummaryOutput | null;
  error: string | null;
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
    
    // INSTITUTIONAL RESILIENCE PROTOCOL: 5-Stage Retry
    let retries = 5;
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
                error.message?.toLowerCase().includes('quota');

            if (retries > 0 && isTransient) {
                console.warn(`[AI NARRATE NODE] Neural cooling active. Retrying in 15s...`);
                await new Promise(r => setTimeout(r, 15000));
                retries--;
                continue;
            }
            throw error;
        }
    }
    throw new Error("Timeout");
  } catch (error) {
    console.error("[AI NARRATE NODE] Failure:", error);
    return { status: "error", data: null, error: "Failed to deconstruct narration. The AI forensic engine is currently processing a high volume of requests. Please try again shortly." };
  }
}
