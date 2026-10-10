/**
 * Store open/close hours.
 *
 * Hours are configured per weekday through `NEXT_PUBLIC_STORE_HOURS_<DAY>`
 * environment variables (see `.env.example`). Each value is either a
 * same-day or overnight range in 24-hour `HH:MM-HH:MM` format, or `closed`.
 * All times are interpreted in `STORE_TIME_ZONE` (America/New_York, which
 * covers both EST and EDT).
 *
 * This module is pure (no Node APIs) so it runs in client components too.
 */

export const STORE_TIME_ZONE = "America/New_York";

export type DayKey = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export type DayHours = {
  /** Minutes since midnight, e.g. 10:00 -> 600. */
  open: number;
  /** Minutes since midnight. May be <= open for overnight ranges. */
  close: number;
} | null;

export type StoreHours = Record<DayKey, DayHours>;

export type StoreState = "open" | "closed";

export type StoreStatus = {
  state: StoreState;
  label: string;
};

const DAY_KEYS: readonly DayKey[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const DAY_ENV_VARS: Record<DayKey, string> = {
  SUN: "NEXT_PUBLIC_STORE_HOURS_SUN",
  MON: "NEXT_PUBLIC_STORE_HOURS_MON",
  TUE: "NEXT_PUBLIC_STORE_HOURS_TUE",
  WED: "NEXT_PUBLIC_STORE_HOURS_WED",
  THU: "NEXT_PUBLIC_STORE_HOURS_THU",
  FRI: "NEXT_PUBLIC_STORE_HOURS_FRI",
  SAT: "NEXT_PUBLIC_STORE_HOURS_SAT",
};

/** Fallback hours used when an env var is unset (matches the original design). */
export const DEFAULT_STORE_HOURS: StoreHours = {
  SUN: { open: 12 * 60, close: 18 * 60 },
  MON: { open: 10 * 60, close: 18 * 60 },
  TUE: { open: 10 * 60, close: 18 * 60 },
  WED: { open: 10 * 60, close: 18 * 60 },
  THU: { open: 10 * 60, close: 18 * 60 },
  FRI: { open: 10 * 60, close: 18 * 60 },
  SAT: { open: 10 * 60, close: 18 * 60 },
};

function parseTime(value: string, day: DayKey, which: "open" | "close"): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) {
    throw new Error(
      `Invalid ${which} time for ${day}: "${value}". Expected 24-hour HH:MM (e.g. 10:00).`,
    );
  }
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

/**
 * Read and validate the 7 weekday env vars. Unset/blank vars fall back to
 * `DEFAULT_STORE_HOURS`. Throws on malformed values.
 */
export function parseStoreHours(env: Record<string, string | undefined>): StoreHours {
  const hours = {} as StoreHours;

  for (const day of DAY_KEYS) {
    const raw = env[DAY_ENV_VARS[day]];
    if (raw === undefined || raw.trim() === "") {
      hours[day] = DEFAULT_STORE_HOURS[day];
      continue;
    }
    if (raw.trim().toLowerCase() === "closed") {
      hours[day] = null;
      continue;
    }
    const range = raw.split("-");
    if (range.length !== 2) {
      throw new Error(
        `Invalid hours for ${day}: "${raw}". Expected HH:MM-HH:MM (e.g. 10:00-18:00) or "closed".`,
      );
    }
    hours[day] = { open: parseTime(range[0], day, "open"), close: parseTime(range[1], day, "close") };
  }

  return hours;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function getZoneParts(now: Date): { dayIndex: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: string): string => parts.find((part) => part.type === type)?.value ?? "";
  const dayIndex = WEEKDAY_LABELS.indexOf(get("weekday") as (typeof WEEKDAY_LABELS)[number]);
  if (dayIndex === -1) {
    throw new Error("Unable to determine the weekday in the store time zone.");
  }
  return { dayIndex, minutes: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10) };
}

function isOpenAt(day: DayHours, minutes: number): boolean {
  if (!day) return false;
  if (day.close > day.open) return minutes >= day.open && minutes < day.close;
  // Overnight range (e.g. 10:00-02:00): only the evening part belongs to
  // this day; the early-morning part belongs to the previous day.
  return minutes >= day.open;
}

/** 600 -> "10 AM", 18*60+30 -> "6:30 PM". */
function formatTime(minutes: number): string {
  const hour24 = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  const suffix = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return minute === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/**
 * Validate the current moment against the configured hours. Labels name the
 * next transition, e.g. "Open now · Closes 6 PM" or "Closed · Opens Mon 10 AM".
 */
export function getStoreStatus(hours: StoreHours, now: Date = new Date()): StoreStatus {
  const { dayIndex, minutes } = getZoneParts(now);
  const today = hours[DAY_KEYS[dayIndex]];
  const previous = hours[DAY_KEYS[(dayIndex + 6) % 7]];

  if (today && isOpenAt(today, minutes)) {
    return { state: "open", label: `Open now · Closes ${formatTime(today.close)}` };
  }
  // Early-morning spillover from the previous day's overnight range.
  if (previous && previous.close <= previous.open && minutes < previous.close) {
    return { state: "open", label: `Open now · Closes ${formatTime(previous.close)}` };
  }
  // Opens later today.
  if (today && minutes < today.open) {
    return { state: "closed", label: `Closed · Opens ${formatTime(today.open)}` };
  }
  // Otherwise find the next day with hours.
  for (let offset = 1; offset <= 7; offset += 1) {
    const next = hours[DAY_KEYS[(dayIndex + offset) % 7]];
    if (next) {
      return {
        state: "closed",
        label: `Closed · Opens ${WEEKDAY_LABELS[(dayIndex + offset) % 7]} ${formatTime(next.open)}`,
      };
    }
  }
  return { state: "closed", label: "Closed" };
}
