import { defineStore } from "pinia";
import type { Locale } from "./i18n";
// import { useChargerStore } from "./charger";

type Overlay = "help" | "emergency" | null;

interface State {
  locale: Locale;
  tts: boolean;
  overlay: Overlay;
}

/**
 * TODO 
 * GANZ WICHTIG BARRIERFREIHEIT
 * — UI-Store: Sprache, Vorlesen (TTS), Overlays (Hilfe/Not-Halt).
 * Actions zu implementieren:
 *  - cycleLocale()      : de <-> en
 *  - toggleTts()        : tts umschalten, bei "aus" speechSynthesis.cancel()
 *  - openHelp()/closeHelp()
 *  - triggerEmergency() : useChargerStore().emergencyAbort(); overlay = "emergency"
 *  - resetEmergency()   : overlay = null; useChargerStore().reset()
 */
export const useUiStore = defineStore("ui", {
  state: (): State => ({
    locale: "de",
    tts: false,
    overlay: null,
  }),
  actions: {
    cycleLocale() {
      // TODO
    },
    toggleTts() {
      // TODO
    },
    openHelp() {
      // TODO
    },
    closeHelp() {
      // TODO
    },
    triggerEmergency() {
      // TODO
    },
    resetEmergency() {
      // TODO
    },
  },
});
