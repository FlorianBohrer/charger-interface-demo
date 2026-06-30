# Fortschritt & Aufbau — Charger HMI (Übung)

Stand: Vue 3 + TypeScript + Pinia + Tailwind. EV-Lader-Touch-HMI, selbst nachgebaut.
Diese Datei = dein Wiedereinstiegspunkt.

---

## 1. Aufbau in 3 Schichten

```
Komponenten (Screens)   ← was man SIEHT, "dumm": zeigt an + meldet Klicks
        ▲ State            ▼ Action
Store (Pinia)           ← das GEHIRN: Zustand (phase, meter …) + Logik
        ▲ onMessage        ▼ send()
Mock-Backend            ← simulierte Ladesäule, schickt OCPP-Nachrichten
```

- **🔻 runter** = Nutzer-Aktion: Komponente ruft Store-Action → ggf. `transport.send()`
- **🔺 rauf** = Daten: Backend → `onMessage` → Store-State → Screen rendert automatisch neu
- **`phase`** (Zustandsautomat) entscheidet, welcher Screen sichtbar ist:
  `boot → idle → selectAuth → authorizing → selectConnector → configure → charging → finishing → summary`

---

## 2. Dateibaum

```
src/
├─ App.vue                  Geräterahmen, Kiosk-Skalierung, Phasen-Routing
├─ style.css                Design-Tokens (OKLCH), Fonts, Animationen
├─ sim/
│  ├─ ocpp.ts               Typen / "Vertrag" (Nachrichten, ChargeLimit, MeterSample)
│  ├─ transport.ts          ChargePointTransport-Interface + WebSocketTransport (TODO)
│  └─ MockCrowBackend.ts    simulierte Ladesäule (Boot, Auth, Ladekurve, Limit-Stop)
├─ state/
│  ├─ charger.ts            Haupt-Store: Zustandsautomat + Actions
│  ├─ ui.ts                 UI-Store: Sprache, TTS, Overlays
│  ├─ i18n.ts               Übersetzungen DE/EN + t()
│  ├─ format.ts             formatDuration / formatEur / formatClock
│  ├─ useClock.ts           reaktive Uhr (Intervall + Cleanup)
│  ├─ useFitScale.ts        Kiosk-Skalierung (ResizeObserver)
│  └─ useAnnouncer.ts       Vorlesen / TTS  (noch TODO)
└─ components/
   ├─ StatusBar.vue         Kopfzeile: Logo, Status-Punkte, WLAN, Uhr
   ├─ PhysicalButtons.vue   4 Taster: Vorlesen / Sprache / Hilfe / Not-Halt
   ├─ ConnectorBadge.vue    Anschluss-Karte (Datenkarte)
   ├─ BatteryRing.vue       SVG-SoC-Ring
   ├─ IdleScreen.vue        Begrüßung + Anschlüsse + CTA
   ├─ AuthScreen.vue        Methodenwahl (+ Empfohlen-Tag, Hover)
   ├─ QrScan.vue            QR-Scan-Animation + Erfolg
   ├─ SelectConnectorScreen.vue
   ├─ ChargeConfigScreen.vue  Ladeziel: Voll / Dauer / Preis + Stepper
   ├─ ChargingScreen.vue      Live-Telemetrie
   ├─ SummaryScreen.vue       Abschluss-Zusammenfassung
   ├─ HelpOverlay.vue
   └─ EmergencyOverlay.vue
```

---

## 3. Status

### ✅ Fertig
- Engine: `ocpp.ts`, `transport.ts` (Interface), `MockCrowBackend.ts` (Boot/Auth/Ladekurve/Limit-Stop)
- Store `charger.ts`: Zustandsautomat + alle Actions + `authorized`-Beat
- Helfer: `format.ts`, `useClock.ts`, `useFitScale.ts`
- `ui.ts` (Sprache/TTS/Overlays), App-Shell + Phasen-Routing
- Komponenten: StatusBar, PhysicalButtons, ConnectorBadge, BatteryRing,
  IdleScreen, AuthScreen, QrScan, SelectConnectorScreen, ChargeConfigScreen,
  HelpOverlay, EmergencyOverlay
- ChargingScreen: Zone 1 (Status) + Zone 2 (Ring + Live-Werte)

### 🚧 In Arbeit / offen
- **SummaryScreen** — nur die Energie-Karte da; siehe Bugs unten
- **ChargingScreen Zone 3** — „Laden beenden"-Button (`@click="store.stop()"`, `:disabled="phase !== 'charging'"`)
- **i18n** — nur `idle.eyebrow` gefüllt; Kataloge DE/EN vervollständigen + Screens auf `t()` umstellen
- **useAnnouncer.ts** — noch leer (Vorlesen spricht noch nicht; `watch(..., { flush: 'post' })` + try/catch)
- **WebSocketTransport** — optional, echtes Backend

---

## 4. Offene Bugs / Morgen-Start (SummaryScreen)
In `SummaryScreen.vue`:
- Tippfehler `flex fel-col` → `flex flex-col`
- „Ladevorgang abgeschlossem" → „abgeschlossen"
- ungenutzte Imports raus: `CircleCheck`, `BatteryChargingIcon`
- Erfolgs-Kästchen: `border border-hyc-accent/30` ergänzen (sonst randlos)
- **fehlt noch:** Karte „Dauer" (`formatDuration(summary.durationS)`),
  Karte „Kosten" (`formatEur(summary.costEur)`), und der **„Fertig"-Button**
  (`@click="store.dismissSummary()"`)
- den großen auskommentierten Block am Dateiende kannst du löschen
- danach `npm run typecheck`

---

## 5. Wichtigste Lektionen (selbst erarbeitet)
1. **Store = Logik, Komponenten = dumm.** Props rein ↓, Events raus ↑.
2. **Transport hinter Interface** → Mock ↔ echter WebSocket austauschbar.
3. **Discriminated Unions** (`status`, `ChargeLimit`) statt Booleans bei 3+ Zuständen.
4. **`watch(..., { flush: 'post' })` + try/catch** beim TTS — sonst friert die View ein.
5. **Tailwind-Klassen brauchen `class="…"`** — nackte Attribute wirken nicht.
6. **Vue-Bindings behalten `:` / `@`** (`:size`, `@click`) — nicht in `class`.
7. **`v-if` mit nie-wahrer Bedingung** = leerer Screen (z. B. `v-if="summary"` auf der falschen Phase).
8. **Datei-Casing** muss exakt stimmen (`QrScan.vue`, nicht `QRScan.vue`).
9. **Vor dem Einfügen: Editor-Tab prüfen** — „falsche Datei" war der häufigste Zeitfresser.

---

## 6. Befehle
```bash
npm run dev         # Dev-Server
npm run typecheck   # vue-tsc --noEmit  (muss grün sein)
```

---

## 7. Kompletter Flow (zum Testen)
Idle → „Laden starten" → Auth (QR-Code → Scan-Animation) → Anschluss wählen
→ Ladeziel (Voll/Dauer/Preis) → Laden (live, Limit-Stop) → Zusammenfassung → „Fertig" → Idle.
