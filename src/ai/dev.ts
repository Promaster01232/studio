import { config } from 'dotenv';
config();

import '@/ai/flows/generate-case-summary.ts';
import '@/ai/flows/analyze-case-strength.ts';
import '@/ai/flows/generate-legal-documents.ts';
import '@/ai/flows/understand-legal-document.ts';
import '@/ai/flows/generate-bond-document.ts';
import '@/ai/flows/generate-cross-examination-questions.ts';
import '@/ai/flows/simplify-jargon.ts';
