"use client";

const MEMBER_ID_KEY = "bff-fr:memberId";
const ONBOARDED_KEY = "bff-fr:onboarded";

export function getSessionMemberId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(MEMBER_ID_KEY);
}

export function setSessionMemberId(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEMBER_ID_KEY, id);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MEMBER_ID_KEY);
  window.localStorage.removeItem(ONBOARDED_KEY);
}

export function hasOnboarded(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ONBOARDED_KEY) === "1";
}

export function markOnboarded(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDED_KEY, "1");
}
