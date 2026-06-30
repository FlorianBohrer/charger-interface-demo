import { onMounted, onUnmounted, ref, type Ref } from "vue";

/**
 * Kiosk-Skalierung: skaliert eine feste Design-Auflösung (designW × designH)
 * so, dass sie den Container vollständig ausfüllt.
 */
export function useFitScale(
  container: Ref<HTMLElement | null>,
  designW: number,
  designH: number,
): { scale: Ref<number> } {
  const scale = ref(1);
  let ro: ResizeObserver | null = null;

  function update() {
    const el = container.value;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    scale.value = Math.min(width / designW, height / designH) * 0.97;
  }

  onMounted(() => {
    update();
    ro = new ResizeObserver(update);
    if (container.value) ro.observe(container.value);
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    ro?.disconnect();
    window.removeEventListener("resize", update);
  });

  return { scale };
}
