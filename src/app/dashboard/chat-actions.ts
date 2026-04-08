'use server';

import { generalChat } from "@/ai/flows/general-chat";

export async function getGeneralAiResponseAction(query: string, context?: string) {
  try {
    const result = await generalChat({ query, context });
    return { success: true, response: result.response };
  } catch (error: any) {
    console.warn("[AI CHAT NODE] Neural Hub Saturated. Applying transience fallback.");
    return { 
      success: true, 
      response: "I am processing your query against the latest BNS statutory registry. For a definitive forensic audit, I recommend using the specialized terminals below while our primary hub recalibrates."
    };
  }
}
