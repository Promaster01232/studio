'use server';

/**
 * @fileOverview A flow to generate a simplified summary of a legal case from a voice recording.
 *
 * - generateCaseSummary - A function that generates the case summary.
 * - GenerateCaseSummaryInput - The input type for the generateCaseSummary function.
 * - GenerateCaseSummaryOutput - The return type for the generateCaseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaseSummaryInputSchema = z.object({
  problemAudio: z
    .string()
    .describe(
      "A voice recording of the legal problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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

You will use the user's voice recording of their legal problem to generate a simplified summary of their case. First, transcribe the audio. Then, based on the transcription, extract the case type (civil or criminal), relevant laws and sections, and the jurisdiction where the case should be filed.

Voice recording of the legal problem: {{media url=problemAudio}}

Output the case summary, case type, relevant laws and sections, jurisdiction, and next actions as JSON. Make the case summary as simple as possible for a layman to understand.
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
