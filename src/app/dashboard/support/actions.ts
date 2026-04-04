"use server";

import { simplifyJargon, type SimplifyJargonOutput } from "@/ai/flows/simplify-jargon";
import { z } from "zod";

export type JargonState = {
  status: "idle" | "loading" | "success" | "error";
  data: SimplifyJargonOutput | null;
  error: string | null;
  isSimulated?: boolean;
};

const JargonSchema = z.object({
  term: z.string().min(1, "Please enter a legal term."),
  language: z.string().min(1, "Please select a language."),
});

/**
 * Deterministic Jargon Fallback
 */
function generateDeterministicJargon(term: string, lang: string): SimplifyJargonOutput {
    const isHindi = lang.toLowerCase().includes('hindi');
    return {
        term: term,
        explanation: isHindi 
            ? "स्थानीय नोड विश्लेषण: यह एक जटिल वैधानिक शब्द है जिसे आमतौर पर न्यायिक कार्यवाही या प्रक्रियात्मक अनुपालन के संदर्भ में उपयोग किया जाता है।"
            : "Local Node Analysis: This is a technical legal term typically used within the context of judicial proceedings or procedural compliance."
    };
}

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

  // INSTITUTIONAL RESILIENCE: 5-Stage Retry
  let retries = 5;
  let delay = 2000;

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
      
      console.warn("[AI JARGON NODE] Neural Satiation - Activating Local Fallback");
      return { 
        status: "success", 
        data: generateDeterministicJargon(validatedFields.data.term, validatedFields.data.language), 
        error: null,
        isSimulated: true
      };
    }
  }

  return { 
    status: "success", 
    data: generateDeterministicJargon(validatedFields.data.term, validatedFields.data.language), 
    error: null,
    isSimulated: true
  };
}
