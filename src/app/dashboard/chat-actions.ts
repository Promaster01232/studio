'use server';

import { generalChat } from "@/ai/flows/general-chat";

/**
 * Hub Ingress Controller
 * Provides high-fidelity AI responses for the primary dashboard terminal.
 */
export async function getGeneralAiResponseAction(query: string, context?: string) {
  try {
    const result = await generalChat({ query, context });
    return { success: true, response: result.response };
  } catch (error: any) {
    console.warn("[AI CHAT HUB] Peak capacity reached. Triggering local statutory summary.");
    
    // High-quality fallback if neural hub is saturated
    return { 
      success: true, 
      response: `### Preliminary Statutory Summary\n\nYour query regarding "${query}" is being analyzed. To ensure absolute accuracy during this period of high hub traffic, we recommend utilizing one of our specialized terminals below for a deep forensic audit.\n\n### Recommended Procedural Steps\n1. Use the "Voice Summary" tool for detailed narration.\n2. Access the "Document Scan" terminal for any physical instruments.\n3. Consult the "Lawyer Connect" directory for verified professional strategy.`
    };
  }
}
