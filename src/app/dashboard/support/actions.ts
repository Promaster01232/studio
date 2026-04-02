"use server";

import { simplifyJargon, type SimplifyJargonOutput } from "@/ai/flows/simplify-jargon";
import { z } from "zod";

export type JargonState = {
  status: "idle" | "loading" | "success" | "error";
  data: SimplifyJargonOutput | null;
  error: string | null;
};

const JargonSchema = z.object({
  term: z.string().min(1, "Please enter a legal term."),
  language: z.string().min(1, "Please select a language."),
});

export async function simplifyJargonAction(
  prevState: JargonState,
  formData: FormData
): Promise<JargonState> {
  
  const validatedFields = JargonSchema.safeParse({
    term: formData.get("term"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      data: null,
      error: "Please enter a legal term and select a language.",
    };
  }

  // INSTITUTIONAL RESILIENCE: 5-Stage Retry for Support Node
  let retries = 5;
  let delay = 3000;

  while (retries >= 0) {
    try {
      const result = await simplifyJargon(validatedFields.data);
      return { status: "success", data: result, error: null };
    } catch (error: any) {
      if (retries > 0 && (error.message?.includes('429') || error.status === 429)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5;
        retries--;
        continue;
      }
      console.error("[AI JARGON] Failure:", error);
      return { status: "error", data: null, error: "Simplification node busy. Please try again." };
    }
  }

  return { status: "error", data: null, error: "Neural gateway timeout." };
}
