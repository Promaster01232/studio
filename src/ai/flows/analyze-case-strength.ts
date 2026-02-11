'use server';

/**
 * @fileOverview An AI agent to analyze the strength of a legal case.
 *
 * - analyzeCaseStrength - A function that analyzes the case strength.
 * - AnalyzeCaseStrengthInput - The input type for the analyzeCaseStrength function.
 * - AnalyzeCaseStrengthOutput - The return type for the analyzeCaseStrength function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCaseStrengthInputSchema = z.object({
  caseDescription: z
    .string()
    .describe(
      'A detailed description of the case, including all relevant information, people involved, dates, and any available evidence.'
    ),
  language: z.string().describe('The language for the response.'),
});
export type AnalyzeCaseStrengthInput = z.infer<typeof AnalyzeCaseStrengthInputSchema>;

const AnalyzeCaseStrengthOutputSchema = z.object({
  strengthScore: z
    .number()
    .describe(
      'A numerical score (0-100) representing the overall strength of the case.'
    ),
  riskIndicators: z
    .array(z.string())
    .describe('A list of key risk indicators and weaknesses in the case.'),
  recommendedActions: z
    .array(z.string())
    .describe('A list of recommended actions to improve the case strength.'),
  summary: z
    .string()
    .describe(
      'A concise summary of the case strength analysis, including key findings.'
    ),
});
export type AnalyzeCaseStrengthOutput = z.infer<typeof AnalyzeCaseStrengthOutputSchema>;

export async function analyzeCaseStrength(
  input: AnalyzeCaseStrengthInput
): Promise<AnalyzeCaseStrengthOutput> {
  return analyzeCaseStrengthFlow(input);
}

const analyzeCaseStrengthPrompt = ai.definePrompt({
  name: 'analyzeCaseStrengthPrompt',
  input: {schema: AnalyzeCaseStrengthInputSchema},
  output: {schema: AnalyzeCaseStrengthOutputSchema},
  prompt: `You are an AI legal assistant that analyzes the strength of a legal case based on the provided information.

Analyze the following case description and provide a strength score (0-100), identify key risk indicators, recommend actions to improve the case, and provide a summary of your analysis.

Case Description: {{{caseDescription}}}

Provide the response in the following language: {{{language}}}

Respond in a well structured and complete way. Your analysis should be comprehensive based on the details provided in the case description.`,
});

const analyzeCaseStrengthFlow = ai.defineFlow(
  {
    name: 'analyzeCaseStrengthFlow',
    inputSchema: AnalyzeCaseStrengthInputSchema,
    outputSchema: AnalyzeCaseStrengthOutputSchema,
  },
  async input => {
    const {output} = await analyzeCaseStrengthPrompt(input);
    return output!;
  }
);
