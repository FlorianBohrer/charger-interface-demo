<script setup lang="ts">
import { QrCode, Check, ChevronUp } from "lucide-vue-next";
defineProps<{ success?: boolean }>();
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center gap-3 px-12">
    <p class="text-hyc-accent text-xs uppercase tracking-[0.18em]">QR-Code scannen</p>
    <p class="text-xl font-medium font-display h-7">
      <span v-if="!success">Suche QR-Code …</span>
      <span v-else class="text-hyc-accent">Erkannt — verbunden</span>
    </p>
  </div>
  
</template>