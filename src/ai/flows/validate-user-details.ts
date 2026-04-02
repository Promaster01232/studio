'use server';

/**
 * @fileOverview AI flow to validate user registration contact details (Mobile).
 *
 * - validateUserDetails - A function that validates mobile input for authenticity.
 * - ValidateUserDetailsInput - The input type for the validation function.
 * - ValidateUserDetailsOutput - The return type for the validation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateUserDetailsInputSchema = z.object({
  mobileNumber: z.string().describe('The user\'s mobile number.'),
  userType: z.string().describe('The selected user role.'),
});
export type ValidateUserDetailsInput = z.infer<typeof ValidateUserDetailsInputSchema>;

const ValidateUserDetailsOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the mobile format appears to be genuine and valid for India.'),
  reason: z.string().optional().describe('Short explanation why the details were flagged as invalid.'),
});
export type ValidateUserDetailsOutput = z.infer<typeof ValidateUserDetailsOutputSchema>;

export async function validateUserDetails(input: ValidateUserDetailsInput): Promise<ValidateUserDetailsOutput> {
  return validateUserDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateUserDetailsPrompt',
  input: {schema: ValidateUserDetailsInputSchema},
  output: {schema: ValidateUserDetailsOutputSchema},
  prompt: `You are a security auditor for a legal platform. 
Your job is to verify if the provided mobile number is a valid Indian number. Do NOT judge any other fields like names.

Input:
- Mobile: {{{mobileNumber}}}
- User Type: {{{userType}}}

Check for:
1. Indian Mobile Number Check: Must be a valid Indian mobile number. Format: 10 digits starting with 6, 7, 8, or 9. It may optionally have a +91 prefix. Numbers like 1234567890 or 0000000000 are INVALID.

If the mobile is a valid Indian number, set isValid to true. 
If the mobile is not a valid Indian number, set isValid to false and reason to "Please provide a valid Indian mobile number".

Respond only with the JSON object.`,
});

const validateUserDetailsFlow = ai.defineFlow(
  {
    name: 'validateUserDetailsFlow',
    inputSchema: ValidateUserDetailsInputSchema,
    outputSchema: ValidateUserDetailsOutputSchema,
  },
  async input => {
    let retries = 10;
    let delay = 3000;
    while (retries >= 0) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        const isTransient = 
            error.message?.includes('429') || 
            error.status === 429 || 
            error.message?.toLowerCase().includes('busy') || 
            error.message?.toLowerCase().includes('quota');

        if (retries > 0 && isTransient) {
          console.warn(`AI Rate Limit hit in validateUserDetails. Retrying in ${delay/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay = Math.min(delay * 1.5, 15000);
          retries--;
          continue;
        }
        throw error;
      }
    }
    throw new Error("AI validation timed out due to quota limits.");
  }
);
