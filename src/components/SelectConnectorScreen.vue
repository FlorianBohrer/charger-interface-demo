<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ArrowLeft } from "lucide-vue-next";
import { useChargerStore } from "../state/charger";
import ConnectorBadge from "./ConnectorBadge.vue";

const store = useChargerStore();
const { connectors } = storeToRefs(store);
</script>

<template>
  <section class="h-full flex flex-col px-12 py-10">
    <button class="touch self-start flex items-center gap-1.5 text-hyc-muted text-sm hover:text-hyc-text mb-8"
      @click="store.cancelAuth()">
      <ArrowLeft :size="16" :stroke-width="2" /> Zurück
    </button>

    <h2 class="font-display text-3xl font-medium">Anschluss wählen</h2>
    <p class="text-hyc-muted mt-1">Stecker verbinden und Anschluss antippen.</p>

    <div class="grid grid-cols-2 gap-4 mt-8">
      <ConnectorBadge
        v-for="(c, id) in connectors"
        :key="id"
        :id="id"
        :type="c.type"
        :max-power-kw="c.maxPowerKw"
        :status="c.status"
        selectable
        @select="store.selectConnector"
      />
    </div>
  </section>
</template>