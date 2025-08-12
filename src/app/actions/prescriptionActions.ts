"use server";

import { checkPrescription as checkPrescriptionFlow } from "@/ai/flows/prescription-flow";
import type { CheckPrescriptionInput, CheckPrescriptionOutput } from "./types";

export async function checkPrescription(input: CheckPrescriptionInput): Promise<CheckPrescriptionOutput> {
  return await checkPrescriptionFlow(input);
}
