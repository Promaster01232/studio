'use server';

/**
 * @fileOverview AI flow to validate user registration details.
 *
 * - validateUserDetails - A function that validates user input for authenticity.
 * - ValidateUserDetailsInput - The input type for the validation function.
 * - ValidateUserDetailsOutput - The return type for the validation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateUserDetailsInputSchema = z.object({
  firstName: z.string().describe('The user\'s first name.'),
  lastName: z.string().describe('The user\'s last name.'),
  email: z.string().describe('The user\'s email address.'),
  mobileNumber: z.string().describe('The user\'s mobile number.'),
  userType: z.string().describe('The selected user role.'),
});
export type ValidateUserDetailsInput = z.infer<typeof ValidateUserDetailsInputSchema>;

const ValidateUserDetailsOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the user details appear to be genuine and valid.'),
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
  prompt: `You are a security auditor for a legal platform called Nyaya Sahayak. 
Your job is to verify if the following user details appear genuine or if they look like spam/fake registrations.

Details:
- First Name: {{{firstName}}}
- Last Name: {{{lastName}}}
- Email: {{{email}}}
- Mobile: {{{mobileNumber}}}
- User Type: {{{userType}}}

Check for:
1. Gibberish names (e.g., "xyz", "asdfasdf", "123", "a b c").
2. Names that are clearly not human names (e.g., "Tester", "Bot", "Admin", "User").
3. Mobile numbers that are clearly fake (e.g., "1234567890", "0000000000", "9999999999").
4. Emails that look like burner or temporary addresses.

If the details look mostly genuine, set isValid to true. 
If they look like a fake or test registration, set isValid to false and provide a polite, short reason (e.g., "Please provide a valid full name").

Respond only with the JSON object.`,
});

const validateUserDetailsFlow = ai.defineFlow(
  {
    name: 'validateUserDetailsFlow',
    inputSchema: ValidateUserDetailsInputSchema,
    outputSchema: ValidateUserDetailsOutputSchema,
  },
  async input => {
    let retries = 3;
    while (retries >= 0) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        if (retries > 0 && (error.message?.includes('429') || error.status === 429)) {
          console.warn(`AI Rate Limit hit in validateUserDetails. Retrying in 35s (Retries left: ${retries})...`);
          await new Promise(resolve => setTimeout(resolve, 35000));
          retries--;
          continue;
        }
        throw error;
      }
    }
    throw new Error("AI validation timed out due to quota limits. Please try again soon.");
  }
);
