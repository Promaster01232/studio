"use server";

import { generateCaseSummary, type GenerateCaseSummaryOutput } from "@/ai/flows/generate-case-summary";
import { z } from "zod";

export type CaseSummaryState = {
  status: "idle" | "loading" | "success" | "error";
  data: GenerateCaseSummaryOutput | null;
  error: string | null;
};

const ProblemSchema = z.object({
  problemDescription: z.string().min(20, "Please provide a more detailed description."),
});

export async function summarizeCaseAction(
  prevState: CaseSummaryState,
  formData: FormData
): Promise<CaseSummaryState> {
  const validatedFields = ProblemSchema.safeParse({
    problemDescription: formData.get("problemDescription"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      data: null,
      error: validatedFields.error.flatten().fieldErrors.problemDescription?.[0] || "Invalid input.",
    };
  }
  
  try {
    const result = await generateCaseSummary({
      problemDescription: validatedFields.data.problemDescription,
    });
    return { status: "success", data: result, error: null };
  } catch (error) {
    console.error(error);
    return { status: "error", data: null, error: "Failed to analyze the problem. Please try again." };
  }
}
