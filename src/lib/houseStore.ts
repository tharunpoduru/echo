// Lightweight client-side store for the configured house.
// Persists across reloads via localStorage; safe on SSR (guards window).

export type StoredMember = {
  id: number;
  name: string;
  relationship: string;
  email: string;
  /** Onboarding-side slug: attic | bedroom | study | kitchen | lounge | bath */
  room: string;
};

export type HouseConfig = {
  houseName: string;
  members: StoredMember[];
  character: string; // CharacterId
  savedAt: number;
};

const KEY = "echo.house.config.v1";

/** Onboarding slug -> /house route room slug */
export const ROOM_SLUG_MAP: Record<string, string> = {
  attic: "attic",
  bedroom: "childs-bedroom",
  study: "study",
  kitchen: "kitchen",
  lounge: "living-room",
  bath: "bath",
};

export function saveHouseConfig(config: Omit<HouseConfig, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    const payload: HouseConfig = { ...config, savedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors (quota, private mode)
  }
}

export function loadHouseConfig(): HouseConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HouseConfig;
  } catch {
    return null;
  }
}

/** Group members onto the /house route's room slug. */
export function membersByRoute(config: HouseConfig | null): Record<string, StoredMember[]> {
  const out: Record<string, StoredMember[]> = {};
  if (!config) return out;
  for (const m of config.members) {
    const routeSlug = ROOM_SLUG_MAP[m.room];
    if (!routeSlug) continue;
    (out[routeSlug] ||= []).push(m);
  }
  return out;
}
