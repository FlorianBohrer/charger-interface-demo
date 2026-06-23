// TODO: Formatierungs-Helfer implementieren.

export function formatDuration(_totalSeconds: number): string {
  return "0:00";
}

export function formatEur(_value: number): string {
  return "0,00 €";
}

export function formatClock(_d: Date): string {
  return "--:--";
}
