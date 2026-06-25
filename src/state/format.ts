// TODO: Formatierungs-Helfer implementieren.

export function formatDuration(s: number) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2,"0")}`;
}

export function formatEur(v: number) {
  return v.toLocaleString("de-DE", {style: "currency", currency: "EUR"});
}

export function formatClock(d: Date) {
  return  d.toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"});
}
