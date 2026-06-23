import { ref, type Ref } from "vue";

/**
 * TODO — reaktive Uhr, jede sekunde aktualisiert.
 * - onMounted: setInterval, das `now.value = new Date()` setzt
 * - onUnmounted: clearInterval (Cleanup nicht vergessen!)
 */
export function useClock(): { now: Ref<Date> } {
  const now = ref(new Date());
  // TODO: Intervall starten/aufräumen
  return { now };
}
