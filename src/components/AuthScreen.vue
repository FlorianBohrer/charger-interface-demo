<script setup lang="ts">
import { storeToRefs } from "pinia";
import { CreditCard, QrCode, Smartphone, ArrowLeft, Loader2 } from "lucide-vue-next";
import type { FunctionalComponent } from "vue";
import { useChargerStore } from "../state/charger";
import type { AuthMethod } from "../sim/ocpp";

const store = useChargerStore();
const { phase, authMethod } = storeToRefs(store);

const methods: { id: AuthMethod; icon: FunctionalComponent; title: string; sub: string }[] = [
  { id: "RFID", icon: CreditCard,  title: "Ladekarte",          sub: "Karte auf das Lesefeld legen" },
  { id: "QR",   icon: QrCode,      title: "QR-Code",            sub: "Mit der App scannen" },
  { id: "App",  icon: Smartphone,  title: "App / Plug & Charge", sub: "Automatisch erkennen" },
];
</script>



<template>
  <section class="h-full"><div class="todo">TODO · AuthScreen</div></section>
</template>
