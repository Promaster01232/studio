'use server';

/**
 * @fileOverview A flow to generate a simplified summary of a legal case.
 *
 * - generateCaseSummary - A function that generates the case summary.
 * - GenerateCaseSummaryInput - The input type for the generateCaseSummary function.
 * - GenerateCaseSummaryOutput - The return type for the generateCaseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaseSummaryInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('A description of the legal problem provided by the user.'),
});
export type GenerateCaseSummaryInput = z.infer<typeof GenerateCaseSummaryInputSchema>;

const GenerateCaseSummaryOutputSchema = z.object({
  caseSummary: z.string().describe('A simplified summary of the case.'),
  caseType: z.string().describe('The type of case (civil or criminal).'),
  relevantLaws: z.string().describe('Relevant laws and sections applicable to the case.'),
  jurisdiction: z
    .string()
    .describe('The jurisdiction where the case should be filed (police station/court).'),
  nextActions: z.string().describe('The list of next possible actions'),
});
export type GenerateCaseSummaryOutput = z.infer<typeof GenerateCaseSummaryOutputSchema>;

export async function generateCaseSummary(input: GenerateCaseSummaryInput): Promise<GenerateCaseSummaryOutput> {
  return generateCaseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaseSummaryPrompt',
  input: {schema: GenerateCaseSummaryInputSchema},
  output: {schema: GenerateCaseSummaryOutputSchema},
  prompt: `You are a legal expert specializing in summarizing legal cases for the common man.

You will use the user's description of their legal problem to generate a simplified summary of their case. Also extract the case type (civil or criminal), relevant laws and sections, and the jurisdiction where the case should be filed.
\nDescription of the legal problem: {{{problemDescription}}}
\nOutput the case summary, case type, relevant laws and sections, jurisdiction, and next actions as JSON. Make the case summary as simple as possible for a layman to understand.
`,
});

const generateCaseSummaryFlow = ai.defineFlow(
  {
    name: 'generateCaseSummaryFlow',
    inputSchema: GenerateCaseSummaryInputSchema,
    outputSchema: GenerateCaseSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
