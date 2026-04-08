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
1. EXECUTIVE SUMMARY: A high-level overview of the situation.
2. STATUTORY FRAMEWORK: Specific Bharatiya Nyaya Sanhita (BNS) sections or relevant Indian laws that apply.
3. PROCEDURAL ROADMAP: Step-by-step guidance on what to do next (e.g., filing a complaint, gathering evidence).
4. INSTITUTIONAL ADVISORY: Professional cautions and recommendations for connecting with verified advocates.

Guidelines:
- Use simple but professional English.
- Be thorough and precise. 
- Maintain institutional neutrality.
- Never provide definitive legal "advice"; provide "statutory information" and "procedural guidance".

Generate a report that looks like a formal legal dossier.`,
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
