<script setup lang="ts">
import { computed } from "vue";
import { Plug, PlugZap, AlertTriangle } from "lucide-vue-next";
import type { ConnectorId, ConnectorStatus, ConnectorType } from "../sim/ocpp";

const props = defineProps<{
  id: ConnectorId;
  type: ConnectorType;
  maxPowerKw: number;
  status: ConnectorStatus;
  selectable?: boolean;
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

const disabled = computed(() => props.selectable && props.status !== "Available");
</script>

<template>
  <button
    class="group touch text-left w-full rounded-2xl border p-6 transition-all duration-200 outline-none disabled:opacity-40"
    :class="selectable && !disabled
      ? 'border-hyc-line bg-hyc-surface hover:border-hyc-accent/50 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-hyc-accent active:translate-y-0'
      : 'border-hyc-line-soft bg-hyc-surface'"
    :disabled="disabled"
    @click="selectable && !disabled && emit('select', id)"
  >
    <div class="flex items-start justify-between">
      <span class="grid place-items-center w-16 h-16 rounded-2xl border border-hyc-line bg-hyc-bg/60">
        <component :is="status === 'Charging' ? PlugZap : Plug" :size="32" :stroke-width="2"
          :class="status === 'Faulted' ? 'text-hyc-danger' : 'text-hyc-accent'" />
      </span>
      <span class="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-hyc-line text-hyc-text/80">
        <AlertTriangle v-if="status === 'Faulted'" :size="14" class="text-hyc-danger" />
        {{ statusText[status] }}
      </span>
    </div>

    <div class="mt-5">
      <div class="font-display text-2xl font-medium">Anschluss {{ id }}</div>
      <div class="text-hyc-muted">{{ type }}</div>
      <div class="flex items-baseline gap-1 font-display mt-3">
        <span class="text-3xl font-medium tnum">{{ maxPowerKw }}</span>
        <span class="text-hyc-muted text-sm">kW max</span>
      </div>
      <div class="h-1.5 rounded-full mt-4"
        :class="status === 'Available' ? 'bg-hyc-accent' : status === 'Faulted' ? 'bg-hyc-danger' : 'bg-hyc-line'"></div>
    </div>
  </button>
</template>