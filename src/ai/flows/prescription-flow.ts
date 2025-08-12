"use server";
/**
 * @fileOverview A flow for checking drug prescriptions against available stock.
 *
 * - checkPrescription - A function that checks for unavailable drugs.
 */

import { ai } from '@/ai/genkit';
import { CheckPrescriptionInputSchema, CheckPrescriptionOutputSchema, type CheckPrescriptionInput, type CheckPrescriptionOutput } from '../types';

const UNAVAILABLE_DRUGS = ["Ibuprofen", "Amoxicillin"];

const prescriptionCheckPrompt = ai.definePrompt({
    name: 'prescriptionCheckPrompt',
    input: { schema: CheckPrescriptionInputSchema },
    output: { schema: CheckPrescriptionOutputSchema },
    prompt: `You are an assistant for doctors. Your task is to check a drug prescription against a list of unavailable drugs.

List of unavailable drugs:
${UNAVAILABLE_DRUGS.join("\n")}

Prescription to check:
"{{{prescription}}}"

If the prescription contains any of the unavailable drugs, you must return an object with "isSafe" set to false and a concise "advice" string telling the doctor which drug is unavailable and suggesting they prescribe an alternative.

If no unavailable drugs are found, you must return an object with "isSafe" set to true and an empty "advice" field.`,
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
