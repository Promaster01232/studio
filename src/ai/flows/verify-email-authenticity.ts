'use server';

/**
 * @fileOverview AI flow to verify the authenticity of a user's email address.
 * 
 * - verifyEmailAuthenticity - Function to check if an email looks like a real person's or spam.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyEmailInputSchema = z.object({
  email: z.string().email().describe('The user\'s email address to verify.'),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

const VerifyEmailOutputSchema = z.object({
  isAuthentic: z.boolean().describe('Whether the email appears genuine and not a burner/temp address.'),
  reason: z.string().optional().describe('Explanation for the verification result.'),
  confidenceScore: z.number().min(0).max(100).describe('Confidence score of the AI assessment.'),
});
export type VerifyEmailOutput = z.infer<typeof VerifyEmailOutputSchema>;

export async function verifyEmailAuthenticity(input: VerifyEmailInput): Promise<VerifyEmailOutput> {
  return verifyEmailAuthenticityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyEmailAuthenticityPrompt',
  input: { schema: VerifyEmailInputSchema },
  output: { schema: VerifyEmailOutputSchema },
  prompt: `You are a security analyst for Nyaya Sahayak. 
Analyze the following email address to determine if it appears to be a genuine, personal or professional email, or a automated/fake/disposable address.

Email: {{{email}}}

Verification Checklist:
1. Domain Authenticity: Is it a common trusted provider (Gmail, Outlook, Yahoo, iCloud) or a known suspicious temporary/disposable mail domain?
2. Gibberish Check: Is the email prefix random characters (asdfgh123, qwerty)?
3. Trustworthiness: Does this look like a real person's primary email address?

Set isAuthentic to true ONLY if you are confident it's a real, non-disposable email. 
Provide a confidence score (0-100).
Respond ONLY with the JSON object.`,
});

const verifyEmailAuthenticityFlow = ai.defineFlow(
  {
    name: 'verifyEmailAuthenticityFlow',
    inputSchema: VerifyEmailInputSchema,
    outputSchema: VerifyEmailOutputSchema,
  },
  async input => {
    let retries = 3;
    while (retries >= 0) {
      try {
        const { output } = await prompt(input);
        return output!;
      } catch (error: any) {
        if (retries > 0 && (error.message?.includes('429') || error.status === 429)) {
          console.warn(`AI Rate Limit hit in verifyEmailAuthenticity. Retrying in 35s...`);
          await new Promise(resolve => setTimeout(resolve, 35000));
          retries--;
          continue;
        }
        throw error;
      }
    }
    throw new Error("AI verification timed out due to quota limits.");
  }
);
