<script setup lang="ts">
import { HelpCircle, CreditCard, Plug, Zap, Flag, X } from "lucide-vue-next";
import type { FunctionalComponent } from "vue";
import { useUiStore } from "../state/ui";

const ui = useUiStore();

const steps: { icon: FunctionalComponent; t: string; d: string }[] = [
  { icon: CreditCard, t: "1 · Authentifizieren", d: "Ladekarte auflegen, QR-Code scannen oder App nutzen." },
  { icon: Plug, t: "2 · Stecker verbinden", d: "Stecker mit dem Fahrzeug verbinden und Anschluss wählen." },
  { icon: Zap, t: "3 · Laden", d: "Der Ladevorgang startet automatisch — der Fortschritt wird angezeigt." },
  { icon: Flag, t: "4 · Beenden", d: "„Laden beenden“ drücken, danach den Stecker entnehmen." },
];
</script>

<template>
  <div class="absolute inset-0 z-20 grid place-items-center bg-hyc-bg/85 backdrop-blur-sm px-10 fade-in"
    @click.self="ui.closeHelp()">
    <div class="w-full max-w-3xl rounded-3xl border border-hyc-line bg-hyc-surface shadow-2xl p-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="grid place-items-center w-12 h-12 rounded-2xl bg-hyc-accent/15 border border-hyc-accent/30">
            <HelpCircle :size="24" class="text-hyc-accent" :stroke-width="2" />
          </span>
          <h2 class="font-display text-2xl font-medium">Hilfe & Anleitung</h2>
        </div>
        <button
          class="touch grid place-items-center w-12 h-12 rounded-xl border-2 border-hyc-line hover:border-hyc-accent/50
                 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-hyc-accent"
          @click="ui.closeHelp()">
          <X :size="22" class="text-hyc-text" :stroke-width="2.25" />
        </button>
      </div>

      <ol class="grid grid-cols-2 gap-4">
        <li v-for="s in steps" :key="s.t" class="flex gap-3 rounded-2xl border border-hyc-line-soft bg-hyc-bg/40 p-4">
          <component :is="s.icon" :size="22" class="text-hyc-accent shrink-0 mt-0.5" :stroke-width="2" />
          <div>
            <div class="font-display font-medium text-lg">{{ s.t }}</div>
            <div class="text-hyc-text/70 mt-0.5 leading-snug">{{ s.d }}</div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
