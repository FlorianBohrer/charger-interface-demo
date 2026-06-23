import { computed } from "vue";
import { useUiStore } from "./ui";

export type Locale = "de" | "en";
type Dict = Record<string, string>;

/**
 * TODO — Übersetzungs-Kataloge füllen.
 * Lege Schlüssel an (z. B. "idle.title", "auth.title", "status.Available",
 * "config.full.t", "charging.power", "summary.title", "btn.read", ...).
 * Platzhalter mit Parametern, z. B. "connector.name": "Anschluss {id}".
 */
const de: Dict = {
  // TODO: deutsche Texte
};

const en: Dict = {
  // TODO: englische Texte
};

const messages: Record<Locale, Dict> = { de, en };

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  let s = messages[locale][key] ?? key;
  if (params) for (const k in params) s = s.replace(`{${k}}`, String(params[k]));
  return s;
}

export function useI18n() {
  const ui = useUiStore();
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(ui.locale, key, params);
  const locale = computed(() => ui.locale);
  return { t, locale };
}
