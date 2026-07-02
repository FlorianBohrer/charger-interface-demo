<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Gauge, Clock, Zap, Receipt, Square, Target } from "lucide-vue-next"; // Target statt BoltIcon
import { computed } from "vue";
import { useChargerStore } from "../state/charger";
import { formatDuration, formatEur } from "../state/format";
import BatteryRing from "./BatteryRing.vue";

const store = useChargerStore();
const { meter, phase, limit } = storeToRefs(store); // <- die echten Live-Daten
const targetText = computed(() => {
  const l = limit.value;
  if(l.mode === "duration") return `${l.minutes} min`;
  if(l.mode === "price") return formatEur(l.eur);
  return "Voll laden";
})
</script>

<template>
  <section class="h-full flex flex-col px-12 py-8">
    <!-- ============ ZONE 2: Hauptbereich ============ -->
    <div class="flex-1 grid grid-cols-[auto_1fr] items-center gap-12 mt-2">

      <!-- links: der Ring -->
      <BatteryRing :soc="meter?.soc ?? 0" :active="phase === 'charging'" label="State of Charge" />

      <!-- rechts: Hero-Card + Info-Grid -->
      <div class="flex flex-col gap-4">

        <!-- Hero: Leistung (kW) + Energie (kWh) -->
        <div class="rounded-xl border border-hyc-line bg-hyc-surface px-6 py-5">
          <div class="flex items-center gap-2 text-hyc-muted">
            <Gauge :size="16" /><span class="text-xs uppercase tracking-[0.18em]">Leistung</span>
          </div>
          <div class="bg-hyc-surface  items-baseline gap-2 mt-1">
            <span class="font-display text-6xl font-medium tnum text-hyc-accent">{{ meter?.powerKw ?? 0 }}</span>
            <span class="text-2xl text-hyc-muted">kW</span>
            <!-- <span class="ml-auto font-display text-2xl tnum">
              {{ (meter?.energyKwh ?? 0).toFixed(1) }} <span class="text-base text-hyc-muted">kWh</span>
            </span> -->
          </div>
        </div>

        <!-- Info-Grid mit Dauer · Strom · Spannung · Kosten -->
        <div class="grid grid-cols-2 rounded-xl border   border-hyc-accent bg-hyc-surface">
          <div class="  px-4 py-3">
            <div class="text-hyc-muted text-[11px] uppercase tracking-wider flex items-center gap-1"><Clock :size="13" /> Dauer</div>
            <div class="font-display text-xl tnum mt-1">{{ formatDuration(meter?.durationS ?? 0) }}</div>
          </div>
          <div class="  px-4 py-3">
            <div class="text-hyc-muted text-[11px] uppercase tracking-wider flex items-center gap-1"><Zap :size="13" /> Strom</div>
            <div class="font-display text-xl tnum mt-1">{{ meter?.current ?? 0 }} A</div>
          </div>
          <div class="  px-4 py-3">
            <div class="text-hyc-muted text-[8px] uppercase tracking-wider flex items-center gap-1"><Zap :size="13" /> Spannung</div>
            <div class="font-display text-l tnum mt-1">{{ meter?.voltage ?? 0 }} V</div>
          </div>
          <div class=" px-4 py-3">
            <div class="text-hyc-muted text-[8px] uppercase tracking-wider flex items-center gap-1"><Receipt :size="13" /> Kosten</div>
            <div class="font-display text-l tnum mt-1">{{ formatEur(meter?.costEur ?? 0) }}</div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

