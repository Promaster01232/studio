'use server';
/**
 * @fileOverview AI flow to verify advocate certificates and bar enrollment documents.
 *
 * - verifyAdvocateCertificate - A function that handles the certificate verification process.
 * - VerifyAdvocateCertificateInput - The input type for the verification function.
 * - VerifyAdvocateCertificateOutput - The return type for the verification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyAdvocateCertificateInputSchema = z.object({
  certificateDataUri: z
    .string()
    .describe(
      "The certificate image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fullName: z.string().describe('The expected name on the certificate.'),
  barId: z.string().describe('The expected Bar Council ID.'),
});
export type VerifyAdvocateCertificateInput = z.infer<typeof VerifyAdvocateCertificateInputSchema>;

const VerifyAdvocateCertificateOutputSchema = z.object({
  isAuthentic: z.boolean().describe('Whether the document appears to be a genuine legal certificate or Bar ID.'),
  matchesUser: z.boolean().describe('Whether the name and Bar ID on the document match the provided details.'),
  reason: z.string().optional().describe('Short explanation why the document was flagged or mismatched.'),
});
export type VerifyAdvocateCertificateOutput = z.infer<typeof VerifyAdvocateCertificateOutputSchema>;

export async function verifyAdvocateCertificate(input: VerifyAdvocateCertificateInput): Promise<VerifyAdvocateCertificateOutput> {
  return verifyAdvocateCertificateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyAdvocateCertificatePrompt',
  input: {schema: VerifyAdvocateCertificateInputSchema},
  output: {schema: VerifyAdvocateCertificateOutputSchema},
  prompt: `You are a professional legal credential validator for Nyaya Sahayak. 
Your job is to analyze the provided document (Bar Council enrollment certificate or ID card) and verify if it matches the applicant's details.

Expected Details:
- Full Name: {{{fullName}}}
- Bar ID: {{{barId}}}

Verification Criteria:
1. Authenticity: Check if the document looks like a standard Bar Council of India (or state council) certificate or ID. 
2. Match: Confirm if the name on the document matches "{{{fullName}}}" (be flexible with middle names or initials).
3. ID Confirmation: Confirm if the Bar ID shown matches "{{{barId}}}".
4. Validity: Ensure the document is not expired (if expiry is shown) and is not obviously blurred or irrelevant.

Document Image: {{media url=certificateDataUri}}

If the details match and the document is authentic, set isAuthentic and matchesUser to true. 
Otherwise, provide a polite, professional reason for the failure.

Respond only with the JSON object.`,
});

const verifyAdvocateCertificateFlow = ai.defineFlow(
  {
    name: 'verifyAdvocateCertificateFlow',
    inputSchema: VerifyAdvocateCertificateInputSchema,
    outputSchema: VerifyAdvocateCertificateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
