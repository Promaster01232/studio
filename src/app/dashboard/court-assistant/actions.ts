"use server";

import { generateCrossExaminationQuestions, type GenerateCrossExaminationQuestionsOutput } from "@/ai/flows/generate-cross-examination-questions";
import { z } from "zod";

export type CourtAssistantState = {
  status: "idle" | "loading" | "success" | "error";
  data: GenerateCrossExaminationQuestionsOutput | null;
  error: string | null;
  isSimulated?: boolean;
};

const QuestionSchema = z.object({
  witnessName: z.string().min(1, "Witness name is required."),
  topic: z.string().min(1, "Topic is required."),
  language: z.string().min(1, "Language is required."),
});

/**
 * Deterministic Forensic Fallback
 */
function generateDeterministicQuestions(witness: string, topic: string, lang: string): GenerateCrossExaminationQuestionsOutput {
    const isHindi = lang.toLowerCase().includes('hindi');
    return {
        questions: isHindi ? [
            `क्या आप पुष्टि कर सकते हैं कि आप घटना के समय ${topic} के संबंध में वहां उपस्थित थे?`,
            `क्या यह सच नहीं है कि आपके और ${witness} के बीच पहले से मतभेद रहे हैं?`,
            `क्या आप ${topic} के बारे में प्रदान किए गए अपने पिछले बयान की सत्यता की पुष्टि करते हैं?`,
            `क्या घटना के समय दृश्यता (visibility) ${topic} को स्पष्ट रूप से देखने के लिए पर्याप्त थी?`,
            `क्या आप इस बात से इनकार कर सकते हैं कि आपकी गवाही ${topic} के वास्तविक तथ्यों के विपरीत है?`
        ] : [
            `Can you confirm your exact location during the incident regarding ${topic}?`,
            `Is it not true that there was a pre-existing conflict between you and ${witness}?`,
            `Do you stand by your previously recorded statement concerning the facts of ${topic}?`,
            `Was the visibility at the time of the incident sufficient to clearly observe ${topic}?`,
            `Can you deny that your current testimony contradicts the recorded physical evidence of ${topic}?`
        ]
    };
}

export async function generateQuestionsAction(
  prevState: CourtAssistantState,
  formData: FormData
): Promise<CourtAssistantState> {
  
  const validatedFields = QuestionSchema.safeParse({
    witnessName: formData.get("witnessName"),
    topic: formData.get("topic"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    return { status: "error", data: null, error: "Invalid input matrix." };
  }

  // INSTITUTIONAL RESILIENCE: 10-Stage Retry
  let retries = 10;
  let delay = 1500;

  while (retries >= 0) {
    try {
      const result = await generateCrossExaminationQuestions(validatedFields.data);
      return { status: "success", data: result, error: null };
    } catch (error: any) {
      if (retries > 0 && (error.message?.includes('429') || error.status === 429)) {
        await new Promise(r => setTimeout(r, delay));
        delay = Math.min(delay * 1.5, 10000);
        retries--;
        continue;
      }
      
      console.warn("[AI COURT ASSISTANT] Neural Satiation - Activating Guaranteed Fallback");
      return { 
        status: "success", 
        data: generateDeterministicQuestions(validatedFields.data.witnessName, validatedFields.data.topic, validatedFields.data.language), 
        error: null,
        isSimulated: true
      };
    }
  }

  return { 
    status: "success", 
    data: generateDeterministicQuestions(validatedFields.data.witnessName, validatedFields.data.topic, validatedFields.data.language), 
    error: null,
    isSimulated: true
  };
}
