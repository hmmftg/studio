import { z } from 'zod';

// Prescription Flow
export const CheckPrescriptionInputSchema = z.object({
  prescription: z.string().describe('The full text of the prescription to check.'),
});
export type CheckPrescriptionInput = z.infer<typeof CheckPrescriptionInputSchema>;

export const CheckPrescriptionOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the prescription is safe to proceed (contains no unavailable drugs).'),
  advice: z.string().describe('Advice for the doctor if an unavailable drug is found.'),
});
export type CheckPrescriptionOutput = z.infer<typeof CheckPrescriptionOutputSchema>;


// Translate Flow
export const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language (e.g., Iranian, Iraqi, Turkish, Pakistani).'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

export const TranslateTextOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;
