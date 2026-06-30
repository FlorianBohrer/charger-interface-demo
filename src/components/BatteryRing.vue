<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ soc: number; size?: number; label?: string; active?: boolean }>(),
  { size: 280, active: true },
);

const R = 130; // Radius
const CIRC = 2 * Math.PI * R; // Umfang
const offset = computed(() => CIRC * (1 - Math.min(100, props.soc) / 100));
</script>

<template>
  <div class="relative grid place-items-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg viewBox="0 0 300 300" class="-rotate-90 w-full h-full">
      <circle cx="150" cy="150" :r="R" fill="none" stroke="var(--color-hyc-surface-2)" stroke-width="16" />
      <circle
        cx="150" cy="150" :r="R" fill="none"
        :stroke="active ? 'var(--color-hyc-accent)' : 'var(--color-hyc-faint)'"
        stroke-width="16" stroke-linecap="round"
        :stroke-dasharray="CIRC" :stroke-dashoffset="offset"
        style="transition: stroke-dashoffset 0.4s ease"
      />
    </svg>
    <div class="absolute flex flex-col items-center">
      <div class="font-display text-6xl font-medium tnum leading-none">
        {{ Math.round(soc) }}<span class="text-2xl text-hyc-muted">%</span>
      </div>
      <div v-if="label" class="text-hyc-muted text-xs uppercase tracking-[0.18em] mt-2">{{ label }}</div>
    </div>
  </div>
</template>
