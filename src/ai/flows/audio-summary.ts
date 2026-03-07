
'use server';

/**
 * @fileOverview A flow to generate an audio summary of AI findings.
 *
 * - generateAudioSummary - A function that handles the TTS process.
 * - AudioSummaryInput - The input type for the flow.
 * - AudioSummaryOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const AudioSummaryInputSchema = z.object({
  text: z.string().describe('The report text to be converted to audio.'),
  language: z.string().describe('The language of the text.'),
});
export type AudioSummaryInput = z.infer<typeof AudioSummaryInputSchema>;

const AudioSummaryOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});
export type AudioSummaryOutput = z.infer<typeof AudioSummaryOutputSchema>;

export async function generateAudioSummary(input: AudioSummaryInput): Promise<AudioSummaryOutput> {
  return audioSummaryFlow(input);
}

const audioSummaryFlow = ai.defineFlow(
  {
    name: 'audioSummaryFlow',
    inputSchema: AudioSummaryInputSchema,
    outputSchema: AudioSummaryOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: `You are an AI legal assistant. Please read out and explain the following report clearly and professionally in ${input.language}:

${input.text}`,
    });

    if (!media || !media.url) {
      throw new Error('No audio media returned from the model.');
    }

    const pcmBase64 = media.url.substring(media.url.indexOf(',') + 1);
    const pcmBuffer = Buffer.from(pcmBase64, 'base64');
    
    const wavBase64 = await toWav(pcmBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
