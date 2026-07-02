<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const props = withDefaults(
  defineProps<{ count?: number; speed?: number }>(),
  { count: 55, speed: 1 },
);

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let ro: ResizeObserver | null = null;
let w = 0;
let h = 0;
let dpr = 1;

interface P {
  x: number;
  y: number;
  r: number;
  vy: number; // Aufwärtsdrift
  vx: number; // seitliches Wabern
  a: number; // Basis-Alpha
  tw: number; // Twinkle-Phase
  ix: number; // Touch-Impuls X (klingt ab)
  iy: number; // Touch-Impuls Y (klingt ab)
  boost: number; // kurzer Helligkeits-Boost bei Touch
}
let parts: P[] = [];
let accent = "oklch(0.84 0.17 158)"; // Fallback = --color-hyc-accent

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

function spawn(atBottom = false): P {
  return {
    x: rnd(0, w),
    y: atBottom ? h + rnd(0, 40) : rnd(0, h),
    r: rnd(0.6, 2.6),
    vy: -rnd(0.15, 0.6) * props.speed,
    vx: rnd(-0.15, 0.15),
    a: rnd(0.15, 0.7),
    tw: rnd(0, Math.PI * 2),
    ix: 0,
    iy: 0,
    boost: 0,
  };
}

/** Viewport-Koordinaten -> Canvas-Koordinaten, dann Impuls radial verteilen.
 *  getBoundingClientRect fängt die Kiosk-Skalierung automatisch mit ab. */
function impulse(clientX: number, clientY: number, strength: number, radius: number) {
  const el = canvas.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const px = ((clientX - rect.left) / rect.width) * w;
  const py = ((clientY - rect.top) / rect.height) * h;
  for (const p of parts) {
    const dx = p.x - px;
    const dy = p.y - py;
    const dist = Math.hypot(dx, dy);
    if (dist < radius && dist > 0.01) {
      const f = (1 - dist / radius) * strength;
      p.ix += (dx / dist) * f;
      p.iy += (dy / dist) * f;
      p.boost = Math.min(0.6, p.boost + (1 - dist / radius) * 0.5);
    }
  }
}

function onDown(e: PointerEvent) { impulse(e.clientX, e.clientY, 7, 230); }
function onMove(e: PointerEvent) { impulse(e.clientX, e.clientY, 0.5, 130); }

function resize() {
  const el = canvas.value;
  if (!el || !ctx) return;
  const rect = el.getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = rect.width;
  h = rect.height;
  el.width = Math.round(w * dpr);
  el.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function frame() {
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;

  for (const p of parts) {
    p.y += p.vy;
    p.x += p.vx;
    p.x += p.ix; // Touch-Impuls
    p.y += p.iy;
    p.ix *= 0.93; // Reibung -> Impuls klingt weich aus
    p.iy *= 0.93;
    p.boost *= 0.95; // Helligkeits-Boost verblasst
    p.tw += 0.02;

    // oben raus -> unten neu einsetzen
    if (p.y < -10) Object.assign(p, spawn(true));
    if (p.x < -10) p.x = w + 10;
    else if (p.x > w + 10) p.x = -10;

    const alpha = Math.min(1, p.a * (0.55 + 0.45 * Math.sin(p.tw)) + p.boost); // Flackern + Touch-Boost
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = p.r * 4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  raf = requestAnimationFrame(frame);
}

onMounted(() => {
  const el = canvas.value;
  if (!el) return;
  ctx = el.getContext("2d");
  if (!ctx) return;

  // echte Accent-Farbe aus dem Theme ziehen
  const cssAccent = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-hyc-accent")
    .trim();
  if (cssAccent) accent = cssAccent;

  resize();
  parts = Array.from({ length: props.count }, () => spawn());

  ro = new ResizeObserver(resize);
  ro.observe(el);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    // Reduced Motion: einmal statisch zeichnen, keine Animation, keine Interaktion
    frame();
    cancelAnimationFrame(raf);
  } else {
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  ro?.disconnect();
  window.removeEventListener("pointerdown", onDown);
  window.removeEventListener("pointermove", onMove);
});
</script>

<template>
  <canvas ref="canvas" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
</template>
