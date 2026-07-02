<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ soc: number; maxPowerKw?: number; active?: boolean }>(),
  { maxPowerKw: 400, active: true },
);

// Plot-Geometrie
const W = 460;
const H = 210;
const PAD = 26;
const plotW = W - PAD * 2;
const plotH = H - PAD * 2;

// dieselbe Ladekurve wie im Backend (Tapering): voll bis 55 %, dann fallend
function powerAt(soc: number): number {
  const cap = props.maxPowerKw;
  if (soc < 55) return cap;
  if (soc < 80) return cap * (1 - (soc - 55) / 55);
  return Math.max(8, cap * 0.18 * (1 - (soc - 80) / 40));
}

const cx = (soc: number) => PAD + (Math.min(100, Math.max(0, soc)) / 100) * plotW;
const cy = (kw: number) => PAD + plotH - (kw / props.maxPowerKw) * plotH;

// Stützpunkte 0..100 für die volle (blasse) Kurve
const samples = Array.from({ length: 51 }, (_, i) => i * 2);
const toPath = (pts: number[]) =>
  pts.map((s, i) => `${i ? "L" : "M"}${cx(s).toFixed(1)} ${cy(powerAt(s)).toFixed(1)}`).join(" ");

const fullPath = computed(() => toPath(samples));

// zurückgelegter Teil bis zum aktuellen SoC (+ exakter Endpunkt)
const done = computed(() => {
  const pts = samples.filter((s) => s <= props.soc);
  pts.push(Math.min(100, Math.max(0, props.soc)));
  return pts;
});
const donePath = computed(() => toPath(done.value));
const areaPath = computed(() => {
  const pts = done.value;
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${donePath.value} L${cx(last).toFixed(1)} ${(PAD + plotH).toFixed(1)} L${cx(first).toFixed(1)} ${(PAD + plotH).toFixed(1)} Z`;
});

const dotX = computed(() => cx(props.soc));
const dotY = computed(() => cy(powerAt(props.soc)));
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="w-full">
    <defs>
      <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-hyc-accent)" stop-opacity="0.35" />
        <stop offset="100%" stop-color="var(--color-hyc-accent)" stop-opacity="0" />
      </linearGradient>
      <filter id="curveGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <!-- Grundlinie + Tapering-Marker bei 55 % -->
    <line :x1="cx(0)" :y1="PAD + plotH" :x2="cx(100)" :y2="PAD + plotH"
      stroke="var(--color-hyc-line)" stroke-width="1" />
    <line :x1="cx(55)" :y1="PAD" :x2="cx(55)" :y2="PAD + plotH"
      stroke="var(--color-hyc-line)" stroke-width="1" stroke-dasharray="3 5" opacity="0.6" />

    <!-- volle Kurve als blasse Leitlinie -->
    <path :d="fullPath" fill="none" stroke="var(--color-hyc-line)" stroke-width="2" />

    <!-- gefüllte Fläche bis SoC -->
    <path :d="areaPath" fill="url(#curveFill)" />

    <!-- zurückgelegte Kurve, leuchtend -->
    <path :d="donePath" fill="none" stroke="var(--color-hyc-accent)" stroke-width="3"
      stroke-linecap="round" filter="url(#curveGlow)" />

    <!-- aktueller Punkt: Puls-Ring + Kern -->
    <circle :cx="dotX" :cy="dotY" r="11" fill="var(--color-hyc-accent)" opacity="0.25"
      :class="active ? 'animate-breathe' : ''"
      style="transition: cx 0.3s linear, cy 0.3s linear" />
    <circle :cx="dotX" :cy="dotY" r="5" fill="var(--color-hyc-accent)"
      style="transition: cx 0.3s linear, cy 0.3s linear" />

    <!-- Achsen-Labels -->
    <text :x="cx(0)" :y="H - 5" fill="var(--color-hyc-faint)" font-size="11">0%</text>
    <text :x="cx(50)" :y="H - 5" fill="var(--color-hyc-faint)" font-size="11" text-anchor="middle">SoC</text>
    <text :x="cx(100)" :y="H - 5" fill="var(--color-hyc-faint)" font-size="11" text-anchor="end">100%</text>
  </svg>
</template>
