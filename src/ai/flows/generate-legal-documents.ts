'use server';

/**
 * @fileOverview Generates legal documents based on user input.
 *
 * - generateLegalDocument - A function that generates legal documents.
 * - GenerateLegalDocumentInput - The input type for the generateLegalDocument function.
 * - GenerateLegalDocumentOutput - The return type for the generateLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLegalDocumentInputSchema = z.object({
  documentType: z.string().describe('The type of legal document to generate (e.g., Police Complaint, FIR Application, Legal Notice).'),
  language: z.string().describe('The desired language for the document (Simple English, Legal English, Regional Language).'),
  details: z.string().describe('The details of the case or situation for which the document is being generated.'),
});
export type GenerateLegalDocumentInput = z.infer<typeof GenerateLegalDocumentInputSchema>;

const GenerateLegalDocumentOutputSchema = z.object({
  document: z.string().describe('The generated legal document in the specified format.'),
});
export type GenerateLegalDocumentOutput = z.infer<typeof GenerateLegalDocumentOutputSchema>;

export async function generateLegalDocument(input: GenerateLegalDocumentInput): Promise<GenerateLegalDocumentOutput> {
  return generateLegalDocumentFlow(input);
}

const generateLegalDocumentPrompt = ai.definePrompt({
  name: 'generateLegalDocumentPrompt',
  input: {schema: GenerateLegalDocumentInputSchema},
  output: {schema: GenerateLegalDocumentOutputSchema},
  prompt: `You are an expert legal document drafter. Based on the user's request, generate a legal document of the specified type, in the specified language. Use the provided details to generate the document. 

Document Type: {{{documentType}}}
Language: {{{language}}}
Details: {{{details}}}

Generated Document:`, 
});

const generateLegalDocumentFlow = ai.defineFlow(
  {
    name: 'generateLegalDocumentFlow',
    inputSchema: GenerateLegalDocumentInputSchema,
    outputSchema: GenerateLegalDocumentOutputSchema,
  },
  async input => {
    const {output} = await generateLegalDocumentPrompt(input);
    return output!;
  }
);
