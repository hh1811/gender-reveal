import type { VoteChoice } from "./types";

export function colorFor(v: VoteChoice): string {
  return v === "nino" ? "#2C6E8F" : "#B14B7E";
}
export function softFor(v: VoteChoice): string {
  return v === "nino" ? "#e3f3fd" : "#fce6f0";
}
export function barColorFor(v: VoteChoice): string {
  return v === "nino" ? "#8ECDF7" : "#F7A8C8";
}
export function initialFor(name: string): string {
  return (name || "?").trim().charAt(0).toUpperCase();
}
export function relativeTime(iso: string): string {
  const sec = (Date.now() - new Date(iso).getTime()) / 1000;
  if (sec < 60) return "ahora";
  const m = Math.floor(sec / 60);
  if (m < 60) return `hace ${m}m`;
  return `hace ${Math.floor(m / 60)}h`;
}
export function relativeTimeSeconds(iso: string): string {
  const sec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (sec < 5) return "Justo ahora";
  if (sec < 60) return `Hace ${sec} segundos`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `Hace ${m} minuto${m === 1 ? "" : "s"}`;
  const h = Math.floor(m / 60);
  return `Hace ${h} hora${h === 1 ? "" : "s"}`;
}
