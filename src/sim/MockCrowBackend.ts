import type { ChargePointTransport } from "./transport";
import type { InboundMessage, OutboundMessage } from "./ocpp";

/**
 * TODO — Simulierter Charge-Controller (Stellvertreter für C++/Crow).
 * Er soll exakt die OCPP-Nachrichten aus ocpp.ts über onMessage emittieren.
 *
 * Empfohlene Konstanten:
 *   TARIFF_EUR_PER_KWH = 0.59 · MAX_POWER_KW = 400 · BATTERY_KWH = 77 · TICK_MS = 250
 *   Demo-Zeitraffer: speed = 60 (sonst dauert Laden zu lange)
 *
 * Verhalten, das du implementieren musst:
 *  1) Konstruktor: nach ~50 ms BootNotification + StatusNotification (A=CCS/400, B=CHAdeMO/200, "Available") emittieren.
 *  2) send():
 *     - "Authorize"       -> nach ~900 ms AuthorizeResponse { accepted: true }
 *     - "RequestStart"    -> Transaktion starten (Status "Charging", TransactionEvent "Started"), Tick-Timer starten
 *     - "RequestStop"     -> Transaktion beenden (TransactionEvent "Ended", Status "Finishing" -> nach 4 s "Available")
 *  3) Tick (alle TICK_MS):
 *     - Leistung nach SoC (Tapering): voll bis ~55 %, danach fallend, hart ab ~80 %
 *     - energyKwh, soc, durationS, costEur fortschreiben
 *     - STOP-Bedingung prüfen: soc>=100 ODER Ladeziel erreicht
 *         duration: durationS >= minutes*60   |   price: costEur >= eur
 *     - jeweils TransactionEvent "Updated" mit aktuellem MeterSample emittieren
 *  4) Tipp: emit() mit queueMicrotask() umschließen, um WS-Zustellung zu imitieren.
 */
export class MockCrowBackend implements ChargePointTransport {
  private listeners: ((m: InboundMessage) => void)[] = [];

  constructor() {
    // TODO: Boot + initiale Connector-Stati emittieren (mit kleinem setTimeout)
  }

  onMessage(cb: (msg: InboundMessage) => void) {
    this.listeners.push(cb);
  }

  send(_msg: OutboundMessage) {
    // TODO: Authorize / RequestStart / RequestStop behandeln
  }

  close() {
    this.listeners = [];
    // TODO: laufenden Timer stoppen
  }

  // Tipp: private emit(msg: InboundMessage) {
  //   queueMicrotask(() => this.listeners.forEach((l) => l(msg)));
  // }
}
