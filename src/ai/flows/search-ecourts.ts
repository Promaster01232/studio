'use server';

/**
 * @fileOverview An AI agent to search for case details on eCourts.
 *
 * - searchEcourts - A function that simulates searching for a case by CNR number.
 * - SearchEcourtsInput - The input type for the searchEcourts function.
 * - SearchEcourtsOutput - The return type for the searchEcourts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchEcourtsInputSchema = z.object({
  cnr: z.string().describe('The 16-digit CNR number of the case.'),
});
export type SearchEcourtsInput = z.infer<typeof SearchEcourtsInputSchema>;

const HistoryItemSchema = z.object({
  date: z.string(),
  business: z.string(),
  nextHearing: z.string(),
  judge: z.string(),
});

const OrderItemSchema = z.object({
    date: z.string(),
    order: z.string(),
    details: z.string(),
});

const SearchEcourtsOutputSchema = z.object({
    caseType: z.string(),
    filingNumber: z.string(),
    filingDate: z.string(),
    registrationNumber: z.string(),
    registrationDate: z.string(),
    cnrNumber: z.string(),
    petitioner: z.string(),
    petitionerAdvocate: z.string(),
    respondent: z.string(),
    respondentAdvocate: z.string(),
    acts: z.string(),
    status: z.string(),
    history: z.array(HistoryItemSchema),
    orders: z.array(OrderItemSchema),
}).nullable();

export type SearchEcourtsOutput = z.infer<typeof SearchEcourtsOutputSchema>;

// This is the mock case data that our flow will return for a specific CNR.
const mockCase = {
    caseType: "Criminal Appeal",
    filingNumber: "Cr.A. 1234/2023",
    filingDate: "15-05-2023",
    registrationNumber: "Cr.A. 567/2023",
    registrationDate: "20-05-2023",
    cnrNumber: "MHHC010012342023",
    petitioner: "Rajesh Sharma",
    petitionerAdvocate: "Ms. Priya Singh",
    respondent: "State of Maharashtra",
    respondentAdvocate: "Mr. Sameer Khan (Public Prosecutor)",
    acts: "Indian Penal Code, 1860: 302",
    status: "Pending",
    history: [
        { date: "01-08-2024", business: "Arguments heard. Adjourned.", nextHearing: "15-09-2024", judge: "Hon'ble Justice S.K. Singh" },
        { date: "10-07-2024", business: "Notice issued to respondent.", nextHearing: "01-08-2024", judge: "Hon'ble Justice S.K. Singh" },
        { date: "20-05-2024", business: "Case registered.", nextHearing: "10-07-2024", judge: "Registrar" },
    ],
    orders: [
        { date: "10-07-2024", order: "Notice issued to respondent, returnable in four weeks.", details: "The court has directed that a formal notice be served to the opposing party, who must then appear or respond within a four-week period." },
        { date: "20-05-2024", order: "Appeal admitted.", details: "The appeal has been formally accepted by the court for hearing and further proceedings." },
    ]
};


export async function searchEcourts(
  input: SearchEcourtsInput
): Promise<SearchEcourtsOutput> {
  // This is a wrapper function that can be extended with more logic later.
  return searchEcourtsFlow(input);
}

// In a real application, this prompt would instruct the AI to use a tool 
// to fetch data from the eCourts website. For this demo, we simulate the result.
const searchEcourtsFlow = ai.defineFlow(
  {
    name: 'searchEcourtsFlow',
    inputSchema: SearchEcourtsInputSchema,
    outputSchema: SearchEcourtsOutputSchema,
  },
  async (input) => {
    // Simulate an API call or database lookup.
    // If the CNR matches our mock data, return the mock case.
    if (input.cnr === mockCase.cnrNumber) {
      return mockCase;
    }
    // Otherwise, return null to indicate the case was not found.
    return null;
  }
);
