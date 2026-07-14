<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowLeft, ArrowRight, BatteryFull, Timer, Coins, Minus, Plus } from "lucide-vue-next";
import type { FunctionalComponent } from "vue";
import { useChargerStore } from "../state/charger";
import { formatEur } from "../state/format";
import type { ChargeLimit } from "../sim/ocpp";

const store = useChargerStore();
type Mode = ChargeLimit["mode"];

const mode = ref<Mode>("full");
const minutes = ref(30);
const eur = ref(20);

const modes: { id: Mode; icon: FunctionalComponent; title: string; sub: string }[] = [
  { id: "full",     icon: BatteryFull, title: "Voll laden", sub: "Bis 100 % oder bis du beendest" },
  { id: "duration", icon: Timer,       title: "Nach Dauer", sub: "Für eine feste Zeit laden" },
  { id: "price",    icon: Coins,       title: "Nach Preis", sub: "Bis zu einem festen Betrag" },
];

function step(delta: number) {
  if (mode.value === "duration") minutes.value = Math.min(180, Math.max(5, minutes.value + delta * 5));
  else eur.value = Math.min(100, Math.max(5, eur.value + delta * 5));
}

const limit = computed<ChargeLimit>(() => {
  if (mode.value === "duration") return { mode: "duration", minutes: minutes.value };
  if (mode.value === "price") return { mode: "price", eur: eur.value };
  return { mode: "full" };
});
</script>

<template>
  <section class="h-full flex flex-col px-12 py-9">
    <button class="touch self-start flex items-center gap-1.5 text-hyc-muted text-sm hover:text-hyc-text mb-6"
      @click="store.reset()">
      <ArrowLeft :size="16" :stroke-width="2" /> Abbrechen
    </button>

    <h2 class="font-display text-3xl font-medium">Ladeziel wählen</h2>
    <p class="text-hyc-muted mt-1">Wie soll geladen werden?</p>

    <div class="grid grid-cols-3 gap-4 mt-6">
      <button v-for="m in modes" :key="m.id"
        class="touch text-left rounded-2xl border p-5 flex flex-col items-start gap-3 outline-none transition-all
               active:translate-y-px focus-visible:ring-2 focus-visible:ring-hyc-accent"
        :class="mode === m.id ? 'border-hyc-accent bg-hyc-accent/10' : 'border-hyc-line bg-hyc-surface hover:border-hyc-accent/40'"
        @click="mode = m.id">
        <span class="grid place-items-center w-12 h-12 rounded-xl border"
          :class="mode === m.id ? 'border-hyc-accent/50 bg-hyc-accent/15' : 'border-hyc-line bg-hyc-bg/60'">
          <component :is="m.icon" :size="24" :stroke-width="1.8"
            :class="mode === m.id ? 'text-hyc-accent' : 'text-hyc-muted'" />
        </span>
        <div>
          <div class="font-display text-lg font-medium">{{ m.title }}</div>
          <div class="text-sm text-hyc-muted mt-0.5">{{ m.sub }}</div>
        </div>
      </button>
    </div>

    <div class="mt-5 min-h-28">
      <div v-if="mode !== 'full'"
        class="rounded-2xl border border-hyc-line bg-hyc-surface px-6 py-5 flex items-center justify-between fade-in">
        <div>
          <div class="text-hyc-muted text-xs uppercase tracking-[0.18em]">
            {{ mode === 'duration' ? 'Lade-Dauer' : 'Maximaler Preis' }}
          </div>
          <div class="font-display text-5xl font-medium tnum mt-1">
            <template v-if="mode === 'duration'">{{ minutes }}<span class="text-hyc-muted text-2xl ml-1">Min</span></template>
            <template v-else>{{ formatEur(eur) }}</template>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="touch grid place-items-center w-14 h-14 rounded-xl border border-hyc-line bg-hyc-bg/60 hover:border-hyc-accent/50 active:translate-y-px"
            @click="step(-1)"><Minus :size="22" :stroke-width="2" /></button>
          <button class="touch grid place-items-center w-14 h-14 rounded-xl border border-hyc-accent/40 bg-hyc-accent/15 hover:bg-hyc-accent/25 active:translate-y-px"
            @click="step(1)"><Plus :size="22" class="text-hyc-accent" :stroke-width="2" /></button>
        </div>
      </div>
    </div>

    <button
      class="touch mt-auto w-full rounded-2xl bg-hyc-accent text-hyc-bg font-display text-xl font-medium py-5
             flex items-center justify-center gap-2 hover:brightness-105 active:translate-y-px focus-visible:ring-2 focus-visible:ring-hyc-accent"
      @click="store.startCharging(limit)">
      Laden starten <ArrowRight :size="22" :stroke-width="2.25" />
    </button>
  </section>
</template>
