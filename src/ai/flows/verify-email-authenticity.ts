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
  firstName: z.string().describe('The user\'s first name.'),
  lastName: z.string().describe('The user\'s last name.'),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

const VerifyEmailOutputSchema = z.object({
  isAuthentic: z.boolean().describe('Whether the email and name combination appear genuine.'),
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
Analyze the following user details to determine if the account registration appears to be from a genuine person or a automated/fake bot.

User Details:
- Name: {{{firstName}}} {{{lastName}}}
- Email: {{{email}}}

Verification Checklist:
1. Email Pattern: Does the email prefix relate to the name? (e.g. rajesh.k@... for Rajesh Kumar is good).
2. Domain Authenticity: Is it a common provider (Gmail, Outlook) or a suspicious temporary mail domain?
3. Gibberish Check: Are the name or email strings random characters (asdfgh, 12345)?
4. Professionalism: For an Indian legal platform, does the email look like a standard Indian citizen's email?

Set isAuthentic to true ONLY if you are confident it's a real person. 
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
          console.warn(`AI Rate Limit hit in verifyEmailAuthenticity. Retrying in 10s...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
          retries--;
          continue;
        }
        throw error;
      }
    }
    throw new Error("AI verification timed out due to quota limits.");
  }
);
