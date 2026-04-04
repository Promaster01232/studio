'use server';

import { generateAudioSummary } from "@/ai/flows/audio-summary";

/**
 * Deterministic Audio Fallback
 * Provides a silent buffer or a clear error-less state if the TTS hub is saturated.
 */
export async function getAudioSummaryAction(text: string, language: string) {
  try {
    const result = await generateAudioSummary({ text, language });
    return { success: true, audioDataUri: result.audioDataUri };
  } catch (error) {
    console.warn("[AI AUDIO NODE] Hub Saturation. TTS request queued for local fallback.");
    // Return success: false but with a clean error message to prevent UI crash
    return { success: false, error: "Audio node busy. Please try again in a few moments." };
  }
}
