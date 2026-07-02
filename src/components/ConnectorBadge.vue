<script setup lang="ts">
import { computed } from "vue";
import { Plug, AlertTriangle } from "lucide-vue-next";
import type { ConnectorId, ConnectorStatus, ConnectorType } from "../sim/ocpp";

const props = defineProps<{
  id: ConnectorId;
  type: ConnectorType;
  maxPowerKw: number;
  status: ConnectorStatus;
  selectable?: boolean;
}>();

const emit = defineEmits<{
  (e: "select", id: ConnectorId): void
}>();

const statusText: Record<ConnectorStatus, string> = {
  Available: "Frei",
  Preparing: "Verbinde",
  Charging: "Lädt",
  SuspendedEV: "Pausiert",
  Finishing: "Beendet",
  Faulted: "Störung",
};

const disabled = computed(() => props.selectable && props.status !== "Available");
</script>

<template>
  <div class="p-0.5 bg-hyc-surface/30 rounded-2xl">
    <button 
      class="group touch w-full rounded-2xl border p-6 transition-all duration-200 outline-none disabled:opacity-40" 
      :class="selectable && !disabled
        ? 'border-hyc-line bg-hyc-surface/80 hover:border-hyc-accent/40 hover:bg-hyc-surface focus-visible:ring-2 focus-visible:ring-hyc-accent active:translate-y-0'
        : 'border-hyc-line-soft bg-hyc-surface/40'" 
      :disabled="disabled" 
      @click="selectable && !disabled && emit('select', id)"
    >
      <!-- Flex-Container splittet die Zeile in Links (Info) und Rechts (Power/Status) -->
      <div class="flex items-center justify-between w-full">
        
        <!-- LINKER BEREICH: Icon und Typenbezeichnung -->
        <div class="flex items-center gap-5 text-left">
          
          <!-- Abgerundetes Quadrat-Icon statt Kreis (Exakt wie auf dem Foto) -->
          <div 
            class="grid place-items-center w-16 h-16 rounded-2xl border border-hyc-line bg-hyc-bg/50 transition-all group-hover:border-hyc-accent/30 shrink-0"
          > 
            <component 
              :is="status === 'Faulted' ? AlertTriangle : Plug" 
              :size="26" 
              :stroke-width="1.75"
              :class="status === 'Faulted' ? 'text-hyc-danger' : 'text-hyc-accent'" 
            />
          </div>

          <!-- Text-Stack (Anschlussname + Subtitle) -->
          <div class="flex flex-col gap-0.5">
            <div class="font-display text-2xl font-medium text-white group-hover:text-hyc-accent transition-colors">
              Anschluss {{ id }}
            </div>
            <div class="text-hyc-muted text-xs uppercase tracking-widest font-semibold">
              DC · {{ type }}
            </div>
          </div>
        </div>

        <!-- RECHTER BEREICH: Leistung & Status-Punkt -->
        <div class="flex flex-col items-end text-right gap-1.5">
          
          <!-- kW Leistung -->
          <div class="font-display text-3xl font-medium text-white tracking-tight">
            <span class="tnum">{{ maxPowerKw }}</span>
            <span class="text-hyc-muted text-base font-normal ml-1">kW</span>
          </div>
          
          <!-- Status-Indikator mit farbigem Punkt (Dot) -->
          <div class="flex items-center gap-2">
            <span 
              class="text-xs transition-colors"
              :class="status === 'Available' ? 'text-hyc-accent' : status === 'Faulted' ? 'text-hyc-danger' : 'text-hyc-muted'"
            >
              ●
            </span>
            <span 
              class="text-sm font-medium tracking-wide"
              :class="status === 'Available' ? 'text-hyc-accent' : status === 'Faulted' ? 'text-hyc-danger' : 'text-hyc-text/80'"
            >
              {{ statusText[status] }}
            </span>
          </div>

        </div>
        
      </div>
    </button>
  </div>
</template>