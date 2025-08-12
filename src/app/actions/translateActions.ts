"use server";

import { translateText as translateTextFlow } from "@/ai/flows/translate-flow";
import type { TranslateTextInput, TranslateTextOutput } from "./types";

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
    return await translateTextFlow(input);
}
