# TBA3 Prototypische Rückmeldung im Fach Mathematik Klassenstufe 8

[![Lizenz: MIT](https://img.shields.io/badge/Lizenz-MIT-yellow.svg)](LICENSE)

Eine Webanwendung zur **Aufbereitung von VerA-8-Ergebnisdaten für Lehrkräfte und Schüler:innen**. Die Anwendung
führt Schüler:innen in einer Schritt-für-Schritt-Navigation durch ihre Testergebnisse: Gesamtergebnis, Stärken und
Schwächen nach Kompetenzen/Leitideen, die besten und schlechtesten Aufgaben sowie abschließende Anregungen zur
Weiterarbeit.

Das Projekt ist eine reine **Vue 3 + Vite Single-Page-App** (kein eigenes Backend). Die Testdaten kommen über
generierte API-Clients aus der **TBA3-Schnittstelle** bzw. der **inio-Reportdaten-API**.

> Diese Datei ist die ausführliche technische Dokumentation für Einrichtung, Entwicklung und Nutzung des Projekts.
> Eine kurze Projektübersicht befindet sich in [README.md](README.md).

---

## Inhaltsverzeichnis

1. [Entwicklungsumgebung](#entwicklungsumgebung)
2. [Konfiguration](#konfiguration)
3. [Technologien & Bibliotheken](#technologien--bibliotheken)
4. [Projektstruktur](#projektstruktur)
5. [Anwendungsablauf](#anwendungsablauf)
6. [Composables & fachliche Logik](#composables--fachliche-logik)
7. [TBA3-Schnittstelle](#tba3-schnittstelle)
8. [Tests & Qualitätssicherung](#tests--qualitätssicherung)
9. [Lizenz](#lizenz)

---

## Entwicklungsumgebung

### Voraussetzungen

- [Node.js](https://nodejs.org/) ≥ 20.19 oder ≥ 22.12 (s. `engines` in `package.json`)
- [pnpm](https://pnpm.io/) (via `corepack enable pnpm`)
- Optional: [Docker](https://www.docker.com/) ≥ 24 für die containerisierte Entwicklung
- Optional: Java 21 – nur nötig, wenn die API-Clients neu generiert werden (s. [TBA3-Schnittstelle](#tba3-schnittstelle))

### Einrichtung

Zwei Konfigurationsdateien werden zur Laufzeit bzw. beim Build erwartet und sind **nicht im Repository** enthalten
(s. `.gitignore`, Abschnitt [Konfiguration](#konfiguration)):

```bash
# Laufzeit-Konfiguration der API-Endpunkte aus Vorlage kopieren
cp public/config.example.js public/config.js

# Optional: Umgebungsvariablen/Build-Fallback für den API-Key kopieren
cp .env.example .env
```

Danach die Abhängigkeiten installieren:

```sh
pnpm install
```

### Starten

```sh
# Compile und Hot-Reload für Entwicklung
pnpm run dev
```

- Frontend → [http://localhost:3000](http://localhost:3000)

Alternativ mit Docker – der Container installiert beim Start die Abhängigkeiten und hält sich offen,
`pnpm run dev` wird darin ausgeführt:

```sh
docker compose up -d
docker compose exec node pnpm run dev
```

> Hinweis: `docker-compose.yml` steht in `.gitignore`. Die im Repository liegende Datei dient als Vorlage und kann
> lokal angepasst werden, ohne dass die Änderungen versioniert werden. Das Image wird aus `docker/Dockerfile` gebaut
> (Node 24 Alpine + Java 21 für die API-Client-Generierung).

### Skripte

| Skript                            | Beschreibung                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `pnpm run dev`                    | Dev-Server mit Hot Reload (Port 3000, inkl. API-Proxys)                                   |
| `pnpm run build`                  | Type-Check und Production-Build (`vue-tsc --build` + `vite build`)                        |
| `pnpm run build-only`             | Nur Build, ohne Type-Check                                                                |
| `pnpm run type-check`             | Type-Check via `vue-tsc --build`                                                          |
| `pnpm run preview`                | Vorschau des Production-Builds (Port 4173, inkl. API-Proxys)                              |
| `pnpm run test:unit`              | Unit-Tests mit [Vitest](https://vitest.dev/)                                              |
| `pnpm run lint`                   | Lint mit [oxlint](https://oxc.rs/) und [ESLint](https://eslint.org/), jeweils mit `--fix` |
| `pnpm run format`                 | Formatierung von `src/` mit [Prettier](https://prettier.io/)                              |
| `pnpm run generate:api-resources` | API-Client aus der TBA3-Spezifikation neu generieren                                      |
| `pnpm run generate:api-new`       | API-Client für die inio-Reportdaten neu generieren                                        |
| `pnpm run generate:api-auth`      | API-Client für die inio-Authentifizierung neu generieren                                  |

### Code-Konventionen

- Prettier: keine Semikolons, einfache Anführungszeichen, Zeilenlänge 100 (`.prettierrc.json`)
- Linting: oxlint (Kategorie `correctness` als Fehler, Plugins `eslint`/`typescript`/`unicorn`/`oxc`/`vue`/`vitest`)
  und ESLint mit Vue-/TypeScript-/Vitest-Regeln
- Zeilenumbrüche im Repository sind auf LF normiert (`.gitattributes`)
- Empfohlene VS-Code-Erweiterungen liegen in `.vscode/extensions.json` (Volar, Vitest Explorer, ESLint, oxc, Prettier)

---

## Konfiguration

Die App ist so gebaut, dass die API-Endpunkte **ohne Rebuild** ausgetauscht werden können. Die Datei liegt in
`public/` und ist bewusst nicht versioniert.

### `public/config.js` – Laufzeit-Endpunkte

Wird in `index.html` als klassisches Script eingebunden und setzt `window.appConfig`. Ausgelesen wird sie in
`src/queries/utils.ts`:

```js
window.appConfig = {
    api: {
        baseUrl: '/api-proxy', // TBA3-Referenz-API (@tba3/api-resources)
        inioApiUrl: '/api-inio', // inio-Reportdaten (@tba3/api-new)
        inioAuthApiUrl: '/api-auth', // inio-Authentifizierung (@tba3/api-auth)
        xApiKeySchool: 'TEST', // Header X-API-KEY-SCHOOL
    },
    defaultPageSize: 20,
}
```

Fehlt ein Wert, wird ein leerer `basePath` verwendet, d. h. es wird gegen den eigenen Origin (und damit im
Dev-Betrieb gegen die Vite-Proxys, s. [Dev-Proxys](#dev-proxys)) angefragt. Der API-Key fällt zusätzlich auf
`VITE_X_API_KEY_SCHOOL` und schließlich auf `'TEST'` zurück.

**Ersteinrichtung:** Kopiere für die lokale Entwicklung die Vorlage `public/config.example.js` nach
`public/config.js` und passe die Werte bei Bedarf an.

#### Optional: `.env` als Build-Fallback

Standardmäßig wird der API-Key zur Laufzeit über `public/config.js` geladen (kein Rebuild erforderlich). Falls du
ihn stattdessen zur Build-Zeit fest in das Bundle einbrennen möchtest, kannst du eine `.env`-Datei auf Basis von
`.env.example` anlegen:

```env
VITE_X_API_KEY_SCHOOL=TEST
```

**Sicherheitshinweis zum API-Key:** Da es sich um eine reine Client-Anwendung (Single Page Application) handelt, ist
der `xApiKeySchool` für Endnutzer im Browser jederzeit einsehbar. Trage hier niemals geheime Server-Keys oder
Admin-Credentials ein, sondern ausschließlich dafür vorgesehene Public-/Schul-API-Keys.

### Redaktionelle Texte & Schwellenwerte

Anders als der Name vermuten lässt, ist `src/assets/competence_guidingideas_texts.json` **kein** zur Laufzeit
nachladbares Konfigurationsobjekt, sondern wird aktuell direkt in `App.vue` per statischem Import eingebunden und
damit zur Build-Zeit ins Bundle übernommen. Änderungen an dieser Datei erfordern also einen Rebuild bzw. einen
Neustart des Dev-Servers. Die Datei enthält u. a.:

| Schlüssel                             | Inhalt                                                               |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `competence_texts`                    | Texte und Beschreibungen je Kompetenz `K1`–`K6`                       |
| `guiding_ideas_texts`                 | Texte und Beschreibungen je Leitidee `L1`–`L5`                        |
| `start`                                | Titel und Info-Text des Einstiegs                                    |
| `specialCases`, `specialCasesAdvices` | Texte und Hinweise für auffällige Bearbeitungsmuster                  |
| `overallResult`                       | Rückmeldetexte je Gesamtergebnis-Stufe                                |
| `areas`, `cutOffs`                    | Bereichsgrenzen und Schwellenwerte für die Einordnung der Ergebnisse  |
| `testInfo`                            | Metadaten zum Testheft (Booklet, Fach, Klassenstufe)                  |

Oberflächentexte (Labels, Buttons, feste UI-Strings) liegen dagegen in `src/locales/de.json` und werden über
[Vue I18n](https://vue-i18n.intlify.dev/) eingebunden (s. [`src/i18n.ts`](src/i18n.ts)).

---

## Technologien & Bibliotheken

- [Vue 3](https://vuejs.org/) – JavaScript-Frontend-Framework, Composition API mit `<script setup>`
- [Vite](https://vitejs.dev/) – Dev- und Build-Tool
- [TypeScript](https://www.typescriptlang.org/) – Typisierung, Type-Check via `vue-tsc`
- [Vue Router](https://router.vuejs.org/) – Routing der Schritt-Seiten
- [Pinia](https://pinia.vuejs.org/) – State Management (u. a. Modal-Store)
- [TanStack Query](https://tanstack.com/query/) – Data Fetching und Caching
- [Vue I18n](https://vue-i18n.intlify.dev/) – Oberflächentexte (aktuell nur `de`)
- [Apache ECharts](https://echarts.apache.org/) via [vue-echarts](https://github.com/ecomfe/vue-echarts) – Datenvisualisierung
- [dotLottie für Vue](https://developers.lottiefiles.com/docs/dotlottie-player/) – als Abhängigkeit eingebunden, aktuell aber ohne konkrete `.lottie`-Datei im Einsatz
- [Day.js](https://day.js.org/) – Zeit-/Dauerberechnungen
- [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) – SVGs als Vue-Komponenten (`?component`)
- [OpenAPI Generator](https://openapi-generator.tech/) – Erzeugung der API-Clients (`typescript-fetch`)
- [Vitest](https://vitest.dev/) mit [Vue Test Utils](https://test-utils.vuejs.org/) und [jsdom](https://github.com/jsdom/jsdom) – Unit-/Komponententests
- [oxlint](https://oxc.rs/) und [ESLint](https://eslint.org/) – Linting, [Prettier](https://prettier.io/) – Formatierung

---

## Projektstruktur

Das Repository ist ein **pnpm-Workspace**: die App liegt im Wurzelverzeichnis, die generierten API-Clients in
`packages/`.

```
.
├── src/                # Vue-3-App
├── packages/           # Generierte API-Clients (pnpm-Workspace)
│   ├── api-resources/  # @tba3/api-resources – TBA3-Referenz-API
│   ├── api-new/        # @tba3/api-new       – inio-Reportdaten
│   └── api-auth/       # @tba3/api-auth      – inio-Authentifizierung
├── public/             # Statische Assets, config.js (Vorlage: config.example.js, nicht versioniert), Firmenlogo
├── docker/
│   ├── Dockerfile              # Node 24 + pnpm + Java (für die Client-Generierung)
│   └── development.entrypoint  # pnpm install und Container offen halten
├── docker-compose.yml  # Dev-Container (Vorlage, lokal nicht versioniert)
├── .env.example        # Vorlage für Build-Umgebungsvariablen
├── vite.config.ts      # Build, Alias @ → src, Dev-/Preview-Proxys
├── vitest.config.ts    # Test-Setup (jsdom)
├── LICENSE                     # MIT-Lizenz für den Quellcode
├── LICENSE-CC-BY-SA-4.0.txt    # Lizenz für eigene Illustrationen
├── LICENSES.md                 # Übersicht, welcher Projektteil unter welcher Lizenz steht
└── README2.md           # Diese ausführliche technische Dokumentation
```

### App-Struktur

```
src/
├── views/          # Seiten der Schritt-Navigation (eine pro Route)
├── components/     # Wiederverwendbare Komponenten (u. a. SideModal)
├── composables/    # Datenbeschaffung und fachliche Auswertung (use*.ts)
├── queries/        # API-Konfiguration (Basis-URLs, API-Key)
├── stores/         # Pinia-Stores (u. a. Modal-Store)
├── router/         # Routendefinition der Schritte 1–7
├── locales/        # Übersetzungen (de.json)
├── themes/         # Fonts, Farbvariablen, Icons/Illustrationen
├── assets/         # SVGs, Styles, Textvorlage (competence_guidingideas_texts.json)
├── types.ts        # Fachliche Typen und Mappings (Kompetenzen, Leitideen, Stufen)
├── i18n.ts         # Vue-I18n-Setup
└── main.ts         # App-Bootstrap (Pinia, Router, Vue Query, I18n)
```

### Komponenten- und View-Struktur

Views und Komponenten liegen jeweils in einem **eigenen Unterordner** nach demselben Muster:

```
KomponentenName/
├── KomponentenName.vue   # Komponente (Composition API, <script setup>)
├── styles.module.css     # Lokale CSS-Module-Styles
└── icons/                # Nur von dieser Komponente genutzte Icons/Bilder
```

Übergreifende Styles liegen bewusst außerhalb: `src/themes/` (Fonts, Farb- und Designvariablen) sowie
`src/assets/styles/base.css` (Basis-Styles). SVG-Icons werden über `vite-svg-loader` als Komponenten importiert:

```ts
import InfoIcon from '@/themes/icons/info.svg?component'
```

**Kernprinzip:** Views holen die Daten über Composables und geben sie als Props an die Darstellungskomponenten
weiter.

---

## Anwendungsablauf

Die Rückmeldung ist als lineare Abfolge von sieben Schritten aufgebaut (`src/router/index.ts`). Der Code der
Schüler:in wird als Query-Parameter `?user=<code>` durch die Schritte mitgeführt (gesetzt beim Start in
`HomeView`, ausgelesen z. B. in `App.vue` über `route.query.user`).

| Route     | View                          | Inhalt                                                                    |
| --------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `/` → `/step-1` | `HomeView`               | Auswahl/Eingabe des Test-Codes und Einstieg                               |
| `/step-2` | `ConclusionView`              | „Zusammenfassung" – Gesamtergebnis                                       |
| `/step-3` | `ClassResultsSubTopicsView`   | „Ergebnisse der Klasse in Teilbereichen" – Klassenvergleich je Leitidee   |
| `/step-4` | `ResultsInDetailView`         | „Ergebnisse im Detail" – Auswertung je Kompetenz/Leitidee, Vergleichswerte |
| `/step-5` | `BestExercisesView`           | „Top Aufgaben" – die am besten gelösten Aufgaben                          |
| `/step-6` | `WorstExercisesView`          | „Flop Aufgaben" – Aufgaben mit dem größten Übungsbedarf                   |
| `/step-7` | `IdeasForFutureView`          | „Anregungen zur Weiterarbeit" – Abschluss mit Übungshinweisen             |

Die Schrittfolge wird über `src/composables/useNavigation.ts` bereitgestellt und von der Fußzeile in `App.vue` für
die Seitenindikatoren sowie die Vor-/Zurück-Navigation (`goNext`/`goBack`) verwendet.

---

## Composables & fachliche Logik

| Composable             | Aufgabe                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `useUserItems`         | Items einer Schüler:in laden (`useUserItemsNew`), Trefferquote berechnen, Schulform (`useSchoolForm`) und Testdaten (`useTestData`) |
| `useCompetencesNew`    | Auswertung je Kompetenz `K1`–`K6` inkl. Top-Performer                                             |
| `useGuidingIdeasNew`   | Auswertung je Leitidee `L1`–`L5`, Top- und schwache Bereiche                                      |
| `useOverallResultsNew` | Gesamtscore und Zuordnung zu einer Rückmeldestufe                                                 |
| `useSpecialCasesNew`   | Auffälligkeiten wie Bearbeitungsdauer und Anteil nicht bearbeiteter Aufgaben, Nutzerkennzahlen (`useUserProperties`) |
| `useClassStatsNew`     | Aggregierte Klassenkennzahlen für den Klassenvergleich                                            |
| `useAggregations`      | Rohdaten-Aggregationen (Leitideen, Kompetenzen, Kompetenzstufen, kognitive Anforderungsniveaus)   |
| `useNavigation`        | Bereitstellung der Schrittfolge (`allSteps`) für Router-Fußzeile und Navigation                   |

Die Varianten ohne `New`-Suffix (`useCompetences`, `useGuidingIdeas`, `useOverallResults`, `useSpecialCases`) sind
ältere Implementierungen gegen die TBA3-Referenz-API und bleiben zu Vergleichszwecken im Code erhalten. Aktiv
verwendet werden die `New`-Varianten gegen die inio-Reportdaten.

---

## TBA3-Schnittstelle

Die TBA3-Schnittstelle soll die Daten für Abbildungen möglichst standardisieren. Die Schnittstelle muss zwingend für
Abbildungen bedient werden (Projektziel von TBA3).

### Dokumentation

Die Dokumentation der Schnittstelle liegt hier vor: https://apps.indibit.eu/tba3-api/docs

### Mock Server

Beispieldaten können hier abgerufen werden: https://apps.indibit.eu/tba3-api

### API-Clients

Die Clients werden **nicht von Hand geschrieben**, sondern mit dem OpenAPI Generator (`typescript-fetch`) aus den
jeweiligen Spezifikationen erzeugt und als Workspace-Pakete eingebunden. Jedes Paket enthält unter `src/` die Ordner
`apis/`, `models/` und `docs/` sowie `runtime.ts`.

| Paket                 | Spezifikation                                       | Neu generieren                    |
| ---------------------- | ------------------------------------------------------ | ------------------------------------ |
| `@tba3/api-resources` | `github.com/indibit-eu/tba3` → `tba3-spec.yml`        | `pnpm run generate:api-resources` |
| `@tba3/api-new`       | `https://api.inio.de/swagger/report_data_tba3.json`   | `pnpm run generate:api-new`       |
| `@tba3/api-auth`      | `https://api.inio.de/swagger/auth.json`               | `pnpm run generate:api-auth`      |

Die Generierung benötigt **Java 21** (der OpenAPI Generator ist ein Java-Tool); das Dev-Image in `docker/Dockerfile`
bringt es bereits mit. Die erzeugten Dateien werden anschließend automatisch mit Prettier formatiert. Generierter
Code sollte nicht manuell verändert werden – stattdessen die Spezifikation anpassen und neu generieren.

### Dev-Proxys

Um CORS im Entwicklungsbetrieb zu umgehen, leitet Vite drei Pfade weiter (identisch konfiguriert für `dev` und
`preview`, s. `vite.config.ts`):

| Pfad         | Ziel                                    | Verwendet von         |
| ------------- | ------------------------------------------ | ------------------------ |
| `/api-proxy` | `https://apps.indibit.eu/tba3-api/`     | `@tba3/api-resources` |
| `/api-inio`  | `https://api.inio.de/report_data_tba3`  | `@tba3/api-new`       |
| `/api-auth`  | `https://api.inio.de/report_data_tba3`  | `@tba3/api-auth`      |

Im Production-Betrieb müssen die Endpunkte stattdessen über `public/config.js` als absolute URLs gesetzt werden.

---

## Tests & Qualitätssicherung

Die Anwendung nutzt **Vitest** in Kombination mit **Vue Test Utils** und **jsdom** für Unit- und Komponententests.

### Commands

```sh
pnpm run test:unit            # Führt alle Unit-Tests einmalig aus
pnpm run test:unit --watch    # Watch-Modus für die lokale Entwicklung
pnpm run test:unit --coverage # Erstellt den Coverage-Bericht (html/text)
pnpm run type-check           # TypeScript Typprüfung via vue-tsc
pnpm run lint                 # Linter-Prüfung und automatische Fixes (oxlint/ESLint)
```

> Hinweis: Auf diesem Stand des Repositories liegen noch keine Testdateien unter `src/`. Neue Tests können nach dem
> Vitest-Standard (`*.spec.ts`/`*.test.ts`, z. B. neben der zu testenden Komponente oder in einem `__tests__/`-Ordner)
> ergänzt werden – `vitest.config.ts` ist bereits mit `jsdom`-Umgebung vorkonfiguriert.

### Empfohlener Scope für künftige Tests

- **Komponenten (`src/components/`)**: Visualisierung, Accessibility (Focus Traps, ARIA-Attribute), Event-Handling
  (z. B. `SideModal`).
- **Store & Routing (`src/stores/`, `src/router/`)**: Pinia-Zustandsänderungen und Navigation.
- **Composables (`src/composables/`)**: Geschäftslogik, Daten-Aggregation und Berechnungen.

---

## Lizenz

Der **Quellcode** steht unter der [MIT-Lizenz](LICENSE), eigene **Illustrationen** unter
[CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0.txt). Welche Datei unter welcher Lizenz steht, listet [`LICENSES.md`](LICENSES.md)
auf – dort ist auch das Firmenlogo als Marke von beiden Lizenzen ausgenommen.

Die eingebundenen Schriftarten Inter und League Spartan stehen unter der SIL Open Font License 1.1
(`src/themes/fonts/OFL.txt`). Eine Übersicht der Lizenzen aller genutzten npm-Pakete findet sich ebenfalls in
[`LICENSES.md`](LICENSES.md); eine vollständige, automatisch erzeugte Liste liefert `pnpm licenses list --long`.
