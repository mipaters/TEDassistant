// Future integration placeholder: Azure AI Speech (speech-to-text / text-to-speech).

export interface AzureSpeechClient {
  speechToText(audioChunk: ArrayBuffer | null): Promise<string>;
  textToSpeech(text: string): Promise<{ audioUrl: string | null }>;
}

export const azureSpeechClient: AzureSpeechClient = {
  async speechToText() {
    return "[mock transcription unavailable in demo mode]";
  },
  async textToSpeech(text: string) {
    void text;
    return { audioUrl: null };
  },
};
