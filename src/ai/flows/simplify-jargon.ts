'use server';

/**
 * @fileOverview An AI agent to simplify legal jargon.
 *
 * - simplifyJargon - A function that simplifies a legal term.
 * - SimplifyJargonInput - The input type for the simplifyJargon function.
 * - SimplifyJargonOutput - The return type for the simplifyJargon function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimplifyJargonInputSchema = z.object({
  term: z.string().describe('The legal term to be simplified.'),
});
export type SimplifyJargonInput = z.infer<typeof SimplifyJargonInputSchema>;

const SimplifyJargonOutputSchema = z.object({
  term: z.string().describe('The original legal term.'),
  explanation: z.string().describe('The simplified explanation of the term.'),
});
export type SimplifyJargonOutput = z.infer<typeof SimplifyJargonOutputSchema>;

export async function simplifyJargon(
  input: SimplifyJargonInput
): Promise<SimplifyJargonOutput> {
  return simplifyJargonFlow(input);
}

const simplifyJargonPrompt = ai.definePrompt({
  name: 'simplifyJargonPrompt',
  input: {schema: SimplifyJargonInputSchema},
  output: {schema: SimplifyJargonOutputSchema},
  prompt: `You are an AI legal assistant. Your task is to explain a complex legal term in simple, easy-to-understand English, as if explaining to a person with no legal background.

Legal Term: {{{term}}}

Provide a concise, one-sentence explanation. Respond with the original term and the simplified explanation.`,
});

const simplifyJargonFlow = ai.defineFlow(
  {
    name: 'simplifyJargonFlow',
    inputSchema: SimplifyJargonInputSchema,
    outputSchema: SimplifyJargonOutputSchema,
  },
  async input => {
    const {output} = await simplifyJargonPrompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI.");
    }
    // The prompt asks for the original term back, but let's ensure it's there.
    return {
        term: input.term,
        explanation: output.explanation
    };
  }
);
