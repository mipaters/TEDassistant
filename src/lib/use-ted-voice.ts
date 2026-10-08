"use client";

import * as React from "react";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Live voice-session state for TED's chat experience.
 *
 * Speech-to-text runs entirely in the browser via the Web Speech API (no
 * server round-trip needed, and no additional Azure cost) — supported in
 * Chrome and Edge. When a sentence is finalized, `onUtterance` fires with the
 * recognized text so the caller can send it to TED and speak the reply back
 * (e.g. via the voice-server's Azure AI Speech-backed `/api/speak` endpoint).
 */
export function useTedVoice(onUtterance: (text: string) => void) {
  const [enabled, setEnabled] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [supported, setSupported] = React.useState(true);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const suspendedRef = React.useRef(false);
  const onUtteranceRef = React.useRef(onUtterance);
  onUtteranceRef.current = onUtterance;

  React.useEffect(() => {
    setSupported(getSpeechRecognitionCtor() !== null);
  }, []);

  React.useEffect(() => {
    if (!enabled) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      setEnabled(false);
      return;
    }

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) onUtteranceRef.current(text);
        }
      }
    };
    recognition.onerror = () => {
      // Common/benign cases (no-speech, aborted) — keep listening state as-is
      // and let onend decide whether to restart.
    };
    recognition.onend = () => {
      // Browsers auto-stop recognition after a period of silence; restart
      // automatically while the user still has voice turned on, unless we
      // deliberately suspended it (e.g. while TED is speaking, so the mic
      // doesn't pick up TED's own voice and loop back as a new "question").
      if (recognitionRef.current === recognition && enabled && !suspendedRef.current) {
        try {
          recognition.start();
        } catch {
          // ignore — e.g. already started
        }
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, [enabled]);

  const toggle = React.useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  const stop = React.useCallback(() => {
    setEnabled(false);
  }, []);

  /** Temporarily stop listening (e.g. while TED's reply is being spoken aloud). */
  const pause = React.useCallback(() => {
    suspendedRef.current = true;
    recognitionRef.current?.stop();
  }, []);

  /** Resume listening after a pause(), if voice input is still turned on. */
  const resume = React.useCallback(() => {
    suspendedRef.current = false;
    if (enabled) {
      try {
        recognitionRef.current?.start();
      } catch {
        // ignore — e.g. already started
      }
    }
  }, [enabled]);

  return { enabled, listening, supported, toggle, stop, pause, resume };
}

export type TedVoiceState = ReturnType<typeof useTedVoice>;
