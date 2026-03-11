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
  prompt: `You are a specialized Email Deliverability & Security Auditor for Nyaya Sahayak.
Your task is to perform a simulated SMTP Handshake and Forensic Domain Audit on the provided email address to ensure it is authentic and deliverable.

Email to Audit: {{{email}}}

Audit Protocol:
1. **Disposable Email Detection (DEA)**: Check if the domain belongs to known disposable email providers (e.g., mailinator.com, temp-mail.org, guerrilla-mail.com, 10minutemail.com, yopmail.com, sharklasers.com, etc.). Reject if matched.
2. **Domain Reputation & MX Readiness**: Assess if the domain is a legitimate, high-reputation provider (Gmail, Outlook, Yahoo, Proton, iCloud) or a verified corporate/educational domain. Reject domains that appear to be random strings, gibberish, or low-reputation TLDs frequently used for automated spam.
3. **Syntax & Forensic Pattern Analysis**: Check for bot-generated patterns in the prefix (e.g., long strings of random hex characters, repetitive numbers, or nonsensical letter sequences).
4. **Simulated SMTP Handshake**: Based on your knowledge of mail server configurations, determine if this address format is likely to be a "deliverable" active mailbox on its host server.

Verdict Requirements:
- Set 'isAuthentic' to 'true' ONLY if the email is a genuine, non-disposable, and deliverable personal or professional address.
- If the email is suspicious, disposable, or formatted like a bot, set 'isAuthentic' to 'false' and provide a specific, professional 'reason' (e.g., "Disposable email provider detected", "Suspicious bot-pattern prefix", "Invalid domain reputation").

Provide a confidence score (0-100) for your assessment.
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
