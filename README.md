# Übungs-Vorlage — hypercharger HMI

Leeres Gerüst mit klarer Zielstruktur. **Tooling, Design-Tokens, Typen und die
Datei-/API-Struktur sind vorgegeben** — die Implementierung füllst du in den
`// TODO`-Stellen selbst aus. So baust du gegen ein definiertes Ziel statt ins
Blaue.

> Begleitend: der ausführliche Lernplan in `../alpitronic-hmi-clone/CASE-STUDY-PLAN.md`.
> Referenzlösung (nur bei Blockaden anschauen): `../alpitronic-hmi-clone/`.

## Start

```bash
npm install
npm run dev        # läuft sofort — zeigt TODO-Platzhalter
npm run typecheck  # vue-tsc --noEmit (muss grün bleiben)
```

Beim Start siehst du den Geräterahmen mit „boot"-Screen und TODO-Platzhaltern.
Sobald du `store.connect()` + `MockCrowBackend` implementierst, läuft der
Phasenwechsel automatisch.

## Vorgegeben (nicht ändern nötig)

- Build-Tooling: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Design-Fundament: `src/style.css` (OKLCH-Tokens, Fonts, Animations-Klassen)
- **Vertrag:** `src/sim/ocpp.ts` (alle Nachrichten-/Domänentypen)
- **Architektur:** `src/sim/transport.ts` (Interface), `src/App.vue` (Rahmen + Phasen-Routing)
- Store-Form: `Phase`, Interfaces, `state()`, Getter in `src/state/charger.ts`

## Deine TODOs (empfohlene Reihenfolge)

1. **`src/sim/MockCrowBackend.ts`** — Boot/Status/Authorize/Transaktion + Ladekurve + Limit-Stop
2. **`src/state/charger.ts`** — `connect()` (Nachrichten-Handler) + alle Actions
3. **`src/state/format.ts`**, **`useClock.ts`**, **`useFitScale.ts`** — Helfer
4. **`src/components/`** — Screens & Bausteine von oben nach unten:
   - `BatteryRing`, `ConnectorBadge`, `StatusBar`
   - `IdleScreen` → `AuthScreen` → `SelectConnectorScreen` → `ChargeConfigScreen` → `ChargingScreen` → `SummaryScreen`
5. **`src/state/i18n.ts`** — DE/EN-Texte; Komponenten auf `t()` umstellen
6. **`src/state/ui.ts`**, **`useAnnouncer.ts`**, `PhysicalButtons`, `HelpOverlay`, `EmergencyOverlay` — Taster-Funktionen
7. **`src/sim/transport.ts`** — `WebSocketTransport` (optional, für echtes Backend)

## Meilenstein-Checkliste

- [ ] `npm run dev` startet, „boot"-Screen sichtbar
- [ ] `connect()` + Mock → automatischer Wechsel zu `idle`, Anschlüsse „Frei"
- [ ] Kompletter Flow: idle → auth → connector → configure → charging → summary
- [ ] Live-Telemetrie zählt hoch (SoC, kW, kWh, Kosten)
- [ ] Ladeziel **Dauer** und **Preis** stoppen automatisch beim Limit
- [ ] Sprache DE/EN schaltet die ganze UI um
- [ ] Vorlesen / Hilfe / Not-Halt funktionieren
- [ ] `npm run typecheck` grün, keine Konsolenfehler

## Selbstkontrolle

Erkläre nach jedem Meilenstein laut (in 2–3 Sätzen) *warum* du es so gebaut
hast. Genau das fragt die Case Study ab — siehe Fragen-/Trade-off-Abschnitt im
`CASE-STUDY-PLAN.md`.
