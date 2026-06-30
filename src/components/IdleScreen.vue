<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Nfc, ArrowRight } from "lucide-vue-next";
import { useChargerStore } from "../state/charger";
import ConnectorBadge from "./ConnectorBadge.vue";

const store = useChargerStore();
const { connectors } = storeToRefs(store);
</script>

<template>
  <section class="h-full flex flex-col px-12 py-10">
    <!-- Kopf: Begrüßung + NFC-Affordanz -->
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

    <!-- Anschlüsse füllen den Raum mit echter Info -->
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

    <!-- CTA -->
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
</template>
