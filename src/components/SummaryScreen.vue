<script setup lang="ts">
import { storeToRefs } from "pinia";
import { CircleCheckBig, BatteryCharging, Clock, Receipt, Unplug, CircleCheck, BatteryChargingIcon, EuroIcon, TimerIcon } from "lucide-vue-next";
import { useChargerStore } from "../state/charger";
import { formatDuration, formatEur } from "../state/format";

const store = useChargerStore();
const { summary, selectedConnector } = storeToRefs(store);


</script>

<template>
 


      <section v-if="summary" class="h-full flex flex-col px-12 py-20">
          
          <div class="flex items-center gap-4 fade-in">
            <span class="grid place-items-center w-16 h-16 rounded-2xl bg-hyc-accent/15 border border-hyc-accent/30 animate-qr-pop">
              <CircleCheckBig :size="32" class="text-hyc-accent" :stroke-width="2" />
            </span>
              <div>
                  <h2 class="font-display text-3xl font-light ">Ladevorgang abgeschlossen</h2>
                    <p class="text-hyc-text/90 text-2xl font-bold flex items-center gap-2 mt-1">
                      <Unplug :size="16" :stroke-width="1.75" />
                          Bitte Stecker entnehmen —  <span class="text-2xl text-hyc-accent">Anschluss {{ selectedConnector }} </span>
                    </p>
              </div>
          </div>

          <!-- Werte -->  
        <div class="grid grid-cols-3 gap-4 mt-auto px-5  ">
              <!--geladene Energie -->
            <div class=" border-r-1 mt-0.5 pl-4 pt-5" >
              <BatteryCharging :size="42" class=" pb-1 text-hyc-accent" :stroke-width="2" />
              <div class="font-display text-5xl font-medium  text-hyc-accent">
                {{ summary.energyKwh.toFixed(1) }}
                   <span class="text-xl text-amber-100 ml-1">kWh</span>
              </div>
                   <div class="text-amber-100 text-xs pl-2 uppercase tracking-[0.16em]">
                      Geladen · {{ Math.round(summary.soc) }}% SoC
                  </div>
            </div>

            <div class=" border-r-1 mt-1.5 pl-9 pt-5" >
                <EuroIcon :size="42" class=" pb-1 text-hyc-accent text-center"  :stroke-width="2" />
                  <div class=" font-display text-5xl font-medium text-hyc-accent ml-1">
                    {{ summary.costEur.toFixed(1) }}
                      <span class="text-xl text-amber-100 text-s pl-2 tracking-[0.16em] uppercase">
                        EUR</span>
                  </div>
                   <div class="text-amber-100 text-xs uppercase tracking-[0.16em]">
                      Bezahlt
                  </div>
            </div>

            <div class="mt-0.5 pt-5">
                <TimerIcon :size="42" class=" pb-1 text-hyc-accent" :stroke-width="2" />
                  <div class=" font-display text-5xl font-medium text-hyc-accent ml-1">
                    {{ formatDuration(summary.durationS) }}
                      <span class="text-xl 
                      
                      text-amber-100  tracking-[0.16em] uppercase">
                        min</span>
                  </div>
                  <div class="text-amber-100 text-xs uppercase pl-2 tracking-[0.16em]">
                      Ladedauer
                  </div>
            </div>
            
          </div> 

      <!-- <section class="bg-cyan-950 p-5 rounded-2xl mt-6">
        <div> 
          <div class="flex items-center justify-between border-b-[0.5px] border-white/15 py-6 text-mist-500"> 
            <div class="flex items-center">
              <BatteryCharging :size="32" class="text-hyc-accent" :stroke-width="2" />
              <div class="text-hyc-muted text-xl px-3 uppercase tracking-[0.16em]">
                Geladen · {{ Math.round(summary.peak) }}% SoC
              </div>
            </div>
            <div class="font-display text-2xl font-medium text-hyc-accent">
              {{ summary.soc}}
              <span class="text-2xl text-hyc-muted ml-1">kWh</span>
            </div>
          </div>
           
          <div class="flex items-center justify-between border-b-[0.5px] border-white/15 px-2 py-6 text-mist-500"> 
            <div class="flex items-center">
              <EuroIcon :size="32" class="text-hyc-accent" :stroke-width="2" />
              <div class="text-hyc-muted text-xl px-3 uppercase tracking-[0.16em]">
                Kosten
              </div>
            </div>
            <div class="font-display text-2xl font-medium text-hyc-accent">
              {{ summary.costEur.toFixed(1) }}
              <span class="text-2xl text-hyc-muted ml-1">EUR</span>
            </div>
          </div>
           
          <div class="flex items-center justify-between  border-white/15 py-6 px-2 text-mist-500"> 
            <div class="flex items-center">
              <TimerIcon :size="32" class="text-hyc-accent" :stroke-width="2" />
              <div class="text-hyc-muted text-xl px-3 uppercase tracking-[0.16em]">
                Zeit
              </div>
            </div>
            <div class="font-display text-2xl font-medium text-hyc-accent">
              {{ formatDuration(summary.durationS) }}
              <span class="text-2xl text-hyc-muted ml-1">min</span>
            </div>
          </div>

  
    

         <div>
                <EuroIcon :size="12" class="text-hyc-accent" :stroke-width="2" />
                  <div class=" font-display text-5xl font-medium text-hyc-accent ml-1">
                    {{ summary.costEur.toFixed(1) }}, EUR
                      <span class="text-xl text-hyc-muted text-xs tracking-[0.16em] uppercase">
                        Kosten</span>
                  </div>
            </div>

            <div>
                <TimerIcon :size="12" class="text-hyc-accent" :stroke-width="2" />
                  <div class=" font-display text-5xl font-medium text-hyc-accent ml-1">
                    {{ formatDuration(summary.durationS) }}, Min
                      <span class="text-xl text-hyc-muted text-xs tracking-[0.16em] uppercase">
                        Zeit</span>
                  </div>
            </div>
            </div>
          </section> -->

        
          <button
            class="touch mt-6 w-full rounded-2xl bg-hyc-accent text-hyc-bg font-display text-xl font-medium py-5
                  hover:brightness-105 active:translate-y-px outline-none focus-visible:ring-2 focus-visible:ring-hyc-accent
                  focus-visible:ring-offset-2 focus-visible:ring-offset-hyc-bg"
            @click="store.dismissSummary()"
          >
            Fertig
          </button>
        </section> 

        
</template>


