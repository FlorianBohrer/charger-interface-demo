import { defineStore } from "pinia";
import type { Locale } from "./i18n";
import { useChargerStore } from "./charger";

type Overlay = "help" | "emergency" | null;

interface State {
  locale: Locale;
  tts: boolean;
  overlay: Overlay;
}

/** UI-Store: Sprache, Vorlesen (TTS), Overlays (Hilfe/Not-Halt). */
export const useUiStore = defineStore("ui", {
  state: (): State => ({
    locale: "de",
    tts: false,
    overlay: null,
  }),
  actions: {
    cycleLocale() {
      this.locale = this.locale === "de" ? "en" : "de";
    },
    toggleTts() {
      this.tts = !this.tts;
      if (!this.tts && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    openHelp() {
      this.overlay = "help";
    },
    closeHelp() {
      if (this.overlay === "help") this.overlay = null;
    },
    triggerEmergency() {
      useChargerStore().emergencyAbort();
      this.overlay = "emergency";
    },
    resetEmergency() {
      this.overlay = null;
      useChargerStore().reset();
    },
  },
});
