import fs from "node:fs";
import path from "node:path";
import { config } from "./config";

// Azure App Service (Linux) persists the /home mount across restarts and
// deploys, unlike the rest of the container filesystem. Fall back to a local
// .data folder for local development.
const DATA_DIR = fs.existsSync("/home") ? "/home/data" : path.join(process.cwd(), ".data");
const CONFIG_FILE = path.join(DATA_DIR, "demo-config.json");

export interface TrustedContact {
  id: string;
  name: string;
  phoneNumber: string;
}

interface DemoConfig {
  sarahPhoneNumber: string;
  trustedContacts: TrustedContact[];
}

const state: DemoConfig = {
  sarahPhoneNumber: config.defaultSarahPhoneNumber ?? "",
  trustedContacts: [],
};

function tryLoad(): void {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DemoConfig>;
    if (typeof parsed.sarahPhoneNumber === "string" && parsed.sarahPhoneNumber) {
      state.sarahPhoneNumber = parsed.sarahPhoneNumber;
    }
    if (Array.isArray(parsed.trustedContacts)) {
      state.trustedContacts = parsed.trustedContacts.filter(
        (c): c is TrustedContact =>
          typeof c?.id === "string" && typeof c?.name === "string" && typeof c?.phoneNumber === "string"
      );
    }
  } catch {
    // No saved config yet (or it's unreadable) — keep the env-var default.
  }
}
tryLoad();

/**
 * Normalizes user-entered phone numbers (e.g. "(416) 555-0179") into E.164
 * form (e.g. "+14165550179") for Twilio's APIs. Returns undefined if the
 * input doesn't look like a plausible phone number.
 */
export function normalizePhoneNumber(input: string): string | undefined {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^\d]/g, "");
  if (digits.length < 10 || digits.length > 15) return undefined;
  if (hasPlus) return `+${digits}`;
  // Assume North American numbers entered without a country code.
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

export function getSarahPhoneNumber(): string {
  return state.sarahPhoneNumber;
}

export function setSarahPhoneNumber(phoneNumber: string): void {
  state.sarahPhoneNumber = phoneNumber;
  persist();
}

export function getTrustedContacts(): TrustedContact[] {
  return state.trustedContacts;
}

export function addTrustedContact(name: string, phoneNumber: string): TrustedContact {
  const contact: TrustedContact = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, phoneNumber };
  state.trustedContacts = [...state.trustedContacts, contact];
  persist();
  return contact;
}

export function removeTrustedContact(id: string): void {
  state.trustedContacts = state.trustedContacts.filter((c) => c.id !== id);
  persist();
}

/**
 * Looks up whether an inbound caller's number belongs to a trusted contact
 * (e.g. Sarah's husband), so TED can put the call straight through live
 * instead of screening it — mirroring how a real assistant recognizes a
 * familiar voice instantly.
 */
export function findTrustedContactByNumber(phoneNumber: string): TrustedContact | undefined {
  return state.trustedContacts.find((c) => c.phoneNumber === phoneNumber);
}

function persist(): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error("[demo-config] failed to persist demo config:", err);
  }
}
