import { onMounted, onUnmounted,ref, type Ref } from "vue";

/**
 * TODO — reaktive Uhr, jede sekunde wird aktualisiert.
 * - onMounted: setInterval, das `now.value = new Date()` setzt
 * - onUnmounted: clearInterval (Cleanup nicht vergessen!)
 */

export function useClock(): { now: Ref<Date> } {
  const now = ref(new Date());
  // TODO: Intervall starten/aufräumen

  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    timer = setInterval(() => (now.value = new Date()),1000);
  });

  onUnmounted(() => {
    if(timer) clearInterval(timer);
  });
  return { now };
}
