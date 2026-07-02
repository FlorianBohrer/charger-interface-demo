<!-- <script setup lang="ts">
import { storeToRefs } from "pinia";
import { Nfc, ArrowRight } from "lucide-vue-next";
import { useChargerStore } from "../state/charger";
import ConnectorBadge from "./ConnectorBadge.vue";

const store = useChargerStore();
const { connectors } = storeToRefs(store);
</script>

<template>
  <section class="h-full flex flex-col px-12 py-10">
  
    <div class="flex items-start justify-between">
      <div>
        <p class="text-hyc-accent text-xs font-semibold uppercase tracking-[0.28em] mb-3">
          Bereit zum Laden
        </p>
        <h1 class="font-display text-5xl font-medium leading-[1.05]">Willkommen.</h1>
        <p class="text-hyc-muted text-lg mt-3 max-w-sm">
          Ladekarte auflegen oder QR-Code scannen, um zu starten.
        </p>
      </div>

      <div class="flex items-center gap-3 rounded-2xl border border-hyc-line bg-hyc-surface px-5 py-4 animate-breathe">
        <Nfc :size="30" class="text-hyc-accent shrink-0" :stroke-width="1.6" />
        <span class="text-sm text-hyc-muted leading-tight">Karte an<br />Lesefeld</span>
      </div>
    </div>


    <div class="grid grid-cols-2 gap-4 mt-auto">
      <ConnectorBadge
        v-for="(c, id) in connectors"
        :key="id"
        :id="id"
        :type="c.type"
        :max-power-kw="c.maxPowerKw"
        :status="c.status"
      />
    </div>

   
    <button
      class="touch mt-6 w-full rounded-2xl bg-hyc-accent text-hyc-bg font-display text-xl font-medium py-5
             flex items-center justify-center gap-2 outline-none transition-[filter,transform]
             hover:brightness-105 active:translate-y-px focus-visible:ring-2 focus-visible:ring-hyc-accent
             focus-visible:ring-offset-2 focus-visible:ring-offset-hyc-bg"
      @click="store.beginAuth()"
    >
      Laden starten <ArrowRight :size="22" :stroke-width="2.25" />
    </button>
  </section>
</template> -->



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