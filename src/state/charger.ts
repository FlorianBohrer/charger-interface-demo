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
// import { MockCrowBackend } from "../sim/MockCrowBackend";
// import { WebSocketTransport } from "../sim/transport";

export type Phase =
  | "boot"
  | "idle"
  | "selectAuth"
  | "authorizing"
  | "selectConnector"
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
  selectedConnector: ConnectorId | null;
  limit: ChargeLimit;
  transactionId: string | null;
  meter: MeterSample | null;
  summary: SessionSummary | null;
}

// Modul-privater Transport (Store spricht nur gegen das Interface):
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
    /**
     * TODO: 
     * Transport erzeugen (VITE_CHARGER_WS -> WebSocketTransport, sonst
     * MockCrowBackend) und transport.onMessage(...) verdrahten:
     *  - BootNotification      -> station setzen; wenn phase "boot" -> "idle"
     *  - StatusNotification    -> connectors[id] aktualisieren
     *  - AuthorizeResponse     -> wenn accepted && phase "authorizing" -> "selectConnector"
     *  - TransactionEvent
     *      Started -> transactionId + meter setzen, phase "charging"
     *      Updated -> meter aktualisieren
     *      Ended   -> meter + summary (inkl. this.limit) setzen, phase "summary"
     */
    connect() {
      // TODO: transport = url ? new WebSocketTransport(url) : new MockCrowBackend();
      // TODO: transport.onMessage((msg) => { ...switch(msg.action)... })
      void transport;
    },

    /** idle -> selectAuth */
    beginAuth() {
      // TODO
    },

    /** Authorize senden, phase -> authorizing (nur aus idle/selectAuth) */
    authorize(_method: AuthMethod) {
      // TODO
    },

    /** Anschluss merken, phase -> configure (nur wenn Available) */
    selectConnector(_id: ConnectorId) {
      // TODO
    },

    /** configure -> selectConnector (Auswahl zurücknehmen) */
    backToConnector() {
      // TODO
    },

    /** Ladeziel bestätigen: RequestStart mit limit senden (nur aus configure) */
    startCharging(_limit: ChargeLimit) {
      // TODO
    },

    /** RequestStop senden, phase -> finishing (nur aus charging) */
    stop() {
      // TODO
    },

    /** Not-Halt: laufende tansaktion sofort stoppen (RequestStop) */
    emergencyAbort() {
      // TODO
    },

    /** Harter reset auf idle (felder leeren, limit -> full) */
    reset() {
      // TODO
    },

    dismissSummary() {
      this.reset();
    },

    /** Abbrechen aus selectAuth/authorizing/selectConnector/configure -> idle */
    cancelAuth() {
    },
  },
});
