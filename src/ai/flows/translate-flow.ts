"use server";
/**
 * @fileOverview A flow for translating text into different languages.
 *
 * - translateText - A function that handles the translation.
 */

import { ai } from '@/ai/genkit';
import { TranslateTextInputSchema, TranslateTextOutputSchema } from '../types';

const translationPrompt = ai.definePrompt({
    name: 'translationPrompt',
    input: { schema: TranslateTextInputSchema },
    output: { schema: TranslateTextOutputSchema },
    prompt: `Translate the following text into the specified target language.

If the text contains "&&" as a separator, translate each segment separately and preserve the "&&" separator in the output.

Text to translate: {{{text}}}
Target Language: {{{targetLanguage}}}

Provide only the translated text in the 'translation' field of the output.`,
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

export async function translateText(input: import("../types").TranslateTextInput): Promise<import("../types").TranslateTextOutput> {
    return translateFlow(input);
}
