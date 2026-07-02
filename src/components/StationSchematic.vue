<script setup lang="ts">
import { Plug, AlertTriangle, Zap } from "lucide-vue-next";
import type { ConnectorId, ConnectorStatus, ConnectorType } from "../sim/ocpp";
import { formatEur } from "../state/format";

defineProps<{
  connectors: Record<ConnectorId, { type: ConnectorType; maxPowerKw: number; status: ConnectorStatus }>;
  pricePerKwh: number;
  loading?: boolean;
  isLive?: boolean;
}>();

const emit = defineEmits<{ (e: "select", id: ConnectorId): void }>();

const statusText: Record<ConnectorStatus, string> = {
  Available: "Frei",
  Preparing: "Verbinde",
  Charging: "Lädt",
  SuspendedEV: "Pausiert",
  Finishing: "Beendet",
  Faulted: "Störung",
};

// Farbe je Status: frei = grün, Störung = rot, sonst gedämpft
function tone(status: ConnectorStatus) {
  if (status === "Available") return "text-hyc-accent";
  if (status === "Faulted") return "text-hyc-danger";
  if (status === "Charging") return "text-hyc-warn";
  return "text-hyc-muted";
}
</script>

<template>
  <!-- Die Säule: schmal, hoch, wie ein Abbild des echten Chargers -->
  <div class="w-[340px] rounded-[2.25rem] border border-hyc-line bg-hyc-surface/60 overflow-hidden shadow-2xl shadow-black/40">

    <!-- Kopf: Marke + Live-Strompreis -->
    <div class="px-7 pt-6 pb-5 border-b border-hyc-line bg-hyc-surface-2/40">
      <div class="flex items-center gap-2">
        <span class="grid place-items-center w-9 h-9 rounded-xl bg-hyc-accent/15">
          <Zap :size="20" class="text-hyc-accent" :stroke-width="2.25" />
        </span>
        <span class="font-display text-lg font-medium tracking-tight">hypercharger</span>
      </div>

      <!-- Strompreis-Zeile -->
      <div class="mt-4 flex items-end justify-between">
        <span class="text-hyc-muted text-[11px] uppercase tracking-[0.18em]">
          Strompreis · Börse
        </span>
        <span class="font-display text-2xl font-medium tnum text-hyc-text">
          <template v-if="loading">– –</template>
          <template v-else>{{ formatEur(pricePerKwh) }}<span class="text-sm text-hyc-muted">/kWh</span></template>
        </span>
      </div>
      <div class="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider"
           :class="isLive ? 'text-hyc-accent' : 'text-hyc-faint'">
        <span class="w-1.5 h-1.5 rounded-full" :class="isLive ? 'bg-hyc-accent animate-breathe' : 'bg-hyc-faint'"></span>
        {{ isLive ? "Live · Day-Ahead" : "Standardtarif" }}
      </div>
    </div>

    <!-- Anschluss-Docks (die klickbaren Zonen) -->
    <button
      v-for="(c, id) in connectors"
      :key="id"
      class="touch w-full flex items-center justify-between gap-4 px-7 py-7 text-left
             border-b border-hyc-line last:border-b-0 outline-none transition-all duration-200
             disabled:opacity-40 disabled:cursor-not-allowed
             enabled:hover:bg-hyc-surface enabled:focus-visible:ring-2 enabled:focus-visible:ring-hyc-accent enabled:focus-visible:ring-inset
             enabled:active:translate-y-px"
      :disabled="c.status !== 'Available'"
      @click="c.status === 'Available' && emit('select', id)"
    >
      <!-- links: Icon + Bezeichnung -->
      <div class="flex items-center gap-4">
        <span class="grid place-items-center w-14 h-14 rounded-2xl border border-hyc-line bg-hyc-bg/50 shrink-0">
          <component
            :is="c.status === 'Faulted' ? AlertTriangle : Plug"
            :size="26"
            :stroke-width="1.9"
            :class="tone(c.status)"
          />
        </span>
        <div>
          <div class="font-display text-xl font-medium">Anschluss {{ id }}</div>
          <div class="text-hyc-muted text-[11px] uppercase tracking-widest font-semibold">
            DC · {{ c.type }}
          </div>
        </div>
      </div>

      <!-- rechts: kW + Status -->
      <div class="flex flex-col items-end gap-1.5">
        <div class="font-display text-2xl font-medium tracking-tight">
          <span class="tnum">{{ c.maxPowerKw }}</span>
          <span class="text-hyc-muted text-sm font-normal ml-1">kW</span>
        </div>
        <div class="flex items-center gap-2" :class="tone(c.status)">
          <span class="w-2 h-2 rounded-full bg-current"
                :class="c.status === 'Available' ? 'animate-breathe' : ''"></span>
          <span class="text-sm font-medium tracking-wide">{{ statusText[c.status] }}</span>
        </div>
      </div>
    </button>
  </div>
</template>
