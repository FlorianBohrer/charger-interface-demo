import type { ChargePointTransport } from "./transport";
import type {
  ChargeLimit,
  ConnectorId,
  ConnectorStatus,
  InboundMessage,
  MeterSample,
  OutboundMessage,
} from "./ocpp";

const STATION = {
  stationId: "Charger-XM8-DEMO-001",
  model: "Hypercharger XM8 Series 2",
  firmware: "bsp fw 1.23.0",
};

const TARIFF_EUR_PER_KWH = 0.59;
const MAX_POWER_KW = 400;
const BATTERY_KWH = 77;
const TICK_MS = 250;
const SPEED = 60;

export class MockCrowBackend implements ChargePointTransport {
  private listeners: ((m: InboundMessage) => void)[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private tx: {
    id: string;
    connectorId: ConnectorId;
    soc: number;
    energyKwh: number;
    durationS: number;
    limit: ChargeLimit;
  } | null = null;

  constructor() {
    setTimeout(() => {
      this.emit({ action: "BootNotification", ...STATION });
      this.emitStatus("A", "Available");
      this.emitStatus("B", "Available");
    }, 50);
  }

  onMessage(cb: (msg: InboundMessage) => void) {
    this.listeners.push(cb);
  }

  send(msg: OutboundMessage) {
    switch (msg.action) {
      case "Authorize":
        setTimeout(
          () =>
            this.emit({
              action: "AuthorizeResponse",
              idTag: msg.idTag,
              method: msg.method,
              accepted: true,
            }),
          900,
        );
        break;
      case "RequestStart":
        this.startTransaction(msg.connectorId, msg.limit);
        break;
      case "RequestStop":
        this.stopTransaction();
        break;
    }
  }

  close() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.listeners = [];
  }

  // ---- intern ----

  private emit(msg: InboundMessage) {
    queueMicrotask(() => this.listeners.forEach((l) => l(msg)));
  }

  private emitStatus(connectorId: ConnectorId, status: ConnectorStatus) {
    this.emit({
      action: "StatusNotification",
      connectorId,
      connectorType: connectorId === "A" ? "CCS" : "CHAdeMO",
      maxPowerKw: connectorId === "A" ? MAX_POWER_KW : 200,
      status,
    });
  }

  private startTransaction(connectorId: ConnectorId, limit: ChargeLimit) {
    this.tx = {
      id: "TX-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      connectorId,
      soc: 18 + Math.random() * 12,
      energyKwh: 0,
      durationS: 0,
      limit,
    };
    this.emitStatus(connectorId, "Charging");
    this.emit({
      action: "TransactionEvent",
      eventType: "Started",
      connectorId,
      transactionId: this.tx.id,
      meter: this.sample(),
    });
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  private stopTransaction() {
    if (!this.tx) return;
    const connectorId = this.tx.connectorId;
    this.emit({
      action: "TransactionEvent",
      eventType: "Ended",
      connectorId,
      transactionId: this.tx.id,
      meter: this.sample(),
    });
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.tx = null;
    this.emitStatus(connectorId, "Finishing");
    setTimeout(() => this.emitStatus(connectorId, "Available"), 4000);
  }

  /** Leistung fällt mit steigendem SoC (Tapering) — wie bei echten Akkus. */
  private powerForSoc(soc: number): number {
    const cap = this.tx?.connectorId === "A" ? MAX_POWER_KW : 200;
    let p: number;
    if (soc < 55) p = cap;
    else if (soc < 80) p = cap * (1 - (soc - 55) / 55);
    else p = cap * 0.18 * (1 - (soc - 80) / 40);
    return Math.max(8, Math.round(p));
  }

  private sample(): MeterSample {
    const tx = this.tx!;
    const powerKw = this.powerForSoc(tx.soc);
    const voltage = 780 + Math.round((Math.random() - 0.5) * 8);
    return {
      soc: Math.min(100, Math.round(tx.soc * 10) / 10),
      powerKw,
      energyKwh: Math.round(tx.energyKwh * 100) / 100,
      voltage,
      current: Math.round((powerKw * 1000) / voltage),
      durationS: Math.round(tx.durationS),
      costEur: Math.round(tx.energyKwh * TARIFF_EUR_PER_KWH * 100) / 100,
    };
  }

  /** Läuft alle TICK_MS: Werte fortschreiben, Ziel prüfen, Updated senden. */
  private tick() {
    const tx = this.tx;
    if (!tx) return;

    const dtH = TICK_MS / 1000 / 3600;
    const deltaKwh = this.powerForSoc(tx.soc) * dtH * SPEED;
    tx.energyKwh += deltaKwh;
    tx.soc += (deltaKwh / BATTERY_KWH) * 100;
    tx.durationS += (TICK_MS / 1000) * SPEED;

    const cost = tx.energyKwh * TARIFF_EUR_PER_KWH;
    const limitReached =
      (tx.limit.mode === "duration" && tx.durationS >= tx.limit.minutes * 60) ||
      (tx.limit.mode === "price" && cost >= tx.limit.eur);

    if (tx.soc > 100) tx.soc = 100;

    this.emit({
      action: "TransactionEvent",
      eventType: "Updated",
      connectorId: tx.connectorId,
      transactionId: tx.id,
      meter: this.sample(),
    });

    if (tx.soc >= 100 || limitReached) this.stopTransaction();
  }
}