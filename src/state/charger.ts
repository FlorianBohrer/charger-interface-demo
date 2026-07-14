import { defineStore } from "pinia";
import type {
  AuthMethod,
  ChargeLimit,
  ConnectorId,
  ConnectorStatus,
  ConnectorType,
  MeterSample,
} from "../sim/ocpp";
import type { ChargePointTransport } from "../sim/transport";
import { MockCrowBackend } from "../sim/MockCrowBackend";
import { WebSocketTransport } from "../sim/transport";

export type Phase =
  | "boot"
  | "idle"
  | "selectAuth"
  | "authorizing"
  | "configure"
  | "charging"
  | "finishing"
  | "summary";

interface ConnectorInfo {
  type: ConnectorType;
  maxPowerKw: number;
  status: ConnectorStatus;
}

interface SessionSummary {
  energyKwh: number;
  durationS: number;
  costEur: number;
  soc: number;
  connectorType: ConnectorType;
  limit: ChargeLimit;
}

interface State {
  phase: Phase;
  station: { stationId: string; model: string; firmware: string };
  connectors: Record<ConnectorId, ConnectorInfo>;
  authMethod: AuthMethod | null;
  authorized: boolean;
  selectedConnector: ConnectorId | null;
  limit: ChargeLimit;
  transactionId: string | null;
  meter: MeterSample | null;
  summary: SessionSummary | null;
}

let transport: ChargePointTransport | null = null;

export const useChargerStore = defineStore("charger", {
  state: (): State => ({
    phase: "boot",
    station: { stationId: "—", model: "Hypercharger", firmware: "" },
    connectors: {
      A: { type: "CCS", maxPowerKw: 400, status: "Available" },
      B: { type: "CHAdeMO", maxPowerKw: 200, status: "Available" },
    },
    authMethod: null,
    authorized : false,
    selectedConnector: null,
    limit: { mode: "full" },
    transactionId: null,
    meter: null,
    summary: null,
  }),

  getters: {
    activeConnector(state): ConnectorInfo | null {
      return state.selectedConnector
        ? state.connectors[state.selectedConnector]
        : null;
    },
  },

  actions: {
    connect() {
      const url = import.meta.env.VITE_CHARGER_WS as string | undefined;
      transport = url ? new WebSocketTransport(url) : new MockCrowBackend();

      transport.onMessage((msg) => {
        switch (msg.action) {
          case "BootNotification":
            this.station = {
              stationId: msg.stationId,
              model: msg.model,
              firmware: msg.firmware,
            };
            if (this.phase === "boot") this.phase = "idle";
            break;

          case "StatusNotification":
            this.connectors[msg.connectorId] = {
              type: msg.connectorType,
              maxPowerKw: msg.maxPowerKw,
              status: msg.status,
            };
            break;

      case "AuthorizeResponse":
  if (msg.accepted && this.phase === "authorizing") {
    this.authorized = true;                 // -> QrScan zeigt den Check
    setTimeout(() => {
      if (this.phase === "authorizing") {
        this.authorized = false;
        this.phase = "configure";           // anschluss steht schon fest -> ladeziel
      }
    }, 900);
  }
  break;

          case "TransactionEvent":
            if (msg.eventType === "Started") {
              this.transactionId = msg.transactionId;
              this.meter = msg.meter;
              this.phase = "charging";
            } else if (msg.eventType === "Updated") {
              this.meter = msg.meter;
            } else if (msg.eventType === "Ended") {
              this.meter = msg.meter; // <- this.meter, nicht msg.meter
              this.summary = {
                energyKwh: msg.meter.energyKwh,
                durationS: msg.meter.durationS,
                costEur: msg.meter.costEur,
                soc: msg.meter.soc,
                connectorType: this.connectors[msg.connectorId]?.type ?? "CCS",
                limit: this.limit,
              };
              this.phase = "summary";
            }
            break;
        }
      });
    },

    /** idle -> selectAuth */
    beginAuth() {
      if (this.phase === "idle") this.phase = "selectAuth";
    },

    /** Authorize senden, phase -> authorizing (nur aus idle/selectAuth) */
    authorize(method: AuthMethod) {
      if (this.phase !== "idle" && this.phase !== "selectAuth") return;
      this.authMethod = method;
      this.phase = "authorizing";
      transport?.send({ action: "Authorize", method, idTag: "DEMO-" + method });
    },

    /** anschluss schon im idle wählen (vor der authentifizierung) */
    chooseConnector(id: ConnectorId) {
      if (this.connectors[id]?.status === "Available") {
        this.selectedConnector = id;
      }
    },

    /** Ladeziel bestätigen: RequestStart mit limit senden (nur aus configure) */
    startCharging(limit: ChargeLimit) {
      if (this.phase !== "configure" || !this.selectedConnector) return;
      this.limit = limit;
      transport?.send({
        action: "RequestStart",
        connectorId: this.selectedConnector,
        limit,
      });
    },

    /** RequestStop senden, phase -> finishing (nur aus charging) */
    stop() {
      if (this.phase === "charging" && this.transactionId) {
        this.phase = "finishing";
        transport?.send({ action: "RequestStop", transactionId: this.transactionId });
      }
    },

    /** Not-Halt: laufende tansaktion sofort stoppen (RequestStop) */
    emergencyAbort() {
      if (!this.transactionId) return;
      transport?.send({ action: "RequestStop", transactionId: this.transactionId });
    },

    /** Harter reset auf idle (felder leeren, limit -> full) */
    reset() {
      this.phase = "idle";
      this.authMethod = null;
      this.authorized = false;
      this.selectedConnector = null;
      this.limit = { mode: "full" };
      this.transactionId = null;
      this.meter = null;
      this.summary = null;
    },

    dismissSummary() {
      this.reset();
    },

    /** Abbrechen aus selectAuth/authorizing/configure -> idle */
    cancelAuth() {
      this.reset();
    },
  },
});
