import { config } from 'dotenv';
config();

import '@/ai/flows/generate-case-summary.ts';
import '@/ai/flows/analyze-case-strength.ts';
import '@/ai/flows/generate-legal-documents.ts';
import '@/ai/flows/understand-legal-document.ts';