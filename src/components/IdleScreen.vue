<!-- 




<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Nfc, ArrowRight, QrCode, KeyRound } from "lucide-vue-next";
import { useChargerStore } from "../state/charger";
import ConnectorBadge from "./ConnectorBadge.vue";

const store = useChargerStore();
const { connectors } = storeToRefs(store);
</script>

<template>
    <section class="flex flex-col justify-between px-16 py-14 bg-hyc-bg select-none">
    
        <header class="flex items-start justify-between gap-12 w-full">
            <div class="space-y-4 max-w-2xl">
                <p class="text-hyc-accent text-sm font-bold uppercase tracking-[0.3em]">
                    Ready to Charge · Bereit zum Laden
                </p>
                <h1 class="font-display text-6xl font-semibold tracking-tight text-hyc-text leading-none">
                    Willkommen.
                </h1>
                <p class="text-hyc-muted text-xl font-normal leading-relaxed">
                    Bitte Ladekarte an das Lesefeld halten oder einen freien Anschluss auf dem Bildschirm auswählen.
                </p>
            </div>
    
            <div class="flex flex-col items-center justify-center text-center gap-4 rounded-3xl border-2 border-hyc-accent bg-hyc-surface/40 p-8 min-w-[240px] shadow-lg shadow-hyc-accent/5 animate-breathe">
                <div class="grid place-items-center w-16 h-16 rounded-2xl bg-hyc-accent/10">
                    <Nfc :size="40" class="text-hyc-accent" :stroke-width="2" />
                </div>
                <span class="text-sm font-bold text-hyc-text uppercase tracking-wider leading-tight">
                  Ladekarte<br />hier anlegen
                </span>
            </div>
        </header>

    
  
        <section class="w-full ">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ConnectorBadge v-for="(c, id) in connectors" :key="id" :id="id" :type="c.type" :max-power-kw="c.maxPowerKw" :status="c.status" selectable class="shadow-sm" />
            </div>
        </section>
    
      
    
    </section>
</template> -->



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
</template>