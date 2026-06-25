<script setup lang="ts">
  import { useChargerStore } from '../state/charger';
  const store = useChargerStore();
</script>

<template>

  <section class="h-full flex flex-col items-center justify-center gap-6 px-12">
    <h1 class="font-display text-5xl font-medium">Wilkommen</h1>
    <p class="text-hyc-muted text-lg">Ladekarte auflegen oder QR-Code scannen</p>
      <button
      class="touch rounded-2xl bg-hyc-accent text-hyc-bg font-display text-xl font medium px-12 py-5
              hover:brightness-105 active:translate-y-px" 
              @click="store.beginAuth()" 
              >
              Laden starten
      </button>
  </section>
</template>
