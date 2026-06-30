<script setup lang="ts">
import { OctagonX, RotateCcw } from "lucide-vue-next";
import { useUiStore } from "../state/ui";

const ui = useUiStore();
</script>

<template>
  <div class="absolute inset-0 z-30 grid place-items-center bg-hyc-danger/15 backdrop-blur-md px-10 fade-in">
    <div class="w-full max-w-xl rounded-3xl border-2 border-hyc-danger bg-hyc-surface shadow-2xl p-10 text-center">
      <span class="inline-grid place-items-center w-20 h-20 rounded-2xl bg-hyc-danger/15 border border-hyc-danger/40 mb-6">
        <OctagonX :size="44" class="text-hyc-danger" :stroke-width="2" />
      </span>
      <h2 class="font-display text-3xl font-medium text-hyc-danger">Not-Halt aktiviert</h2>
      <p class="text-hyc-text/70 mt-3 max-w-md mx-auto leading-snug">
        Der Ladevorgang wurde sofort gestoppt. Die Anlage ist spannungsfrei.
      </p>
      <button
        class="touch mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-hyc-danger text-hyc-bg font-display text-lg font-medium
               px-10 py-4 hover:brightness-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-hyc-danger
               focus-visible:ring-offset-2 focus-visible:ring-offset-hyc-surface"
        @click="ui.resetEmergency()">
        <RotateCcw :size="22" :stroke-width="2.25" /> Zurücksetzen
      </button>
    </div>
  </div>
</template>
