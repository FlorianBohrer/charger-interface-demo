import type { InboundMessage, OutboundMessage } from "./ocpp";

/**
 * VORGEGEBEN — die Transport-Abstraktion (dein wichtigstes Architektur-Pattern).
 * Store spricht NUR gegen dieses Interface, nie direkt gegen WebSocket oder Mock.
 */
export interface ChargePointTransport {
  onMessage(cb: (msg: InboundMessage) => void): void;
  send(msg: OutboundMessage): void;
  close(): void;
}

/**
 * TODO: echter WebSocket-Transport zum C++/Crow-Backend.
 * - im Konstruktor `new WebSocket(url)`
 * - "message"-Event parsen (JSON) und an alle Listener weitergeben
 * - send(): nur senden, wenn readyState === OPEN
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
