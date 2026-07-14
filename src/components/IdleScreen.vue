<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import {
  Nfc,
  ArrowRight,
  Info,
} from "lucide-vue-next";

import { useChargerStore } from "../state/charger";
import type { ConnectorId } from "../sim/ocpp";
import ConnectorBadge from "./ConnectorBadge.vue";

const store = useChargerStore();
const { connectors } = storeToRefs(store);

const selectedConnector = ref<ConnectorId | null>(null);
const pricePerKwh = 0.59;

function selectConnector(id: ConnectorId) {
  selectedConnector.value = id;
}

function startCharging() {
  if (!selectedConnector.value) return;

  // gewählten anschluss in den store übernehmen, dann authentifizieren
  store.chooseConnector(selectedConnector.value);
  store.beginAuth();
}
</script>

<template>
  <section
    class="
      flex h-full min-h-0 flex-col
      bg-hyc-bg px-14 py-5
      select-none
    "
  >
    <!-- Kopfbereich -->
    <header class="flex items-start justify-between gap-12">
      <div class="max-w-[650px]">
        <p
          class="
            mb-2 text-sm font-semibold uppercase
            tracking-[0.18em] text-hyc-accent
          "
        >
          Bereit zum Laden
        </p>

        <h1
          class="
            font-display text-[42px] font-medium
            leading-[0.95] tracking-[-0.035em]
            text-hyc-text
          "
        >
          Willkommen.
        </h1>

        <p
          class="
            mt-2 max-w-[560px]
            text-[18px] leading-[1.3]
            text-hyc-muted
          "
        >
          Wählen Sie einen freien Anschluss und halten Sie Ihre
          Ladekarte bereit.
        </p>
      </div>

      <!-- NFC-Hinweis -->
      <div
        class="
          flex min-h-[84px] min-w-[340px]
          items-center justify-center gap-6
          rounded-[22px]
          border border-hyc-accent/70
          bg-hyc-accent/[0.025]
          px-8 py-3
          shadow-[0_0_28px_rgba(68,232,160,0.06)]
        "
      >
        <Nfc
          :size="46"
          :stroke-width="1.7"
          class="shrink-0 text-hyc-accent"
        />

        <span
          class="
            text-[18px] font-medium
            leading-[1.25] text-hyc-text
          "
        >
          Karte an<br />
          Lesefeld halten
        </span>
      </div>
    </header>

    <!-- Hauptbereich -->
    <div
      class="
        mt-4 grid min-h-0 flex-1
        grid-cols-[minmax(0,1fr)_340px]
        gap-8
      "
    >
      <!-- Anschlussauswahl -->
      <div class="flex min-h-0 flex-col gap-3">
        <ConnectorBadge
          v-for="(connector, id) in connectors"
          :key="id"
          :id="id"
          :type="connector.type"
          :max-power-kw="connector.maxPowerKw"
          :status="connector.status"
          selectable
          :selected="selectedConnector === id"
          @select="selectConnector"
        />
      </div>

      <!-- Tarifkarte -->
      <aside
        class="
          flex flex-col justify-center
          rounded-[22px]
          border border-hyc-line
          bg-hyc-surface/45
          px-7 py-5
        "
      >
        <p
          class="
            text-sm font-semibold uppercase
            tracking-[0.08em] text-hyc-accent
          "
        >
          Aktueller Ladetarif
        </p>

        <div class="mt-4 flex items-baseline">
          <span
            class="
              tnum font-display text-[46px]
              font-medium leading-none
              tracking-[-0.04em] text-hyc-text
            "
          >
            {{ pricePerKwh.toFixed(2).replace(".", ",") }}
          </span>

          <span class="ml-3 text-[20px] text-hyc-muted">
            €/kWh
          </span>
        </div>

        <p class="mt-2 text-base text-hyc-muted">
          inkl. Steuern
        </p>

        <div class="my-4 h-px bg-hyc-line" />

        <div class="flex items-start gap-4">
          <div
            class="
              grid h-11 w-11 shrink-0 place-items-center
              rounded-full border border-hyc-muted/70
            "
          >
            <Info
              :size="22"
              :stroke-width="1.8"
              class="text-hyc-muted"
            />
          </div>

          <p
            class="
              max-w-[220px]
              text-[16px] leading-[1.4]
              text-hyc-muted
            "
          >
            Preise können je nach Anbieter und Uhrzeit variieren.
          </p>
        </div>
      </aside>
    </div>

    <!-- Hauptaktion -->
    <button
      type="button"
      class="
        touch mt-4 flex min-h-[70px] w-full
        items-center justify-center gap-4
        rounded-[20px]
        font-display text-[26px] font-medium
        outline-none
        transition-all
        active:translate-y-px
        disabled:cursor-not-allowed
        focus-visible:ring-2
        focus-visible:ring-offset-4
        focus-visible:ring-offset-hyc-bg
      "
      :class="
        selectedConnector
          ? 'bg-hyc-accent text-hyc-bg hover:brightness-105 focus-visible:ring-hyc-accent'
          : 'border border-hyc-line bg-hyc-surface/50 text-hyc-muted focus-visible:ring-hyc-line'
      "
      :disabled="!selectedConnector"
      @click="startCharging"
    >
      {{ selectedConnector ? "Laden starten" : "Bitte Anschluss wählen" }}

      <ArrowRight
        v-if="selectedConnector"
        :size="30"
        :stroke-width="2"
      />
    </button>
  </section>
</template>
