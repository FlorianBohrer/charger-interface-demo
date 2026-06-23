import { ref, type Ref } from "vue";

/**
 * TODO — Kiosk-Skalierung: feste Design-Auflösung (designW × designH) so
 * designen, dass sie den container füllt.
 * - scale = min(containerW/designW, containerH/designH)
 * - per ResizeObserver auf `container` neu berechnen, window-resize ebenfalls
 * - in onUnmounted aufräumen
 */
export function useFitScale(
  _container: Ref<HTMLElement | null>,
  _designW: number,
  _designH: number,
): { scale: Ref<number> } {
  const scale = ref(1);
  // TODO
  return { scale };
}
