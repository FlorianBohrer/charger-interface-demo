# Architektur — Charger HMI

Touch-HMI für einen DC-Schnelllader (Hypercharger-Stil).
Stack: **Vue 3 + TypeScript + Pinia + Tailwind (v4)**, Vite.

---

## 1. Drei Schichten

```
Komponenten (Screens)   ← Darstellung: zeigt State an, meldet Klicks
        ▲ State            ▼ Action
Store (Pinia)           ← Zustand (phase, meter …) + Logik
        ▲ onMessage        ▼ send()
Backend-Transport       ← MockCrowBackend (Sim) oder WebSocket (echt)
```

- **runter** = Nutzer-Aktion: Komponente ruft Store-Action → ggf. `transport.send()`
- **rauf** = Daten: Backend → `onMessage` → Store-State → Screen rendert neu
- **`phase`** (Zustandsautomat) steuert den sichtbaren Screen:
  `boot → idle → selectAuth → authorizing → selectConnector → configure → charging → finishing → summary`

Der Store spricht ausschließlich gegen das `ChargePointTransport`-Interface —
so ist die simulierte Ladesäule gegen ein echtes Crow/WebSocket-Backend austauschbar.

---

## 2. Dateibaum

```
src/
├─ App.vue                  Geräterahmen, Kiosk-Skalierung, Phasen-Routing
├─ style.css                Design-Tokens (OKLCH), Fonts, Animationen
├─ sim/
│  ├─ ocpp.ts               Typen (Nachrichten, ChargeLimit, MeterSample)
│  ├─ transport.ts          ChargePointTransport-Interface + WebSocketTransport
│  └─ MockCrowBackend.ts    simulierte Ladesäule (Boot, Auth, Ladekurve, Limit-Stop)
├─ state/
│  ├─ charger.ts            Haupt-Store: Zustandsautomat + Actions
│  ├─ ui.ts                 UI-Store: Sprache, TTS, Overlays
│  ├─ i18n.ts               Übersetzungen DE/EN + t()
│  ├─ format.ts             formatDuration / formatEur / formatClock
│  ├─ useClock.ts           reaktive Uhr (Intervall + Cleanup)
│  ├─ useFitScale.ts        Kiosk-Skalierung (ResizeObserver)
│  └─ useAnnouncer.ts       Vorlesen / TTS
├─ composables/
│  └─ useTariff.ts          Live-Börsenstrompreis (aWATTar) mit Fallback
└─ components/
   ├─ StatusBar.vue         Kopfzeile: Logo, Status-Punkte, WLAN, Uhr
   ├─ PhysicalButtons.vue   4 Taster: Vorlesen / Sprache / Hilfe / Not-Halt
   ├─ StationSchematic.vue  Ladesäule als Abbild, Docks A/B, Live-Preis
   ├─ ConnectorBadge.vue    Anschluss-Karte
   ├─ BatteryRing.vue       SVG-SoC-Ring
   ├─ ChargeCurve.vue       animierte Ladekurve (Leistung über SoC)
   ├─ ParticleField.vue     Canvas-Partikel-Hintergrund (touch-reaktiv)
   ├─ IdleScreen.vue        Begrüßung + Ladesäule + CTA
   ├─ AuthScreen.vue        Methodenwahl
   ├─ QrScan.vue            QR-Scan-Animation
   ├─ SelectConnectorScreen.vue
   ├─ ChargeConfigScreen.vue  Ladeziel: Voll / Dauer / Preis
   ├─ ChargingScreen.vue      Live-Telemetrie + Ladekurve
   ├─ SummaryScreen.vue       Abschluss-Zusammenfassung
   ├─ HelpOverlay.vue
   └─ EmergencyOverlay.vue
```

---

## 3. Status

**Umgesetzt:** Engine (`ocpp`, `transport`-Interface, `MockCrowBackend`),
Store mit Zustandsautomat, Kiosk-Shell + Phasen-Routing, alle Screens inkl.
Ladesäulen-Ansicht, animierter Ladekurve, Live-Strompreis und Partikel-Hintergrund.

**Offen:** i18n-Kataloge DE/EN vervollständigen und Screens auf `t()` umstellen,
TTS in `useAnnouncer.ts`, echter `WebSocketTransport` gegen ein Crow-Backend.

---

## 4. Design für Outdoor-Touch

22"-Screen, pralle Sonne → große Touch-Flächen, hoher Kontrast, dicke Icon-Strokes.
`prefers-reduced-motion` wird für Animationen und den Partikel-Hintergrund respektiert.

---

## 5. Befehle

```bash
npm run dev         # Dev-Server
npm run typecheck   # vue-tsc --noEmit
```

## 6. Flow

Idle → „Laden starten" → Auth (QR-Scan) → Anschluss wählen → Ladeziel
(Voll/Dauer/Preis) → Laden (live, Limit-Stop) → Zusammenfassung → Idle.
