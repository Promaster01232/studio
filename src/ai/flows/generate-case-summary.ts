'use server';

/**
 * @fileOverview A flow to generate a comprehensive legal report from a voice recording.
 *
 * - generateCaseSummary - A function that handles transcription and detailed legal analysis.
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
  language: z.string().describe('The language for the response.'),
});
export type GenerateCaseSummaryInput = z.infer<typeof GenerateCaseSummaryInputSchema>;

const GenerateCaseSummaryOutputSchema = z.object({
  transcription: z.string().describe('The word-for-word transcription of the audio recording.'),
  caseSummary: z.string().describe('A simplified summary of the case for a layman.'),
  caseType: z.string().describe('The type of case (civil or criminal).'),
  relevantLaws: z.string().describe('Relevant laws and sections applicable to the case.'),
  jurisdiction: z
    .string()
    .describe('The jurisdiction where the case should be filed (police station/court).'),
  nextActions: z.string().describe('The list of next possible actions.'),
  detailedAnalysis: z.string().describe('A comprehensive, detailed legal analysis of the situation reported.'),
});
export type GenerateCaseSummaryOutput = z.infer<typeof GenerateCaseSummaryOutputSchema>;

export async function generateCaseSummary(input: GenerateCaseSummaryInput): Promise<GenerateCaseSummaryOutput> {
  return generateCaseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaseSummaryPrompt',
  input: {schema: GenerateCaseSummaryInputSchema},
  output: {schema: GenerateCaseSummaryOutputSchema},
  prompt: `You are an expert legal forensic analyst specializing in Indian Law.

You will use the user's voice recording of their legal problem to generate a comprehensive, professional legal report. 

First, provide a precise word-for-word transcription of the audio provided. 
Then, provide a simplified summary for a layman.
Identify the case type (civil/criminal), relevant laws, sections, and the appropriate jurisdiction.
Crucially, provide a deep, comprehensive legal analysis of the situation, outlining potential legal strategies, strengths, and weaknesses.
Finally, list the immediate next actions the user should take.

Voice recording of the legal problem: {{media url=problemAudio}}

Output the response in the following language: {{{language}}}.

Output everything as JSON. Be professional, thorough, and precise.
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
