<script setup lang="ts">
import { computed } from "vue";
import {
  Plug,
  AlertTriangle,
  ChevronRight,
} from "lucide-vue-next";

import type {
  ConnectorId,
  ConnectorStatus,
  ConnectorType,
} from "../sim/ocpp";

const props = withDefaults(
  defineProps<{
    id: ConnectorId;
    type: ConnectorType;
    maxPowerKw: number;
    status: ConnectorStatus;
    selectable?: boolean;
    selected?: boolean;
  }>(),
  {
    selectable: false,
    selected: false,
  },
);

const emit = defineEmits<{
  (e: "select", id: ConnectorId): void;
}>();

const statusText: Record<ConnectorStatus, string> = {
  Available: "Frei",
  Preparing: "Verbinde",
  Charging: "Lädt",
  SuspendedEV: "Pausiert",
  Finishing: "Beendet",
  Faulted: "Störung",
};

const disabled = computed(() => {
  return !props.selectable || props.status !== "Available";
});

const statusClasses = computed(() => {
  if (props.status === "Available") {
    return {
      dot: "bg-hyc-accent shadow-[0_0_10px_rgba(68,232,160,0.7)]",
      text: "text-hyc-accent",
    };
  }

  if (props.status === "Faulted") {
    return {
      dot: "bg-hyc-danger",
      text: "text-hyc-danger",
    };
  }

  return {
    dot: "bg-hyc-muted",
    text: "text-hyc-muted",
  };
});

function handleSelect() {
  if (!disabled.value) {
    emit("select", props.id);
  }
}
</script>

<template>
  <button
    type="button"
    class="
      group relative flex min-h-[98px] w-full
      items-stretch overflow-hidden
      rounded-[22px] border
      px-7 py-3
      text-left outline-none
      transition-all duration-200
      disabled:cursor-not-allowed
      focus-visible:ring-2
      focus-visible:ring-hyc-accent
      focus-visible:ring-offset-4
      focus-visible:ring-offset-hyc-bg
    "
    :class="[
      selected
        ? `
          border-hyc-accent
          bg-[linear-gradient(90deg,rgba(26,124,81,0.20),rgba(68,232,160,0.035))]
          shadow-[0_0_0_1px_rgba(68,232,160,0.18),0_0_30px_rgba(68,232,160,0.12)]
        `
        : `
          border-hyc-line
          bg-hyc-surface/45
          hover:border-hyc-accent/45
          hover:bg-hyc-surface/65
        `,
      status === 'Faulted' && 'border-hyc-danger/60',
      disabled && 'opacity-50',
    ]"
    :disabled="disabled"
    :aria-pressed="selected"
    @click="handleSelect"
  >
    <div class="flex w-full items-center">
      <!-- Icon -->
      <div
        class="
          grid h-[54px] w-[54px]
          shrink-0 place-items-center
          rounded-[14px]
          bg-hyc-bg/60
        "
      >
        <component
          :is="status === 'Faulted' ? AlertTriangle : Plug"
          :size="32"
          :stroke-width="1.65"
          :class="
            status === 'Faulted'
              ? 'text-hyc-danger'
              : selected
                ? 'text-hyc-accent'
                : 'text-hyc-muted'
          "
        />
      </div>

      <!-- Anschlussinformationen -->
      <div
        class="
          ml-6 flex min-w-[200px]
          flex-col justify-center
        "
      >
        <span
          class="
            text-[14px] font-medium uppercase
            tracking-[0.04em] text-hyc-muted
          "
        >
          Anschluss
        </span>

        <span
          class="
            font-display text-[32px]
            font-medium leading-tight
          "
          :class="
            selected
              ? 'text-hyc-accent'
              : 'text-hyc-text'
          "
        >
          {{ id }}
        </span>

        <span
          class="
            text-[16px] font-medium
            text-hyc-muted
          "
        >
          DC · {{ type }}
        </span>
      </div>

      <!-- Trennlinie -->
      <div
        class="
          mx-6 h-[64px] w-px
          shrink-0 bg-hyc-line
        "
      />

      <!-- Leistung -->
      <div
        class="
          ml-auto flex min-w-[230px]
          flex-col items-end justify-center
        "
      >
        <div class="flex items-baseline">
          <span
            class="
              tnum font-display text-[44px]
              font-medium leading-none
              tracking-[-0.04em] text-hyc-text
            "
          >
            {{ maxPowerKw }}
          </span>

          <span class="ml-3 text-[20px] text-hyc-muted">
            kW
          </span>
        </div>

        <div class="mt-2 flex items-center gap-3">
          <span
            class="h-3 w-3 rounded-full"
            :class="statusClasses.dot"
          />

          <span
            class="text-[18px] font-medium"
            :class="statusClasses.text"
          >
            {{ statusText[status] }}
          </span>
        </div>
      </div>

      <!-- Pfeil -->
      <ChevronRight
        :size="36"
        :stroke-width="1.7"
        class="
          ml-6 shrink-0 text-hyc-text
          transition-transform duration-200
          group-hover:translate-x-1
        "
      />
    </div>
  </button>
</template>
