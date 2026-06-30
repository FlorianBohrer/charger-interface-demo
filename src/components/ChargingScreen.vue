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

      <div class="px-5 py-2.5 m-3 flex self-end text-right border rounded-4xl text-hyc-accent-2 bg-hyc-accent/10 hyc-accent/30 text-hyc-accenr
">
      <!-- ziel -->
       <div v-if="limit.mode !== 'full'"
  class="self-end m-3 flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-hyc-accent/30 bg-hyc-accent/10 text-hyc-accent">
  <Target :size="22" :stroke-width="2" class="shrink-0" />
  <span>Ziel: <span class="text-xl font-semibold">{{ targetText }}</span></span>
</div>

     
      <!-- ausgewählter Anschluss -->

    </div>

    <!-- ============ ZONE 1: Status-Zeile (FERTIG) ============ -->
    <div class="flex items-center gap-2 text-hyc-accent">
      <span
        class="w-2 h-2 rounded-full bg-hyc-accent"
        :class="phase === 'charging' ? 'animate-breathe' : ''"
      ></span>
      <span class="text-xs uppercase tracking-[0.22em]">
        {{ phase === 'finishing' ? 'Wird beendet' : 'Ladevorgang aktiv' }}
      </span>
    </div>

    <!-- ============ ZONE 2: Hauptbereich  ============ -->
    <!-- Tipp: <div class="flex-1 grid grid-cols-[auto_1fr] items-center gap-12 mt-2"> -->
    <!--   links:  <BatteryRing :soc="meter?.soc ?? 0" :active="phase === 'charging'" :label="'State of Charge'" /> -->
    <!--   rechts (flex flex-col gap-4): -->
    <!--     - Hero-Card: Leistung GROSS  {{ meter?.powerKw ?? 0 }} kW   + kWh  {{ (meter?.energyKwh ?? 0).toFixed(1) }} -->
    <!--     - Info-Grid (grid grid-cols-2 gap-3): -->
    <!--         Dauer    {{ formatDuration(meter?.durationS ?? 0) }} -->
    <!--         Strom    {{ meter?.current ?? 0 }} A -->
    <!--         Spannung {{ meter?.voltage ?? 0 }} V -->
    <!--         Kosten   {{ formatEur(meter?.costEur ?? 0) }} -->

    <!-- ============ ZONE 3: Laden beenden  ============ -->
    <!-- <button class="touch self-center ..." :disabled="phase !== 'charging'" @click="store.stop()"> -->
    <!--   <Square :size="16" fill="currentColor" :stroke-width="0" /> Laden beenden -->
    <!-- </button> -->

  </section>
</template>
