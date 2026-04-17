import { formatInTimeZone } from "date-fns-tz";

export const LONDON_TZ = "Europe/London";

export function formatLondon(iso: string, pattern = "EEE d LLL, HH:mm"): string {
  return formatInTimeZone(iso, LONDON_TZ, pattern);
}

export function formatDropTime(iso: string): string {
  return formatInTimeZone(iso, LONDON_TZ, "EEEE d LLLL 'at' HH:mm");
}

export type Countdown = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasLaunched: boolean;
};

export function getCountdown(iso: string, now: Date = new Date()): Countdown {
  const target = new Date(iso).getTime();
  const total = target - now.getTime();
  if (total <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hasLaunched: true,
    };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds, hasLaunched: false };
}
