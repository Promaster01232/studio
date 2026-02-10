'use server';

/**
 * @fileOverview Explains a legal document in simple English, highlighting legal risks, deadlines, required actions, and consequences of ignoring the document.
 *
 * - understandLegalDocument - A function that handles the legal document understanding process.
 * - UnderstandLegalDocumentInput - The input type for the understandLegalDocument function.
 * - UnderstandLegalDocumentOutput - The return type for the understandLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandLegalDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      'A legal document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
});
export type UnderstandLegalDocumentInput = z.infer<typeof UnderstandLegalDocumentInputSchema>;

const UnderstandLegalDocumentOutputSchema = z.object({
  summary: z.string().describe('Meaning in simple English'),
  legalRisks: z.string().describe('Legal risks'),
  deadlines: z.string().describe('Deadlines'),
  requiredActions: z.string().describe('Required actions'),
  consequences: z.string().describe('Consequences of ignoring the document'),
});
export type UnderstandLegalDocumentOutput = z.infer<typeof UnderstandLegalDocumentOutputSchema>;

export async function understandLegalDocument(
  input: UnderstandLegalDocumentInput
): Promise<UnderstandLegalDocumentOutput> {
  return understandLegalDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandLegalDocumentPrompt',
  input: {schema: UnderstandLegalDocumentInputSchema},
  output: {schema: UnderstandLegalDocumentOutputSchema},
  prompt: `You are an AI legal assistant that helps people understand legal documents.

You will receive a legal document, and you will explain it in simple English, highlighting legal risks, deadlines, required actions, and consequences of ignoring the document.

Use the following as the primary source of information about the legal document.

Document: {{media url=documentDataUri}}

Summary in simple English: 
Legal Risks:
Deadlines:
Required Actions:
Consequences of Ignoring:
`,
});

const understandLegalDocumentFlow = ai.defineFlow(
  {
    name: 'understandLegalDocumentFlow',
    inputSchema: UnderstandLegalDocumentInputSchema,
    outputSchema: UnderstandLegalDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
