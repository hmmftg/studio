import { z } from 'zod';

// Define Zod schemas for validation
export const CheckPrescriptionInputSchema = z.object({
  prescription: z.string().describe('The name of the drug to check.'),
});
export const CheckPrescriptionOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the drug is available or not.'),
  advice: z.string().describe('Advice for the doctor if the drug is unavailable.'),
});

export const TranslateTextInputSchema = z.object({
    text: z.string().describe("The text to be translated."),
    targetLanguage: z.string().describe("The target language for translation (e.g., 'Turkish', 'Arabic')."),
});
export const TranslateTextOutputSchema = z.object({
    translation: z.string().describe("The translated text."),
});


// Define TypeScript types from the Zod schemas
export type CheckPrescriptionInput = z.infer<typeof CheckPrescriptionInputSchema>;
export type CheckPrescriptionOutput = z.infer<typeof CheckPrescriptionOutputSchema>;
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;
