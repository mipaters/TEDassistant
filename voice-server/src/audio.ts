/**
 * G.711 µ-law <-> 16-bit linear PCM codec.
 *
 * Twilio Media Streams send/receive 8kHz, 8-bit µ-law audio. Azure AI Speech's
 * Node SDK only accepts/produces raw 16-bit PCM (no built-in µ-law codec
 * without a native GStreamer dependency), so we convert at the edges here.
 */

const BIAS = 0x84;
const CLIP = 32635;

const MULAW_DECODE_TABLE = buildDecodeTable();

function buildDecodeTable(): Int16Array {
  const table = new Int16Array(256);
  for (let i = 0; i < 256; i++) {
    table[i] = decodeSample(i);
  }
  return table;
}

function decodeSample(muLawByte: number): number {
  const u = ~muLawByte & 0xff;
  const sign = u & 0x80;
  const exponent = (u >> 4) & 0x07;
  const mantissa = u & 0x0f;
  let sample = ((mantissa << 3) + BIAS) << exponent;
  sample -= BIAS;
  return sign ? -sample : sample;
}

/** Decode a buffer of µ-law bytes (as received from Twilio) into 16-bit PCM samples. */
export function muLawBufferToPcm16(muLaw: Buffer): Int16Array {
  const out = new Int16Array(muLaw.length);
  for (let i = 0; i < muLaw.length; i++) {
    out[i] = MULAW_DECODE_TABLE[muLaw[i]];
  }
  return out;
}

/** Encode 16-bit PCM samples into a µ-law byte buffer (for sending back to Twilio). */
export function pcm16ToMuLawBuffer(pcm: Int16Array | Buffer): Buffer {
  const samples =
    pcm instanceof Int16Array ? pcm : new Int16Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 2);
  const out = Buffer.alloc(samples.length);
  for (let i = 0; i < samples.length; i++) {
    out[i] = encodeSample(samples[i]);
  }
  return out;
}

function encodeSample(sample: number): number {
  let s = sample;
  const sign = s < 0 ? 0x80 : 0;
  if (sign) s = -s;
  if (s > CLIP) s = CLIP;
  s += BIAS;

  let exponent = 7;
  for (let mask = 0x4000; (s & mask) === 0 && exponent > 0; mask >>= 1) {
    exponent--;
  }
  const mantissa = (s >> (exponent + 3)) & 0x0f;
  const muLawByte = ~(sign | (exponent << 4) | mantissa) & 0xff;
  return muLawByte;
}
