<script setup lang="ts">
import { Zap, Wifi } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useChargerStore } from "../state/charger";
import { useClock } from "../state/useClock";
import { formatClock } from "../state/format";

const store = useChargerStore();
const { connectors } = storeToRefs(store);
const { now } = useClock();
</script>

<template>
  <header class="flex items-center justify-between px-7 h-15 border-b border-hyc-line-soft bg-hyc-surface/40">

    <!-- links: Logo + Marke -->
    <div class="flex items-center gap-2.5">
      <span class="grid place-items-center w-7 h-7 rounded-lg bg-hyc-accent text-hyc-bg">
        <Zap :size="16" fill="currentColor" :stroke-width="0" />
      </span>
      <span class="font-display font-semibold tracking-tight text-[15px]">hypercharger</span>
    </div>

    <!-- rechts: Status + WLAN + Uhr -->
    <div class="flex items-center gap-5 text-sm">
      <div class="flex items-center gap-3 text-hyc-muted">
        <span v-for="(c, id) in connectors" :key="id" class="flex items-center gap-1.5 text-xs">
          <span class="w-1.5 h-1.5 rounded-full"
            :style="{ background: c.status === 'Faulted' ? 'var(--color-hyc-danger)' : 'var(--color-hyc-accent)' }"></span>
          {{ id }}
        </span>
      </div>
      <Wifi :size="16" class="text-hyc-muted" :stroke-width="1.75" />
      <span class="font-display tnum text-hyc-text font-medium">{{ formatClock(now) }}</span>
    </div>

  </header>
</template>