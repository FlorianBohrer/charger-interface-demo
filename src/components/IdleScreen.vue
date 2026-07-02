<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Nfc, ArrowRight } from "lucide-vue-next";
import { useChargerStore } from "../state/charger";
import { useTariff } from "../composables/useTariff";
import StationSchematic from "./StationSchematic.vue";
import type { ConnectorId } from "../sim/ocpp";

const store = useChargerStore();
const { connectors } = storeToRefs(store);

// Live-Börsenstrompreis (fällt auf Standardtarif zurück, wenn API/CORS blockt)
const { pricePerKwh, loading, isLive } = useTariff();

// Tap auf einen freien Anschluss startet den Auth-Flow.
// (selectConnector greift erst in Phase "selectConnector" – deshalb hier beginAuth)
function onSelect(_id: ConnectorId) {
  store.beginAuth();
}
</script>

<template>
  <section class="h-full grid grid-cols-[1fr_auto] items-center gap-14 px-14 py-10">

    <!-- linke Spalte: Willkommen + Karten-Hinweis + Start -->
    <div class="flex flex-col">
      <p class="text-hyc-accent text-xs font-semibold uppercase tracking-[0.28em] mb-3">
        Bereit zum Laden
      </p>
      <h1 class="font-display text-6xl font-medium leading-[1.03]">Willkommen.</h1>
      <p class="text-hyc-muted text-xl mt-4 max-w-md leading-relaxed">
        Freien Anschluss an der Säule antippen, Ladekarte auflegen oder QR-Code scannen.
      </p>

      <!-- Karten-Hinweis -->
      <div class="mt-8 inline-flex items-center gap-3 self-start rounded-2xl border border-hyc-line bg-hyc-surface px-5 py-4 animate-breathe">
        <Nfc :size="30" class="text-hyc-accent shrink-0" :stroke-width="1.6" />
        <span class="text-sm text-hyc-muted leading-tight">Karte an<br />Lesefeld halten</span>
      </div>

      <!-- Start-Button -->
      <button
        class="touch mt-8 w-full max-w-md rounded-2xl bg-hyc-accent text-hyc-bg font-display text-xl font-medium py-5
               flex items-center justify-center gap-2 outline-none transition-[filter,transform]
               hover:brightness-105 active:translate-y-px focus-visible:ring-2 focus-visible:ring-hyc-accent
               focus-visible:ring-offset-2 focus-visible:ring-offset-hyc-bg"
        @click="store.beginAuth()"
      >
        Laden starten <ArrowRight :size="22" :stroke-width="2.25" />
      </button>
    </div>

    <!-- rechte Spalte: die Ladesäule -->
    <StationSchematic
      :connectors="connectors"
      :price-per-kwh="pricePerKwh"
      :loading="loading"
      :is-live="isLive"
      @select="onSelect"
    />
  </section>
</template>
