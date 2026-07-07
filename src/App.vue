<script setup lang="ts">
/**
 * App-Gerüst: Geräterahmen, Kiosk-Skalierung, Phasen-Routing, Overlays, Taster.
 * Der Screen-Wechsel folgt store.phase; bis die erste BootNotification vom
 * MockCrowBackend eintrifft, bleibt phase "boot" und das Boot-Overlay ist sichtbar.
 */

 
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useChargerStore } from "./state/charger";
import { useUiStore } from "./state/ui";
import { useFitScale } from "./state/useFitScale";
import { useAnnouncer } from "./state/useAnnouncer";
import StatusBar from "./components/StatusBar.vue";
import PhysicalButtons from "./components/PhysicalButtons.vue";
import IdleScreen from "./components/IdleScreen.vue";
import ParticleField from "./components/ParticleField.vue";
import AuthScreen from "./components/AuthScreen.vue";
import SelectConnectorScreen from "./components/SelectConnectorScreen.vue";
import ChargeConfigScreen from "./components/ChargeConfigScreen.vue";
import ChargingScreen from "./components/ChargingScreen.vue";
import SummaryScreen from "./components/SummaryScreen.vue";
import HelpOverlay from "./components/HelpOverlay.vue";
import EmergencyOverlay from "./components/EmergencyOverlay.vue";

const store = useChargerStore();
const { phase } = storeToRefs(store);
const ui = useUiStore();
const { overlay } = storeToRefs(ui);

const DESIGN_W = 1180;
const DESIGN_H = 738;
const frame = ref<HTMLElement | null>(null);
const { scale } = useFitScale(frame, DESIGN_W, DESIGN_H);

useAnnouncer();
onMounted(() => store.connect());

const screen = computed(() => {
  switch (phase.value) {
    case "selectAuth":
    case "authorizing":
      return { key: "auth", comp: AuthScreen };
    case "selectConnector":
      return { key: "select", comp: SelectConnectorScreen };
    case "configure":
      return { key: "configure", comp: ChargeConfigScreen };
    case "charging":
    case "finishing":
      return { key: "charging", comp: ChargingScreen };
    case "summary":
      return { key: "summary", comp: SummaryScreen };
    default:
      return { key: "idle", comp: IdleScreen };
  }
});
</script>

<template>
  <div ref="frame" class="h-full w-full flex items-center justify-center bg-black overflow-hidden">
    <div
      class="relative rounded-[30px] overflow-hidden border-[7px] border-hyc-surface-2 ring-1 ring-black/60 shadow-2xl flex flex-col bg-hyc-bg shrink-0"
      :style="{
        width: DESIGN_W + 'px',
        height: DESIGN_H + 'px',
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }"
    >
      <StatusBar />

      <main class="flex-1 relative overflow-hidden">
        <!-- animiertes Energie-Partikelfeld hinter den Screens -->
        <ParticleField class="z-0" />

        <component :is="screen.comp" :key="screen.key" class="absolute inset-0 z-[1] fade-in" />

        <HelpOverlay v-if="overlay === 'help'" class="fade-in" />
        <EmergencyOverlay v-if="overlay === 'emergency'" class="fade-in" />

        <div
          v-if="phase === 'boot'"
          class="absolute inset-0 grid place-items-center bg-hyc-bg z-10 fade-in"
        >
          <div class="flex flex-col items-center gap-3">
            <span class="font-display text-2xl font-semibold tracking-tight">hypercharger</span>
            <span class="text-hyc-faint text-sm">System wird gestartet …</span>
          </div>
        </div>
      </main>

      <PhysicalButtons />
    </div>
  </div>
</template>
