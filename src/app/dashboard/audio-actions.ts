
'use server';

import { generateAudioSummary } from "@/ai/flows/audio-summary";

export async function getAudioSummaryAction(text: string, language: string) {
  try {
    const result = await generateAudioSummary({ text, language });
    return { success: true, audioDataUri: result.audioDataUri };
  } catch (error) {
    console.error("Audio generation failed:", error);
    return { success: false, error: "Failed to generate audio summary." };
  }
}
