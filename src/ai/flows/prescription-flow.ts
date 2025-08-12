"use server";
/**
 * @fileOverview A flow for checking drug prescriptions against available stock.
 *
 * - checkPrescription - A function that checks for unavailable drugs.
 * - CheckPrescriptionInput - The input type for the check function.
 * - CheckPrescriptionOutput - The return type for the check function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const UNAVAILABLE_DRUGS = ["Ibuprofen", "Amoxicillin"];

export const CheckPrescriptionInputSchema = z.object({
  prescription: z.string().describe('The full text of the prescription to check.'),
});
export type CheckPrescriptionInput = z.infer<typeof CheckPrescriptionInputSchema>;

export const CheckPrescriptionOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the prescription is safe to proceed (contains no unavailable drugs).'),
  advice: z.string().describe('Advice for the doctor if an unavailable drug is found.'),
});
export type CheckPrescriptionOutput = z.infer<typeof CheckPrescriptionOutputSchema>;


const prescriptionCheckPrompt = ai.definePrompt({
    name: 'prescriptionCheckPrompt',
    input: { schema: CheckPrescriptionInputSchema },
    output: { schema: CheckPrescriptionOutputSchema },
    prompt: `You are an assistant for doctors. Your task is to check a drug prescription against a list of unavailable drugs.

List of unavailable drugs:
${UNAVAILABLE_DRUGS.join("\n")}

Prescription to check:
"{{{prescription}}}"

If the prescription contains any of the unavailable drugs, set "isSafe" to false and provide a concise "advice" string telling the doctor which drug is unavailable and suggesting they prescribe an alternative.

If no unavailable drugs are found, set "isSafe" to true and leave the "advice" field empty.`,
});


const prescriptionCheckFlow = ai.defineFlow(
  {
    name: 'prescriptionCheckFlow',
    inputSchema: CheckPrescriptionInputSchema,
    outputSchema: CheckPrescriptionOutputSchema,
  },
  async (input) => {
    // A simple string check could also work here, but an LLM can handle more complex cases and typos.
    const lowerCasePrescription = input.prescription.toLowerCase();
    const hasUnavailable = UNAVAILABLE_DRUGS.some(drug => lowerCasePrescription.includes(drug.toLowerCase()));

    if (!hasUnavailable) {
        return { isSafe: true, advice: "" };
    }

    const { output } = await prescriptionCheckPrompt(input);
    return output!;
  }
);


export async function checkPrescription(input: CheckPrescriptionInput): Promise<CheckPrescriptionOutput> {
    return prescriptionCheckFlow(input);
}
