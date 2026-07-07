import type { InboundMessage, OutboundMessage } from "./ocpp";

/**
 * Transport-Abstraktion: der Store spricht nur gegen dieses Interface,
 * nie direkt gegen WebSocket oder Mock-Backend.
 */
export interface ChargePointTransport {
  onMessage(cb: (msg: InboundMessage) => void): void;
  send(msg: OutboundMessage): void;
  close(): void;
}

/**
 * Echter WebSocket-Transport zum C++/Crow-Backend – noch nicht angebunden,
 * bis dahin läuft die App gegen das MockCrowBackend.
 */
export class WebSocketTransport implements ChargePointTransport {
  // private ws: WebSocket;
  // private listeners: ((m: InboundMessage) => void)[] = [];

  constructor(_url: string) {
    // TODO
  }
  onMessage(_cb: (msg: InboundMessage) => void) {
    // TODO
  }
  send(_msg: OutboundMessage) {
    // TODO
  }
  close() {
    // TODO
  }
}
