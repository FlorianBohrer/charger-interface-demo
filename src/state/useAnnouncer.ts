/**
 * TODO — "Vorlesen" (Web Speech API).
 * Liest bei jedem Phasen oder Overlay-Wechsel den aktuellen Kontext vor, wenn tts aktiv.
 *
 * 
 *  - watch() mit DEFAULT (flush: "pre") läuft VOR dem DOM-Update. Wirft der
 *    Sprach-Aufruf, bricht Vue den Render-Flush ab -> View friert ein.
 *  - Lösung: watch(..., { flush: "post" }) und speak() in try/catch kapseln.
 *
 * Vorgehen:
 *  - storeToRefs(charger): phase, meter | storeToRefs(ui): tts, locale, overlay
 *  - currentText(): je nach phase/overlay einen translate(...)-String bauen
 *  - watch([phase, overlay, tts, locale], ..., { flush: "post" })
 *  - bei overlay==="emergency" immer ansagen (Sicherheit), sonst nur wenn tts
 */
export function useAnnouncer() {

}
