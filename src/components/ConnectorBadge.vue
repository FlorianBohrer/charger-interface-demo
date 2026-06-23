<script setup lang="ts">
import type { ConnectorId, ConnectorStatus, ConnectorType } from "../sim/ocpp";

/**
 * TODO — Anschluss-Karte: Name, Typ, max. Leistung, Status-Chip.
 * Wenn `selectable` und Status "Available": klickbar -> emit("select", id).
 * Status-Text per i18n ("status." + status). Icon: lucide "Plug"/"PlugZap".
 */
defineProps<{
  id: ConnectorId;
  type: ConnectorType;
  maxPowerKw: number;
  status: ConnectorStatus;
  selectable?: boolean;
}>();
defineEmits<{ (e: "select", id: ConnectorId): void }>();
</script>

<template>
  <div class="todo">TODO · ConnectorBadge</div>
</template>
