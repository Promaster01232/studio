'use server';

/**
 * @fileOverview An AI agent to analyze the strength of a legal case with Deep Research capabilities.
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
  forensicResearch: z.string().describe('A deep, research-based legal analysis of the case precedents and statutes.'),
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
  prompt: `You are an expert AI forensic legal researcher specializing in Indian Law. 

Perform an exhaustive, high-fidelity research audit on the following case description. 

Case Description: {{{caseDescription}}}

Output Requirements:
1. Strength Score: A precise probability of litigation success (0-100).
2. Risk Indicators: Identify hidden statutory risks or procedural pitfalls.
3. Recommended Actions: Provide actionable steps to harden the case position.
4. Summary: A layman-friendly executive summary.
5. Forensic Research: A deep, professional legal analysis including potential Bharatiya Nyaya Sanhita (BNS) sections, judicial precedents, and jurisdictional nuances. 

Provide the response in the following language: {{{language}}}

Be thorough, professional, and precise. Every report must look like a formal legal dossier.`,
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
