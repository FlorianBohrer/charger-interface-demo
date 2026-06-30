<script setup lang="ts">
import { storeToRefs } from "pinia";
import { CreditCard, QrCode, Smartphone, ArrowLeft, Loader2, ChevronRight } from "lucide-vue-next";
import type { FunctionalComponent } from "vue";
import { useChargerStore } from "../state/charger";
import type { AuthMethod } from "../sim/ocpp";
import QrScan from "./QrScan.vue";

const store = useChargerStore();
const { phase, authMethod, authorized } = storeToRefs(store);

const methods: {
  id: AuthMethod;
  icon: FunctionalComponent;
  title: string;
  sub: string;
  recommended?: boolean;
}[] = [
  { id: "RFID", icon: CreditCard, title: "Ladekarte", sub: "Karte auf das Lesefeld legen", recommended: true },
  { id: "QR", icon: QrCode, title: "QR-Code", sub: "Mit der App scannen" },
  { id: "App", icon: Smartphone, title: "App / Plug & Charge", sub: "Automatisch erkennen" },
];
</script>

<template>
  <section class="h-full flex flex-col px-12 py-10">

    <!-- QR übernimmt den Screen während der Autorisierung -->
    <QrScan v-if="phase === 'authorizing' && authMethod === 'QR'" :success="authorized" />

    <template v-else>
      <button
        class="touch self-start flex items-center gap-1.5 text-hyc-muted text-sm hover:text-hyc-text transition-colors mb-8"
        @click="store.cancelAuth()"
      >
        <ArrowLeft :size="16" :stroke-width="2" /> Zurück
      </button>

      <h2 class="font-display text-3xl font-medium">Authentifizierung</h2>
      <p class="text-hyc-muted mt-1">Wähle deine bevorzugte Methode</p>

      <div class="grid grid-cols-3 gap-4 mt-8">
        <button
          v-for="(m, i) in methods"
          :key="m.id"
          class="group relative touch text-left rounded-2xl border border-hyc-line bg-hyc-surface p-6
                 flex flex-col items-start gap-4 outline-none transition-all duration-200 fade-in
                 hover:border-hyc-accent/50 hover:bg-hyc-surface-2 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30
                 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-hyc-accent disabled:opacity-40"
          :style="{ animationDelay: i * 70 + 'ms' }"
          :class="authMethod === m.id && phase === 'authorizing' ? 'border-hyc-accent/60' : ''"
          :disabled="phase === 'authorizing'"
          @click="store.authorize(m.id)"
        >
          <!-- Empfehlung -->
          <span
            v-if="m.recommended"
            class="absolute top-3 right-3 text-[11px] font-semibold uppercase tracking-wider
                   text-hyc-accent border border-hyc-accent/30 bg-hyc-accent/10 rounded-full px-2.5 py-1"
          >Empfohlen</span>

          <!-- Icon-Kästchen, leuchtet bei Hover auf -->
          <span
            class="grid place-items-center w-16 h-16 rounded-2xl border border-hyc-line bg-hyc-bg/60
                   transition-all group-hover:border-hyc-accent/50 group-hover:bg-hyc-accent/10"
          >
            <component :is="m.icon" :size="34" :stroke-width="2"
              class="text-hyc-accent transition-transform group-hover:scale-110" />
          </span>

          <div class="flex-1">
            <div class="font-display text-2xl font-medium">{{ m.title }}</div>
            <div class="text-base text-hyc-text/70 mt-1">{{ m.sub }}</div>
          </div>

          <!-- "Wählen →" gleitet bei Hover ein -->
          <div
            class="flex items-center gap-1.5 text-hyc-accent text-sm font-medium
                   opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
          >
            Wählen <ChevronRight :size="18" :stroke-width="2.25" />
          </div>
        </button>
      </div>

      <div v-if="phase === 'authorizing'" class="mt-auto flex items-center justify-center gap-2.5 text-hyc-accent">
        <Loader2 :size="18" class="animate-spin" :stroke-width="2.25" />
        <span class="text-sm">Autorisierung läuft …</span>
      </div>
    </template>

  </section>
</template>
