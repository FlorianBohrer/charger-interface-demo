/**
 * Domänen-Protokoll (OCPP-orientiert): der Typ-Vertrag zwischen Store,
 * Mock-Backend und UI.
 */

export type ConnectorId = "A" | "B";
export type ConnectorType = "CCS" | "CHAdeMO";

export type ConnectorStatus =
  | "Available"
  | "Preparing"
  | "Charging"
  | "SuspendedEV"
  | "Finishing"
  | "Faulted";

export type AuthMethod = "RFID" | "QR" | "App";

/** Ladeziel-Kriterium (Discriminated Union) */
export type ChargeLimit =
  | { mode: "full" }
  | { mode: "duration"; minutes: number }
  | { mode: "price"; eur: number };

/** MeterValues-Sample */
export interface MeterSample {
  soc: number; // %
  powerKw: number; // momentane Leistung
  energyKwh: number; // gelieferte Energie
  voltage: number; // V
  current: number; // A
  durationS: number; // Ladedauer in s
  costEur: number; // bisherige Kosten
}

/** Server -> HMI */
export type InboundMessage =
  | { action: "BootNotification"; stationId: string; model: string; firmware: string }
  | {
      action: "StatusNotification";
      connectorId: ConnectorId;
      connectorType: ConnectorType;
      maxPowerKw: number;
      status: ConnectorStatus;
    }
  | { action: "AuthorizeResponse"; idTag: string; method: AuthMethod; accepted: boolean }
  | {
      action: "TransactionEvent";
      eventType: "Started" | "Updated" | "Ended";
      connectorId: ConnectorId;
      transactionId: string;
      meter: MeterSample;
    };

/** HMI -> Server */
export type OutboundMessage =
  | { action: "Authorize"; method: AuthMethod; idTag: string }
  | { action: "RequestStart"; connectorId: ConnectorId; limit: ChargeLimit }
  | { action: "RequestStop"; transactionId: string };
