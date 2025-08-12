"use server";
/**
 * @fileOverview A flow for translating text into different languages.
 *
 * - translateText - A function that handles the translation.
 */

import { ai } from '@/ai/genkit';
import { TranslateTextInputSchema, TranslateTextOutputSchema, type TranslateTextInput, type TranslateTextOutput } from '@/ai/types';


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
