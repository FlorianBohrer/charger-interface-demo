<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Globe, CreditCard, HelpCircle, OctagonX } from "lucide-vue-next";
import { useUiStore } from "../state/ui";

const ui = useUiStore();
const { locale, overlay } = storeToRefs(ui);

// tarife-ansicht gibt es noch nicht -> platzhalter
function openTarife() {
  // TODO: tarif-/preisübersicht öffnen
}
</script>

<template>
  <div class="grid grid-cols-4 border-t border-hyc-line bg-hyc-bg">
    <!-- Sprache -->
    <button
      class="touch relative flex items-center justify-center gap-3 py-6 border-r border-hyc-line
             outline-none transition-colors hover:bg-hyc-surface/50 active:bg-hyc-surface
             focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hyc-accent"
      @click="ui.cycleLocale()"
    >
      <span class="absolute top-3 right-1/2 translate-x-[46px] text-[11px] font-display font-bold text-hyc-accent">
        {{ locale.toUpperCase() }}
      </span>
      <Globe :size="27" :stroke-width="1.8" class="text-hyc-text" />
      <span class="text-[19px] font-medium text-hyc-text">Sprache</span>
    </button>

    <!-- Tarife -->
    <button
      class="touch flex items-center justify-center gap-3 py-6 border-r border-hyc-line
             outline-none transition-colors hover:bg-hyc-surface/50 active:bg-hyc-surface
             focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hyc-accent"
      @click="openTarife()"
    >
      <CreditCard :size="27" :stroke-width="1.8" class="text-hyc-text" />
      <span class="text-[19px] font-medium text-hyc-text">Tarife</span>
    </button>

    <!-- Hilfe -->
    <button
      class="touch flex items-center justify-center gap-3 py-6 border-r border-hyc-line
             outline-none transition-colors hover:bg-hyc-surface/50 active:bg-hyc-surface
             focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hyc-accent"
      :class="overlay === 'help' && 'bg-hyc-surface/60'"
      @click="overlay === 'help' ? ui.closeHelp() : ui.openHelp()"
    >
      <HelpCircle :size="27" :stroke-width="1.8"
        :class="overlay === 'help' ? 'text-hyc-accent' : 'text-hyc-text'" />
      <span class="text-[19px] font-medium"
        :class="overlay === 'help' ? 'text-hyc-accent' : 'text-hyc-text'">Hilfe</span>
    </button>

    <!-- Not-Halt -->
    <button
      class="touch group flex items-center justify-center gap-3 py-6
             outline-none transition-colors hover:bg-hyc-danger/10 active:bg-hyc-danger/15
             focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hyc-danger"
      @click="ui.triggerEmergency()"
    >
      <OctagonX :size="28" :stroke-width="2" class="text-hyc-danger" />
      <span class="text-[19px] font-bold text-hyc-danger">Not-Halt</span>
    </button>
  </div>
</template>
