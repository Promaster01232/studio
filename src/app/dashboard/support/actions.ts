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

  try {
    const result = await simplifyJargon(validatedFields.data);
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to simplify the term. Please try again." };
  }
}
