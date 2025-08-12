"use server";
/**
 * @fileOverview A flow for translating text into different languages.
 *
 * - translateText - A function that handles the translation.
 * - TranslateTextInput - The input type for the translation function.
 * - TranslateTextOutput - The return type for the translation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language (e.g., Iranian, Iraqi, Turkish, Pakistani).'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;


const translationPrompt = ai.definePrompt({
    name: 'translationPrompt',
    input: { schema: TranslateTextInputSchema },
    output: { schema: TranslateTextOutputSchema },
    prompt: `Translate the following text into the specified target language.

Text to translate: {{{text}}}
Target Language: {{{targetLanguage}}}

Provide only the translated text.`,
});


const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    const { output } = await translationPrompt(input);
    return output!;
  }
);

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
    return translateFlow(input);
}
