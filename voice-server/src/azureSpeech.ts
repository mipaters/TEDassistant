import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { config, isAzureSpeechConfigured } from "./config";

function speechConfig(): sdk.SpeechConfig {
  if (!isAzureSpeechConfigured()) {
    throw new Error("Azure AI Speech is not configured (AZURE_SPEECH_KEY / AZURE_SPEECH_REGION).");
  }
  const sc = sdk.SpeechConfig.fromSubscription(config.azureSpeech.key as string, config.azureSpeech.region as string);
  sc.speechSynthesisVoiceName = config.azureSpeech.voice;
  sc.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Raw8Khz16BitMonoPcm;
  return sc;
}

/**
 * One call's live speech session: a continuous speech-to-text recognizer fed
 * from a push stream of decoded PCM16 audio, plus text-to-speech synthesis
 * back to PCM16 (which the caller re-encodes to µ-law for Twilio).
 */
export class SpeechSession {
  private pushStream: sdk.PushAudioInputStream;
  private recognizer: sdk.SpeechRecognizer;
  private started = false;

  constructor(onFinalTranscript: (text: string) => void, onError?: (err: string) => void) {
    const format = sdk.AudioStreamFormat.getWaveFormatPCM(8000, 16, 1);
    this.pushStream = sdk.AudioInputStream.createPushStream(format);
    const audioConfig = sdk.AudioConfig.fromStreamInput(this.pushStream);
    this.recognizer = new sdk.SpeechRecognizer(speechConfig(), audioConfig);

    this.recognizer.recognized = (_sender, event) => {
      if (event.result.reason === sdk.ResultReason.RecognizedSpeech && event.result.text.trim()) {
        onFinalTranscript(event.result.text.trim());
      }
    };
    this.recognizer.canceled = (_sender, event) => {
      onError?.(`Speech recognition canceled: ${event.errorDetails}`);
    };
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.recognizer.startContinuousRecognitionAsync();
  }

  /** Feed decoded PCM16 (8kHz, mono) samples from the caller's audio into the recognizer. */
  writePcm16(samples: Int16Array) {
    const arrayBuffer = samples.buffer.slice(
      samples.byteOffset,
      samples.byteOffset + samples.byteLength
    ) as ArrayBuffer;
    this.pushStream.write(arrayBuffer);
  }

  close() {
    try {
      this.recognizer.stopContinuousRecognitionAsync(
        () => this.recognizer.close(),
        () => this.recognizer.close()
      );
    } catch {
      // best-effort cleanup
    }
    this.pushStream.close();
  }
}

/** Synthesizes text to 16-bit, 8kHz, mono PCM audio using TED's configured male voice. */
export function synthesizeSpeech(text: string): Promise<Int16Array> {
  return new Promise((resolve, reject) => {
    if (!isAzureSpeechConfigured()) {
      reject(new Error("Azure AI Speech is not configured (AZURE_SPEECH_KEY / AZURE_SPEECH_REGION)."));
      return;
    }
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig());
    synthesizer.speakTextAsync(
      text,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(new Int16Array(result.audioData));
        } else {
          reject(new Error(`Speech synthesis failed: ${result.errorDetails ?? result.reason}`));
        }
      },
      (error) => {
        synthesizer.close();
        reject(new Error(String(error)));
      }
    );
  });
}
