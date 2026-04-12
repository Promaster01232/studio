'use server';

/**
 * @fileOverview A general-purpose legal assistant chat flow for Nyaya Sahayak.
 *
 * - generalChat - A function that handles general legal queries.
 * - GeneralChatInput - The input type for the function.
 * - GeneralChatOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneralChatInputSchema = z.object({
  query: z.string().describe('The user\'s legal question or statement.'),
  context: z.string().optional().describe('Any relevant context about the user or session.'),
});
export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const GeneralChatOutputSchema = z.object({
  response: z.string().describe('The AI legal assistant\'s professional response in a structured format.'),
});
export type GeneralChatOutput = z.infer<typeof GeneralChatOutputSchema>;

export async function generalChat(input: GeneralChatInput): Promise<GeneralChatOutput> {
  return generalChatFlow(input);
}

const generalChatPrompt = ai.definePrompt({
  name: 'generalChatPrompt',
  input: { schema: GeneralChatInputSchema },
  output: { schema: GeneralChatOutputSchema },
  prompt: `You are Nyaya Sahayak, an elite AI legal assistant for the Indian Judicial System. 

Your goal is to provide citizens with a comprehensive, professional, and mathematically precise forensic report based on their query.

User Query: {{{query}}}
{{#if context}}Context: {{{context}}}{{/if}}

Output Requirements:
Structure your response into the following clear sections:

### 1. Executive Summary (Small Report)
Provide a high-level overview of the situation and the immediate statutory answer in 2-3 sentences.

### 2. Statutory Mapping (Forensic Dossier)
Identify specific sections of the Bharatiya Nyaya Sanhita (BNS) or other relevant Indian Acts (IPC, CrPC, etc.) that apply to the facts provided. Explain the legal definitions and implications clearly.

### 3. Procedural Roadmap (The Solution)
Provide a step-by-step actionable roadmap for the institutional journey. Include details on where to file (Police Station/Court), necessary documentation, and anticipated procedural timelines.

### 4. Institutional Advisory
Professional cautions, potential statutory risk nodes, and recommendations for connecting with a verified advocate via the Nyaya Sahayak registry for deep forensic strategy.

Guidelines:
- Use clean, non-italicized Title Case for all headers.
- Be thorough, precise, and authoritative. 
- Maintain strict institutional neutrality.
- Never provide definitive "legal advice"; provide "statutory information" and "procedural guidance".

Generate a report that looks like a formal, elite legal dossier.`,
});

const generalChatFlow = ai.defineFlow(
  {
    name: 'generalChatFlow',
    inputSchema: GeneralChatInputSchema,
    outputSchema: GeneralChatOutputSchema,
  },
  async input => {
    let retries = 5;
    let delay = 2000;
    while (retries >= 0) {
      try {
        const { output } = await generalChatPrompt(input);
        return output!;
      } catch (error: any) {
        const isTransient = 
            error.message?.includes('429') || 
            error.status === 429 || 
            error.message?.toLowerCase().includes('busy') || 
            error.message?.toLowerCase().includes('quota');

        if (retries > 0 && isTransient) {
          console.warn(`[AI HUB] Rate limit hit. Retrying in ${delay/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay = Math.min(delay * 1.5, 10000);
          retries--;
          continue;
        }
        throw error;
      }
    }
    throw new Error("AI hub saturated.");
  }
);
