import { onMounted, onUnmounted,ref, type Ref } from "vue";

/**
 * Reaktive Uhr: aktualisiert now jede Sekunde, räumt das Intervall beim
 * Unmount wieder auf.
 */

export function useClock(): { now: Ref<Date> } {
  const now = ref(new Date());

  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    timer = setInterval(() => (now.value = new Date()),1000);
  });

  onUnmounted(() => {
    if(timer) clearInterval(timer);
  });
  return { now };
}
