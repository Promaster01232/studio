'use server';

/**
 * @fileOverview Generates legal bonds based on user input.
 *
 * - generateBondDocument - A function that generates legal bonds.
 * - GenerateBondDocumentInput - The input type for the generateBondDocument function.
 * - GenerateBondDocumentOutput - The return type for the generateBondDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBondDocumentInputSchema = z.object({
  bondType: z.string().describe('The type of legal bond to generate (e.g., Bail Bond, Indemnity Bond, Surety Bond, Affidavit).'),
  language: z.string().describe('The desired language for the document (Simple English, Legal English, Regional Language).'),
  details: z.string().describe('The details of the case or situation for which the bond is being generated.'),
});
export type GenerateBondDocumentInput = z.infer<typeof GenerateBondDocumentInputSchema>;

const GenerateBondDocumentOutputSchema = z.object({
  document: z.string().describe('The generated legal bond in the specified format.'),
});
export type GenerateBondDocumentOutput = z.infer<typeof GenerateBondDocumentOutputSchema>;

export async function generateBondDocument(input: GenerateBondDocumentInput): Promise<GenerateBondDocumentOutput> {
  return generateBondDocumentFlow(input);
}

const generateBondDocumentPrompt = ai.definePrompt({
  name: 'generateBondDocumentPrompt',
  input: {schema: GenerateBondDocumentInputSchema},
  output: {schema: GenerateBondDocumentOutputSchema},
  prompt: `You are an expert legal document drafter specializing in Indian law. Based on the user's request, generate a legal bond of the specified type, in the specified language. Use the provided details to generate a legally sound and properly formatted document. Ensure all placeholders like [Name], [Address], [Date] are filled.

Bond Type: {{{bondType}}}
Language: {{{language}}}
Details: {{{details}}}

Generated Document:`, 
});

const generateBondDocumentFlow = ai.defineFlow(
  {
    name: 'generateBondDocumentFlow',
    inputSchema: GenerateBondDocumentInputSchema,
    outputSchema: GenerateBondDocumentOutputSchema,
  },
  async input => {
    const {output} = await generateBondDocumentPrompt(input);
    return output!;
  }
);
