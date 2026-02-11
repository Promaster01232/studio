'use server';

/**
 * @fileOverview An AI agent to generate cross-examination questions.
 *
 * - generateCrossExaminationQuestions - A function that generates questions.
 * - GenerateCrossExaminationQuestionsInput - The input type for the function.
 * - GenerateCrossExaminationQuestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCrossExaminationQuestionsInputSchema = z.object({
  witnessName: z.string().describe('The name of the witness.'),
  topic: z.string().describe('The topic of the cross-examination.'),
});
export type GenerateCrossExaminationQuestionsInput = z.infer<typeof GenerateCrossExaminationQuestionsInputSchema>;

const GenerateCrossExaminationQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of cross-examination questions.'),
});
export type GenerateCrossExaminationQuestionsOutput = z.infer<typeof GenerateCrossExaminationQuestionsOutputSchema>;

export async function generateCrossExaminationQuestions(
  input: GenerateCrossExaminationQuestionsInput
): Promise<GenerateCrossExaminationQuestionsOutput> {
  return generateCrossExaminationQuestionsFlow(input);
}

const generateCrossExaminationQuestionsPrompt = ai.definePrompt({
  name: 'generateCrossExaminationQuestionsPrompt',
  input: {schema: GenerateCrossExaminationQuestionsInputSchema},
  output: {schema: GenerateCrossExaminationQuestionsOutputSchema},
  prompt: `You are an expert lawyer. Generate a list of 5 insightful cross-examination questions for a witness named {{{witnessName}}} regarding the topic of {{{topic}}}. The questions should be probing and designed to test the witness's testimony.`,
});

const generateCrossExaminationQuestionsFlow = ai.defineFlow(
  {
    name: 'generateCrossExaminationQuestionsFlow',
    inputSchema: GenerateCrossExaminationQuestionsInputSchema,
    outputSchema: GenerateCrossExaminationQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateCrossExaminationQuestionsPrompt(input);
    return output!;
  }
);
