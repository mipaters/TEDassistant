"use client";

import * as React from "react";

/**
 * Placeholder voice-session state for TED's chat experience.
 *
 * This intentionally does not talk to any speech service yet — it only
 * manages the on/off (and "persistent until you turn it off") lifecycle
 * the UI needs. Swap the no-op `start`/`stop` effects below for real
 * Azure AI Speech (STT) + Azure OpenAI Realtime/Speech (TTS) calls once
 * those are wired up; the public shape of this hook (`enabled`,
 * `listening`, `toggle`) is designed to stay stable across that change.
 */
export function useTedVoice() {
  const [enabled, setEnabled] = React.useState(false);

  // "listening" is split from "enabled" so a future real implementation
  // can briefly show enabled-but-not-yet-listening while a mic permission
  // prompt or connection handshake is in flight.
  const [listening, setListening] = React.useState(false);

  const toggle = React.useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      setListening(next);
      return next;
    });
  }, []);

  const stop = React.useCallback(() => {
    setEnabled(false);
    setListening(false);
  }, []);

  return { enabled, listening, toggle, stop };
}

export type TedVoiceState = ReturnType<typeof useTedVoice>;
