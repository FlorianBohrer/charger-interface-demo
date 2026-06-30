<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Volume2, VolumeX, Languages, HelpCircle, OctagonX } from "lucide-vue-next";
import { useUiStore } from "../state/ui";

const ui = useUiStore();
const { tts, locale, overlay } = storeToRefs(ui);
</script>

<template>
  <div class="grid grid-cols-4 gap-3 px-5 py-4 border-t border-hyc-line bg-hyc-bg">
    <!-- Vorlesen -->
    <button
      class="touch flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-5 outline-none
             transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-hyc-accent"
      :class="tts ? 'border-hyc-accent bg-hyc-accent/15' : 'border-hyc-line bg-hyc-surface hover:border-hyc-accent/40'"
      :aria-pressed="tts"
      @click="ui.toggleTts()"
    >
      <component :is="tts ? Volume2 : VolumeX" :size="30" :stroke-width="2"
        :class="tts ? 'text-hyc-accent' : 'text-hyc-text'" />
      <span class="text-sm font-medium" :class="tts ? 'text-hyc-accent' : 'text-hyc-text'">Vorlesen</span>
    </button>

    <!-- Sprache -->
    <button
      class="touch relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-hyc-line bg-hyc-surface py-5
             outline-none transition-all hover:border-hyc-accent/40 active:scale-95 focus-visible:ring-2 focus-visible:ring-hyc-accent"
      @click="ui.cycleLocale()"
    >
      <span class="absolute top-2 right-3 text-xs font-display font-bold text-hyc-accent">{{ locale.toUpperCase() }}</span>
      <Languages :size="30" :stroke-width="2" class="text-hyc-text" />
      <span class="text-sm font-medium text-hyc-text">Sprache</span>
    </button>

    <!-- Hilfe -->
    <button
      class="touch flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-5 outline-none
             transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-hyc-accent"
      :class="overlay === 'help' ? 'border-hyc-accent bg-hyc-accent/15' : 'border-hyc-line bg-hyc-surface hover:border-hyc-accent/40'"
      @click="overlay === 'help' ? ui.closeHelp() : ui.openHelp()"
    >
      <HelpCircle :size="30" :stroke-width="2" :class="overlay === 'help' ? 'text-hyc-accent' : 'text-hyc-text'" />
      <span class="text-sm font-medium" :class="overlay === 'help' ? 'text-hyc-accent' : 'text-hyc-text'">Hilfe</span>
    </button>

    <!-- Not-Halt -->
    <button
      class="touch group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-hyc-danger bg-hyc-danger/10 py-5
             outline-none transition-all hover:bg-hyc-danger active:scale-95 focus-visible:ring-2 focus-visible:ring-hyc-danger"
      @click="ui.triggerEmergency()"
    >
      <OctagonX :size="32" :stroke-width="2.25" class="text-hyc-danger group-hover:text-hyc-bg" />
      <span class="text-sm font-bold text-hyc-danger group-hover:text-hyc-bg">NOT-HALT</span>
    </button>
  </div>
</template>
