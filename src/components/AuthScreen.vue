<script setup lang="ts">

import { storeToRefs } from "pinia";
import { CreditCard, QrCode, Smartphone, ArrowLeft, Loader2 } from "lucide-vue-next";
import type { FunctionalComponent } from "vue";
import { useChargerStore } from "../state/charger";
import type { AuthMethod } from "../sim/ocpp";
import QRScan from "./QRScan.vue";

const store = useChargerStore();
const { phase, authMethod } = storeToRefs(store);

const methods: { id: AuthMethod; icon: FunctionalComponent; title: string; sub: string }[] = [
  { id: "RFID", icon: CreditCard,  title: "Ladekarte",          sub: "Karte auf das Lesefeld legen" },
  { id: "QR",   icon: QrCode,      title: "QR-Code",            sub: "Mit der App scannen" },
  { id: "App",  icon: Smartphone,  title: "App / Plug & Charge", sub: "Automatisch erkennen" },
];
</script>



<template>
    <section class="h-full flex flex-col px-12 py-10">

      <QRScan v-if="phase === 'authorizing' && authMethod === 'QR'" :success="false"/>
        <template v-else>



          <button
            class="touch self-start flex items-center gap-1.5 text-hyc-muted text-sm
                    hover:text-hyc-text transition-colors mb-8"
                    @click="store.cancelAuth()"       
          >
          <ArrowLeft :size="16" :stroke-width="2"/> Zurück
        </button>
        <h2 class=" font-display text-3xl font-medium">Authentifizierung</h2>
        <p class="text-hyc-muted mt-1"> Wähle deine bevorzugte Methode</p>

        <div class="grid grid-cols-3 gap-4 mt-8">
         

              <button
                v-for="(m, i) in methods"
                :key="m.id"
                class="group touch tex-left rounded-2xl border border-hyc-line-sun bg-hyc-surface p-6 flex flex-col items-start gap-3
                      outline-none transition-all duration-200
                      hover:border-hyc-accent/50 hover:bg-hyc-surface-2 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30
                      active:translate-y-0 focus-visible:ring-2 focus-visible:ring-hyc-accent disabled:opacity-40 fade-in"
                :style="{ animationDelay: i * 70 + 'ms' }"
                :class="authMethod === m.id && phase === 'authorizing' ? 'border-hyc-accent/60' : ''"
                :disabled="phase === 'authorizing'"
                @click="store.authorize(m.id)"
              >
                  <!-- <span class="grid place-items-center w-12 h-12 rounded-xl border border-hyc-line bg-hyc-bg/60
                              transition-colors group-hover:border-hyc-accent/40 group-hover:bg-hyc-accent/10">
                    <component :is="m.icon" :size="24" :stroke-width="1.6"
                      class="text-hyc-accent transition-transform group-hover:scale-110" />
                  </span>
                    <div>
                      <div class="font-display text-lg font-medium text-left ">{{ m.title }}</div>
                      <div class="text-sm text-hyc-muted mt-0.5">{{ m.sub }}</div>
                    </div> -->

                    <!-- kästchen größer -->
                  <span class="grid place-items-center w-16 h-16 rounded-2xl border border-hyc-line bg-hyc-bg/60 ...">
                    <!-- icon größer + kräftiger strich -->
                    <component :is="m.icon" :size="54" :stroke-width="2"
                      class="text-hyc-accent transition-transform group-hover:scale-105" />
                  </span>
                  <div>
                    <!-- titel größer -->
                      <div class="font-display text-2xl text-left font-medium">{{ m.title }}</div>
                      <!-- untertitel weniger blass (muted evtl in sonne schlecht erkennbar) -->
                      <div class="text-base text-hyc-text/70 mt-1">{{ m.sub }}</div>
                  </div>
              </button>
        </div>

        <div v-if="phase === 'authorizing'" class="mt-auto flex 
        items-center justify-center gap-2.5 text-hyc-accent">

          <Loader2 :size="18" class="animate-spin" :stroke-width="2.25" />
          <span class="text-sm">Authorisierung läuft ...</span>
        </div>

  </template>

  </section>
</template>
