<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Nfc, ArrowRight, QrCode, KeyRound } from "lucide-vue-next";
import { useChargerStore } from "../state/charger";
import ConnectorBadge from "./ConnectorBadge copy.vue";

const store = useChargerStore();
const { connectors } = storeToRefs(store);
</script>

<template>
    <!-- h-screen genutzt für Kiosk-Displays, um die volle Höhe zu garantieren -->
    <section class="h-screen flex flex-col justify-between px-16 py-14 bg-hyc-bg select-none">
    
        <!-- 1. Header: Hero-Bereich (Auch aus 2-3 Metern Entfernung sofort lesbar) -->
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
    
            <!-- Massiver NFC-Teaser (Visualisiert die physische Interaktion am Gehäuse) -->
            <div class="flex flex-col items-center justify-center text-center gap-4 rounded-3xl border-2 border-hyc-accent bg-hyc-surface/40 p-8 min-w-[240px] shadow-lg shadow-hyc-accent/5 animate-breathe">
                <div class="grid place-items-center w-16 h-16 rounded-2xl bg-hyc-accent/10">
                    <Nfc :size="40" class="text-hyc-accent" :stroke-width="2" />
                </div>
                <span class="text-sm font-bold text-hyc-text uppercase tracking-wider leading-tight">
                      Ladekarte<br />hier anlegen
                    </span>
            </div>
        </header>
    
        <!-- 2. REIN-INTERAKTIVE ZONE: Die Anschlüsse (Zentral platziert auf perfekter Greifhöhe) -->
        <main class="w-full ">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ConnectorBadge v-for="(c, id) in connectors" :key="id" :id="id" :type="c.type" :max-power-kw="c.maxPowerKw" :status="c.status" selectable class="shadow-sm" />
            </div>
        </main>
    
        <!-- 3. FUSSZEILE: Alternative Aktionen (Große Buttons, um Frustration bei Fehlern zu vermeiden) -->
        <!-- <footer class="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto mt-auto"> -->
    
        <!-- Split-Layout für die beiden alternativen Wege -->
        <!-- <div class="grid grid-cols-2 gap-6 w-full"> -->
    
        <!-- QR-Code / App-Weg
                    <button class="group flex items-center justify-center gap-4 rounded-2xl bg-hyc-accent px-8 py-6 text-xl font-bold text-hyc-bg transition-all duration-200 hover:brightness-110 active:scale-[0.98]">
                      <QrCode :size="26" :stroke-width="2.2" />
                      <span>QR-Code scannen</span>
                      <ArrowRight :size="22" class="transition-transform group-hover:translate-x-1" :stroke-width="2.5" />
                    </button> -->
    
        <!-- PIN-Eingabe (z.B. für Flotten/Gutscheine) -->
                  <!--<button class="flex items-center justify-center gap-4 rounded-2xl border-2 border-hyc-line bg-hyc-surface px-8 py-6 text-xl font-bold text-hyc-text transition-all duration-200 hover:border-hyc-accent/50 hover:bg-hyc-surface/90 active:scale-[0.98]">
                      <KeyRound :size="26" class="text-hyc-muted" :stroke-width="2" />
                      <span>PIN eingeben</span>
                    </button> -->
    
        <!-- </div -->
    
        <!-- Rechtlicher/Info-Text ganz unten dezent aber lesbar -->
                  <!--<p class="text-xs text-hyc-muted tracking-wide text-center">
                        Störungsmeldungen & Support-Hotline auf der Rückseite der Ladesäule.
                    </p> 
                </footer> -->
    
    </section>
</template>