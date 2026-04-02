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
    
    // Resilient Execution Protocol
    let retries = 3;
    while (retries >= 0) {
        try {
            const result = await generateCaseSummary({
                problemAudio: audioDataUri,
                language,
            });
            return { status: "success", data: result, error: null };
        } catch (error: any) {
            if (retries > 0 && (error.message?.includes('429') || error.status === 429)) {
                console.warn(`[AI Transcribe] Rate limit hit. Retrying in 5s...`);
                await new Promise(r => setTimeout(r, 5000));
                retries--;
                continue;
            }
            throw error;
        }
    }
    throw new Error("Timeout");
  } catch (error) {
    console.error("[AI Transcribe] Failure:", error);
    return { status: "error", data: null, error: "Failed to deconstruct narration. AI forensic engine is currently busy." };
  }
}
