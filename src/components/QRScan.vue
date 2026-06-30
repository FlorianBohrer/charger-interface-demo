<script setup lang="ts">
import { QrCode, Check, ChevronUp } from "lucide-vue-next";

defineProps<{ success?: boolean }>();
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center gap-3 px-12">
    <p class="text-hyc-accent text-xs font-semibold uppercase tracking-[0.22em]">QR-Code scannen</p>
    <p class="text-xl font-medium font-display h-7">
      <span v-if="!success">Suche QR-Code …</span>
      <span v-else class="text-hyc-accent">Erkannt — verbunden</span>
    </p>

    <!-- Sucherrahmen -->
    <div class="relative w-56 h-56 grid place-items-center mt-2">
      <div v-if="!success" class="absolute w-52 h-52 rounded-full border border-hyc-accent animate-qr-pulse"></div>

      <div
        class="relative w-44 h-44 rounded-2xl border grid place-items-center overflow-hidden transition-colors"
        :class="success ? 'border-hyc-accent' : 'border-hyc-line'"
      >
        <QrCode v-if="!success" :size="92" class="text-hyc-faint" :stroke-width="1.25" />
        <Check v-else :size="88" class="text-hyc-accent animate-qr-pop" :stroke-width="2.5" />
        <div v-if="!success" class="absolute w-36 h-0.5 bg-hyc-accent animate-qr-beam"></div>

        <span class="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-hyc-accent rounded-tl-lg"></span>
        <span class="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-hyc-accent rounded-tr-lg"></span>
        <span class="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-hyc-accent rounded-bl-lg"></span>
        <span class="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-hyc-accent rounded-br-lg"></span>
      </div>
    </div>

    <!-- "Hierhin halten"-Hinweis -->
    <div v-if="!success" class="flex flex-col items-center gap-1 mt-2 text-hyc-muted">
      <ChevronUp :size="22" class="text-hyc-accent animate-qr-bob" />
      <div class="flex items-center gap-3 text-sm">
        <span class="grid place-items-center w-9 h-14 border-2 border-hyc-faint rounded-lg animate-qr-bob">
          <QrCode :size="18" class="text-hyc-accent" />
        </span>
        Handy mit QR-Code vor den Scanner halten
      </div>
    </div>
  </div>
</template>
