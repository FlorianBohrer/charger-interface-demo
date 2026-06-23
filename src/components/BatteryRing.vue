<script setup lang="ts">
/**
 * TODO — SVG-ring, der den SoC als kreisbogen zeigt (+ prznt zahl mittig).
 * : stroke-dasharray = umfang, stroke-dashoffset = umfang * (1 - soc/100).
 * Optional: tick-Skala, lade-Bolt (lucide "Zap"), gradient-Stroke.
 */
withDefaults(
  defineProps<{ soc: number; size?: number; label?: string; active?: boolean }>(),
  { size: 300, active: true },
);
</script>

<template>
  <div class="todo">TODO · BatteryRing (SoC-Ring)</div>
</template>
