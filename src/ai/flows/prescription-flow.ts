"use server";
/**
 * @fileOverview A flow for checking drug prescriptions against available stock.
 *
 * - checkPrescription - A function that checks for unavailable drugs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { CheckPrescriptionInput, CheckPrescriptionOutput } from '../types';
import { CheckPrescriptionInputSchema, CheckPrescriptionOutputSchema } from '../types';

const UNAVAILABLE_DRUGS = ["Ibuprofen", "Amoxicillin"];

const prescriptionCheckFlow = ai.defineFlow(
  {
    name: 'prescriptionCheckFlow',
    inputSchema: CheckPrescriptionInputSchema,
    outputSchema: CheckPrescriptionOutputSchema,
  },
  async (input) => {
    const lowerCasePrescription = input.prescription.toLowerCase();
    const unavailableDrug = UNAVAILABLE_DRUGS.find(drug => lowerCasePrescription.includes(drug.toLowerCase()));

    if (unavailableDrug) {
        return { 
            isSafe: false, 
            advice: `The drug "${unavailableDrug}" is currently unavailable. Please prescribe an alternative.` 
        };
    }

    return { isSafe: true, advice: "" };
  }
);

export async function checkPrescription(input: CheckPrescriptionInput): Promise<CheckPrescriptionOutput> {
    return prescriptionCheckFlow(input);
}
