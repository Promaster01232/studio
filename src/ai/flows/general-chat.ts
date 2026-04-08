'use server';

/**
 * @fileOverview A general-purpose legal assistant chat flow.
 *
 * - generalChat - A function that handles general legal queries.
 * - GeneralChatInput - The input type for the function.
 * - GeneralChatOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'kit';

const GeneralChatInputSchema = z.object({
  query: z.string().describe('The user\'s legal question or statement.'),
  context: z.string().optional().describe('Any relevant context about the user or session.'),
});
export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const GeneralChatOutputSchema = z.object({
  response: z.string().describe('The AI legal assistant\'s professional response.'),
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

Your goal is to provide citizens with clear, professional, and mathematically precise legal information. 

User Query: {{{query}}}
{{#if context}}Context: {{{context}}}{{/if}}

Guidelines:
1. Use simple but professional English.
2. Reference the Bharatiya Nyaya Sanhita (BNS) where applicable.
3. Be helpful and empathetic but always maintain institutional neutrality.
4. If the query requires a specialized tool (like drafting a notice or analyzing case strength), guide the user to the appropriate terminal on their dashboard.
5. Never provide definitive legal "advice"; provide "statutory information" and "procedural guidance".

Respond with a professional, thorough, and correct report.`,
});

const generalChatFlow = ai.defineFlow(
  {
    name: 'generalChatFlow',
    inputSchema: GeneralChatInputSchema,
    outputSchema: GeneralChatOutputSchema,
  },
  async input => {
    const { output } = await generalChatPrompt(input);
    return output!;
  }
);
