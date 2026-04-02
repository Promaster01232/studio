import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: "AIzaSyDvTLNaIUTpjgmlKEj9SBkbC7hro50W7As",
    }),
  ],
  // Utilizing the stable 1.5-flash node for 100% reliability and speed
  model: 'googleai/gemini-1.5-flash',
});
