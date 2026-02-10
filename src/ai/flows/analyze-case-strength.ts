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
  problemNarration: z
    .string()
    .describe('A detailed description of the legal problem or case.'),
  evidenceAvailability: z
    .string()
    .describe('Description of available evidence and its quality.'),
  relevantLaws: z
    .string()
    .optional()
    .describe('List of relevant laws and legal sections, if known.'),
  pastJudgments: z
    .string()
    .optional()
    .describe('Information about similar past judgments, if known.'),
  jurisdiction: z
    .string()
    .describe(
      'The jurisdiction (e.g., court, police station) where the case is being handled.'
    ),
  timeLimitationRisks: z
    .string()
    .optional()
    .describe('Potential risks related to time limitations or delays.'),
  legalContradictions: z
    .string()
    .optional()
    .describe('Any known legal contradictions or inconsistencies in the case.'),
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

Analyze the following case details and provide a strength score (0-100), identify key risk indicators, recommend actions to improve the case, and provide a summary of your analysis.

Case Details:
Problem Narration: {{{problemNarration}}}
Evidence Availability: {{{evidenceAvailability}}}
Relevant Laws: {{{relevantLaws}}}
Past Judgments: {{{pastJudgments}}}
Jurisdiction: {{{jurisdiction}}}
Time Limitation Risks: {{{timeLimitationRisks}}}
Legal Contradictions: {{{legalContradictions}}}

Respond in a well structured and complete way, even if some fields are not available.`,
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
