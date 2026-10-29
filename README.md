# TBA3 Prototypische Rückmeldung im Fach Mathematik Klassenstufe 8

[![Lizenz: MIT](https://img.shields.io/badge/Lizenz-MIT-yellow.svg)](LICENSE)

Eine Webanwendung zur **Aufbereitung von VerA-8-Ergebnisdaten für Lehrkräfte und Schüler:innen**. Die Anwendung
führt Schüler:innen in einer Schritt-für-Schritt-Navigation durch ihre Testergebnisse: Gesamtergebnis, Stärken und
Schwächen nach Kompetenzen/Leitideen, die besten und schlechtesten Aufgaben sowie abschließende Anregungen zur
Weiterarbeit.

Das Projekt ist eine reine **Vue 3 + Vite Single-Page-App** (kein eigenes Backend). Die Testdaten kommen über
generierte API-Clients aus der **TBA3-Schnittstelle** bzw. der **inio-Reportdaten-API**.

> Diese Datei ist die ausführliche technische und inhaltliche Dokumentation für Einrichtung, Entwicklung und Nutzung des Projekts.
> Eine kurze Projektübersicht befindet sich in [README.md](README.md).

* [Technische Dokumentation](#technische-dokumentation)
* [Inhaltliche Dokumentation](#inhaltliche-dokumentation)

---

## Technische Dokumentation

### Inhaltsverzeichnis

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

### Entwicklungsumgebung

#### GitHub Pages

Der Workflow `.github/workflows/deploy-pages.yml` baut und veroeffentlicht die App
bei einem Push nach `main` oder manuell ueber GitHub Actions, analog zum Projekt
`report-outermedia`. In GitHub unter **Settings > Pages > Build and deployment**
die Quelle **GitHub Actions** auswaehlen.

Der Build verwendet den Repository-Namen als Basispfad und aktiviert nur fuer
GitHub Pages Hash-Routing. Dadurch funktionieren direkte Links und Reloads
wie `/kompetenzstand-mathematik-klassenbericht/#/login` ohne serverseitige
SPA-Rewrites. Lokale Entwicklung und bisherige Deployments behalten ihre
normalen Routen.

Die Laufzeit-Konfiguration wird im Workflow aus `public/config.example.js`
erstellt. Auf GitHub Pages werden die oeffentlichen API-Endpunkte direkt
angesprochen; Vite-Proxys sind dort nicht verfuegbar. Die APIs muessen CORS fuer
`https://kompetenztestde.github.io` erlauben, einschliesslich der Header
`Authorization`, `Content-Type` und `X-API-KEY-SCHOOL`.

Keine geheimen Zugangsdaten in die Konfiguration oder in `VITE_*`-Variablen
eintragen: Beide sind im Browser oeffentlich sichtbar. Vor der Freigabe muss
serverseitig bestaetigt sein, dass der Demo-Zugang ausschliesslich
oeffentliche, synthetische Daten liefert.

#### Voraussetzungen

- [Node.js](https://nodejs.org/) ≥ 20.19 oder ≥ 22.12 (s. `engines` in `package.json`)
- [pnpm](https://pnpm.io/) (via `corepack enable pnpm`)
- Optional: [Docker](https://www.docker.com/) ≥ 24 für die containerisierte Entwicklung
- Optional: Java 21 – nur nötig, wenn die API-Clients neu generiert werden (s. [TBA3-Schnittstelle](#tba3-schnittstelle))

#### Einrichtung

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

#### Starten

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

#### Skripte

| Skript                            | Beschreibung                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
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

#### Code-Konventionen

- Prettier: keine Semikolons, einfache Anführungszeichen, Zeilenlänge 100 (`.prettierrc.json`)
- Linting: oxlint (Kategorie `correctness` als Fehler, Plugins `eslint`/`typescript`/`unicorn`/`oxc`/`vue`/`vitest`)
  und ESLint mit Vue-/TypeScript-/Vitest-Regeln
- Zeilenumbrüche im Repository sind auf LF normiert (`.gitattributes`)
- Empfohlene VS-Code-Erweiterungen liegen in `.vscode/extensions.json` (Volar, Vitest Explorer, ESLint, oxc, Prettier)

---

### Konfiguration

Die App ist so gebaut, dass die API-Endpunkte **ohne Rebuild** ausgetauscht werden können. Die Datei liegt in
`public/` und ist bewusst nicht versioniert.

#### `public/config.js` – Laufzeit-Endpunkte

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

##### Optional: `.env` als Build-Fallback

Standardmäßig wird der API-Key zur Laufzeit über `public/config.js` geladen (kein Rebuild erforderlich). Falls du
ihn stattdessen zur Build-Zeit fest in das Bundle einbrennen möchtest, kannst du eine `.env`-Datei auf Basis von
`.env.example` anlegen:

```env
VITE_X_API_KEY_SCHOOL=TEST
```

**Sicherheitshinweis zum API-Key:** Da es sich um eine reine Client-Anwendung (Single Page Application) handelt, ist
der `xApiKeySchool` für Endnutzer im Browser jederzeit einsehbar. Trage hier niemals geheime Server-Keys oder
Admin-Credentials ein, sondern ausschließlich dafür vorgesehene Public-/Schul-API-Keys.

#### Redaktionelle Texte & Schwellenwerte

Anders als der Name vermuten lässt, ist `src/assets/competence_guidingideas_texts.json` **kein** zur Laufzeit
nachladbares Konfigurationsobjekt, sondern wird aktuell direkt in `App.vue` per statischem Import eingebunden und
damit zur Build-Zeit ins Bundle übernommen. Änderungen an dieser Datei erfordern also einen Rebuild bzw. einen
Neustart des Dev-Servers. Die Datei enthält u. a.:

| Schlüssel                             | Inhalt                                                               |
| ------------------------------------- | -------------------------------------------------------------------- |
| `competence_texts`                    | Texte und Beschreibungen je Kompetenz `K1`–`K6`                      |
| `guiding_ideas_texts`                 | Texte und Beschreibungen je Leitidee `L1`–`L5`                       |
| `start`                               | Titel und Info-Text des Einstiegs                                    |
| `specialCases`, `specialCasesAdvices` | Texte und Hinweise für auffällige Bearbeitungsmuster                 |
| `overallResult`                       | Rückmeldetexte je Gesamtergebnis-Stufe                               |
| `areas`, `cutOffs`                    | Bereichsgrenzen und Schwellenwerte für die Einordnung der Ergebnisse |
| `testInfo`                            | Metadaten zum Testheft (Booklet, Fach, Klassenstufe)                 |

Oberflächentexte (Labels, Buttons, feste UI-Strings) liegen dagegen in `src/locales/de.json` und werden über
[Vue I18n](https://vue-i18n.intlify.dev/) eingebunden (s. [`src/i18n.ts`](src/i18n.ts)).

---

### Technologien & Bibliotheken

- [Vue 3](https://vuejs.org/) – JavaScript-Frontend-Framework, Composition API mit `<script setup>`
- [Vite](https://vitejs.dev/) – Dev- und Build-Tool
- [TypeScript](https://www.typescriptlang.org/) – Typisierung, Type-Check via `vue-tsc`
- [Vue Router](https://router.vuejs.org/) – Routing der Schritt-Seiten
- [Pinia](https://pinia.vuejs.org/) – State Management (u. a. Modal-Store)
- [TanStack Query](https://tanstack.com/query/) – Data Fetching und Caching
- [Vue I18n](https://vue-i18n.intlify.dev/) – Oberflächentexte (aktuell nur `de`)
- [Apache ECharts](https://echarts.apache.org/) via [vue-echarts](https://github.com/ecomfe/vue-echarts) – Datenvisualisierung
- [Day.js](https://day.js.org/) – Zeit-/Dauerberechnungen
- [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) – SVGs als Vue-Komponenten (`?component`)
- [OpenAPI Generator](https://openapi-generator.tech/) – Erzeugung der API-Clients (`typescript-fetch`)
- [Vitest](https://vitest.dev/) mit [Vue Test Utils](https://test-utils.vuejs.org/) und [jsdom](https://github.com/jsdom/jsdom) – Unit-/Komponententests
- [oxlint](https://oxc.rs/) und [ESLint](https://eslint.org/) – Linting, [Prettier](https://prettier.io/) – Formatierung

---

### Projektstruktur

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
└── LICENSES.md                 # Übersicht, welcher Projektteil unter welcher Lizenz steht
```

#### App-Struktur

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

#### Komponenten- und View-Struktur

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

### Anwendungsablauf

#### Anmeldung und Klassenauswahl

Nach einem erfolgreichen regulären Login wird zunächst `/class-selection` geöffnet.
Die Klassenauswahl ist als zweiter Schritt in das Login-Layout integriert und ersetzt dort
das Anmeldeformular; Projektinformationen und Logos bleiben sichtbar. Die Auswahl lädt
`/test-groups/270/participated-groups` und `/test-groups/270/tests` über die konfigurierte inio-API
mit dem Bearer-Token der Anmeldung.
Angezeigt werden ausschließlich Klassen mit `groupLevel = 8`, die mindestens an einem Test mit
`subject = Mathematik` und `gradeLevel = 8` teilgenommen haben. Ein Klick auf den Klassennamen
übernimmt die `groupId` und den zugehörigen Mathematiktest. Bei mehreren passenden Tests wird
zusätzlich das Testheft ausgewählt. Ladefehler können erneut versucht werden; ohne passende
Klassen wird ein ausdrücklicher Hinweis angezeigt.

Klasse und Test werden in `sessionStorage` gespeichert und in allen inio-Reportabfragen verwendet.
Ohne Auswahl ist kein Berichtsschritt erreichbar. Die Query-Cache-Schlüssel enthalten Schule,
Klasse und Test, sodass die Daten unterschiedlicher Berichte getrennt bleiben. Abmelden und
ein neuer Login löschen die Auswahl. Der Demo-Zugang überspringt die Auswahl und verwendet
weiterhin die Fixture-IDs `groupId = 1001` und `testId = 9524`.

Im regulären Bericht öffnet „Klasse wechseln“ die Auswahl erneut, ohne die Sitzung zu beenden.
Wenn nur eine passende Klasse verfügbar ist, wird sie automatisch übernommen und
„Klasse wechseln“ ausgeblendet. Bei mehreren Mathematiktests dieser Klasse bleibt die
Testheft-Auswahl erforderlich; bei genau einem passenden Test öffnet sich direkt der Bericht.
Nach der Auswahl einer anderen Klasse bzw. eines anderen Tests startet deren Bericht bei Schritt 1.

#### Berichtsschritte

Die Rückmeldung ist als lineare Abfolge von sieben Schritten aufgebaut (`src/router/index.ts`). Der Code der
Schüler:in wird als Query-Parameter `?user=<code>` durch die Schritte mitgeführt (gesetzt beim Start in
`HomeView`, ausgelesen z. B. in `App.vue` über `route.query.user`).

| Route           | View                        | Inhalt                                                                     |
| --------------- | --------------------------- | -------------------------------------------------------------------------- |
| `/` → `/step-1` | `HomeView`                  | Auswahl/Eingabe des Test-Codes und Einstieg                                |
| `/step-2`       | `ConclusionView`            | „Zusammenfassung" – Gesamtergebnis                                         |
| `/step-3`       | `ClassResultsSubTopicsView` | „Ergebnisse der Klasse in Teilbereichen" – Klassenvergleich je Leitidee    |
| `/step-4`       | `ResultsInDetailView`       | „Ergebnisse im Detail" – Auswertung je Kompetenz/Leitidee, Vergleichswerte |
| `/step-5`       | `BestExercisesView`         | „Top Aufgaben" – die am besten gelösten Aufgaben                           |
| `/step-6`       | `WorstExercisesView`        | „Flop Aufgaben" – Aufgaben mit dem größten Übungsbedarf                    |
| `/step-7`       | `IdeasForFutureView`        | „Anregungen zur Weiterarbeit" – Abschluss mit Übungshinweisen              |

Die Schrittfolge wird über `src/composables/useNavigation.ts` bereitgestellt und von der Fußzeile in `App.vue` für
die Seitenindikatoren sowie die Vor-/Zurück-Navigation (`goNext`/`goBack`) verwendet.

---

### Composables & fachliche Logik

| Composable             | Aufgabe                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `useUserItems`         | Items einer Schüler:in laden (`useUserItemsNew`), Trefferquote berechnen, Schulform (`useSchoolForm`) und Testdaten (`useTestData`) |
| `useCompetencesNew`    | Auswertung je Kompetenz `K1`–`K6` inkl. Top-Performer                                                                               |
| `useGuidingIdeasNew`   | Auswertung je Leitidee `L1`–`L5`, Top- und schwache Bereiche                                                                        |
| `useOverallResultsNew` | Gesamtscore und Zuordnung zu einer Rückmeldestufe                                                                                   |
| `useSpecialCasesNew`   | Auffälligkeiten wie Bearbeitungsdauer und Anteil nicht bearbeiteter Aufgaben, Nutzerkennzahlen (`useUserProperties`)                |
| `useClassStatsNew`     | Aggregierte Klassenkennzahlen für den Klassenvergleich                                                                              |
| `useAggregations`      | Rohdaten-Aggregationen (Leitideen, Kompetenzen, Kompetenzstufen, kognitive Anforderungsniveaus)                                     |
| `useNavigation`        | Bereitstellung der Schrittfolge (`allSteps`) für Router-Fußzeile und Navigation                                                     |

Die Varianten ohne `New`-Suffix (`useCompetences`, `useGuidingIdeas`, `useOverallResults`, `useSpecialCases`) sind
ältere Implementierungen gegen die TBA3-Referenz-API und bleiben zu Vergleichszwecken im Code erhalten. Aktiv
verwendet werden die `New`-Varianten gegen die inio-Reportdaten.

---

### TBA3-Schnittstelle

Die TBA3-Schnittstelle soll die Daten für Abbildungen möglichst standardisieren. Die Schnittstelle muss zwingend für
Abbildungen bedient werden (Projektziel von TBA3).

#### Dokumentation

Die Dokumentation der Schnittstelle liegt hier vor: https://apps.indibit.eu/tba3-api/docs

#### Mock Server

Beispieldaten können hier abgerufen werden: https://apps.indibit.eu/tba3-api

#### API-Clients

Die Clients werden **nicht von Hand geschrieben**, sondern mit dem OpenAPI Generator (`typescript-fetch`) aus den
jeweiligen Spezifikationen erzeugt und als Workspace-Pakete eingebunden. Jedes Paket enthält unter `src/` die Ordner
`apis/`, `models/` und `docs/` sowie `runtime.ts`.

| Paket                 | Spezifikation                                       | Neu generieren                    |
| --------------------- | --------------------------------------------------- | --------------------------------- |
| `@tba3/api-resources` | `github.com/indibit-eu/tba3` → `tba3-spec.yml`      | `pnpm run generate:api-resources` |
| `@tba3/api-new`       | `https://api.inio.de/swagger/report_data_tba3.json` | `pnpm run generate:api-new`       |
| `@tba3/api-auth`      | `https://api.inio.de/swagger/auth.json`             | `pnpm run generate:api-auth`      |

Die Generierung benötigt **Java 21** (der OpenAPI Generator ist ein Java-Tool); das Dev-Image in `docker/Dockerfile`
bringt es bereits mit. Die erzeugten Dateien werden anschließend automatisch mit Prettier formatiert. Generierter
Code sollte nicht manuell verändert werden – stattdessen die Spezifikation anpassen und neu generieren.

#### Dev-Proxys

Um CORS im Entwicklungsbetrieb zu umgehen, leitet Vite drei Pfade weiter (identisch konfiguriert für `dev` und
`preview`, s. `vite.config.ts`):

| Pfad         | Ziel                                   | Verwendet von         |
| ------------ | -------------------------------------- | --------------------- |
| `/api-proxy` | `https://apps.indibit.eu/tba3-api/`    | `@tba3/api-resources` |
| `/api-inio`  | `https://api.inio.de/report_data_tba3` | `@tba3/api-new`       |
| `/api-auth`  | `https://api.inio.de/report_data_tba3` | `@tba3/api-auth`      |

Im Production-Betrieb müssen die Endpunkte stattdessen über `public/config.js` als absolute URLs gesetzt werden.

---

### Tests & Qualitätssicherung

Die Anwendung nutzt **Vitest** in Kombination mit **Vue Test Utils** und **jsdom** für Unit- und Komponententests.

#### Commands

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

#### Empfohlener Scope für künftige Tests

- **Komponenten (`src/components/`)**: Visualisierung, Accessibility (Focus Traps, ARIA-Attribute), Event-Handling
  (z. B. `SideModal`).
- **Store & Routing (`src/stores/`, `src/router/`)**: Pinia-Zustandsänderungen und Navigation.
- **Composables (`src/composables/`)**: Geschäftslogik, Daten-Aggregation und Berechnungen.

---

## Inhaltliche Dokumentation

### Ausgangslage und Zielsetzung

Zu Beginn der Entwicklung der Prototypen wurden der Ablauf von VERA und die beteiligten Akteur:innen aus Schulsicht systematisch betrachtet. Dabei wurde untersucht, welchen Nutzen die bestehenden Rückmeldungen bieten und an welchen Stellen sich ihr Mehrwert weiter erhöhen lässt.

Dabei haben sich mehrere Ansatzpunkte herauskristallisiert, die im Folgenden erläutert werden. Sie bilden die Grundlage für das Verständnis der entwickelten Prototypen und der ihnen zugrunde liegenden Entscheidungen.

Aus Sicht der Lehrkräfte sind Rückmeldungen ein wichtiger Baustein, um den Nutzen von VERA zu erhöhen. Sie bieten eine Orientierung für die pädagogische Arbeit und können Impulse für die Weiterentwicklung des Unterrichts geben. Entscheidend ist dabei, dass die Ergebnisse möglichst zeitnah vorliegen, die Informationen auf die jeweiligen Adressat:innen zugeschnitten sind und konkrete Anhaltspunkte für die weitere Arbeit bieten.

Darüber hinaus besteht der Wunsch, die Ergebnisse aus VERA mit denen anderer diagnostischer Verfahren zu verknüpfen. Auch Längsschnittbetrachtungen wären hilfreich, sowohl auf Ebene der einzelnen Schüler:innen als auch auf Ebene der Lehrkräfte und Schulen.

Im Rahmen des Projekts wurden zunächst vielfältige Ideen gesammelt. Anschließend lag der Schwerpunkt auf der konkreten Entwicklung von Rückmeldungen, die sich innerhalb der bestehenden Strukturen umsetzen lassen. Dabei wurden zwei zentrale Adressat:innengruppen identifiziert: Schüler:innen und Lehrkräfte.

Für diese beiden Gruppen wurden jeweils eigene Prototypen entwickelt (s. [Schüler:innenbericht](https://github.com/kompetenztestde/kompetenzstand-mathematik-schuelerinnenbericht) und [Klassenbericht](https://github.com/kompetenztestde/kompetenzstand-mathematik-klassenbericht)). Sie berücksichtigen die unterschiedlichen Informationsbedürfnisse und können unabhängig voneinander eingesetzt werden. Gleichzeitig verbindet sie ein gemeinsames visuelles Gestaltungskonzept.

### Vorüberlegungen

Lehrkräfte bilden eine zentrale Adressat:innengruppe von VERA. Für sie wurde ein Klassenbericht entwickelt, der die Ergebnisse übersichtlich darstellt und Anhaltspunkte für die weitere Unterrichtsentwicklung bietet.

Auch für diesen Bericht ist eine zeitnahe Bereitstellung wünschenswert. Anders als beim Schüler:innenbericht kommt der Einordnung anhand fairer Vergleichswerte jedoch eine besondere Bedeutung zu. Deshalb sollte der Klassenbericht erst veröffentlicht werden, wenn die entsprechenden Vergleichswerte berechnet wurden.

Eine frühere Bereitstellung ohne diese Vergleichswerte wäre grundsätzlich denkbar. Aus Sicht der Entwicklungsgruppe besteht allerdings das Risiko, dass Lehrkräfte den Bericht später nicht erneut aufrufen, um die ergänzten Informationen zu berücksichtigen. Die zeitnahe Veröffentlichung und die vollständige Einordnung der Ergebnisse müssen daher gemeinsam betrachtet werden.

### Berechnung und Einordnung der Ergebnisse

Die Ergebnisse der Klasse werden durch faire Vergleichswerte ergänzt. Diese ermöglichen eine differenziertere Einordnung der Leistungen und berücksichtigen relevante Merkmale der Schüler:innen.

Dazu werden die Ergebnisse der Klasse mit den Mittelwerten anderer Klassen verglichen, deren Zusammensetzung hinsichtlich der berücksichtigten Merkmale ähnlich ist. Auf diese Weise sollen Unterschiede in der Zusammensetzung der Lerngruppen bei der Interpretation der Ergebnisse berücksichtigt werden.

Die Lehrkräfte erhalten dadurch nicht nur Informationen darüber, wie ihre Klasse bei VERA abgeschnitten hat, sondern auch Anhaltspunkte dafür, wie die Ergebnisse im Verhältnis zu einer geeigneten Vergleichsgruppe einzuordnen sind.

### Zugriff auf den Bericht

Der Klassenbericht ist so konzipiert, dass er perspektivisch in gängige Schulportale eingebunden werden kann.

In der aktuellen Umsetzung erfolgt der Zugang über eine separate Login-Seite. Lehrkräfte melden sich dort mit ihrem Schulzugang an und wählen anschließend die gewünschte Klasse aus.

### Aufbau und Gestaltung des Berichts

Der Klassenbericht greift das grundlegende Gestaltungskonzept des Schüler:innenberichts auf (s. [Schüler:innenbericht](https://github.com/kompetenztestde/kompetenzstand-mathematik-schuelerinnenbericht)). Die Farben und grafischen Elemente werden in einer zurückhaltenderen Form verwendet. Dadurch entsteht ein Wiedererkennungswert zwischen den beiden Prototypen, während der Klassenbericht zugleich auf die Informationsbedürfnisse der Lehrkräfte ausgerichtet ist.

Die Inhalte sind von einer ersten Ergebnisübersicht über detaillierte Analysen bis hin zu Hinweisen für die Weiterarbeit gegliedert. Lehrkräfte, die sich zunächst einen schnellen Überblick verschaffen möchten, finden auf den ersten Seiten die wichtigsten Informationen. Weitere Seiten ermöglichen eine vertiefte Auseinandersetzung mit den Ergebnissen.

Die einzelnen Informationen sind übersichtlich und möglichst eindeutig dargestellt. Ergänzende Hintergrundinformationen und Interpretationshilfen sind über entsprechende Hilfsicons abrufbar.

Die Ergebnisse der Klasse und die korrigierten Landesmittelwerte werden durchgängig in unterschiedlichen, jeweils gleichbleibenden Farben dargestellt. Dadurch lassen sich die beiden Werte in den verschiedenen Ansichten schnell unterscheiden.

### Zusammenfassung der Ergebnisse

Im Anschluss an die Startseite erhalten die Lehrkräfte eine Zusammenfassung der wichtigsten Ergebnisse.

Für das Fach Mathematik wurden neben dem Gesamtergebnis insbesondere die Rückmeldungen zu den Leitideen als relevant eingeschätzt. Sie bilden zentrale inhaltliche Bereiche des Fachs ab und ermöglichen eine differenzierte Betrachtung der Ergebnisse. Anders als im Schüler:innenbericht werden die Leitideen hier stets in derselben Reihenfolge dargestellt. Das erleichtert den Vergleich zwischen den einzelnen Bereichen.

Zusätzlich wird die Homogenität der Klasse ausgewiesen. Die Information über die Leistungsunterschiede innerhalb der Lerngruppe ist für die weitere Unterrichtsentwicklung besonders interessant. Sie ermöglicht es, die Streuung der Ergebnisse innerhalb der Klasse mit derjenigen einer geeigneten Vergleichsgruppe beziehungsweise dem Landesdurchschnitt in Beziehung zu setzen.

### Ergebnisse in den Teilbereichen

Auf die Zusammenfassung folgt eine Übersicht über die Ergebnisse in den einzelnen Teilbereichen. Neben dem Gesamtergebnis und den Leitideen werden hier auch prozessbezogene Kompetenzen, Anforderungsbereiche und Kompetenzstufen der Aufgaben berücksichtigt.

Im Verlauf der Entwicklungsarbeit zeigten sich deutliche Unterschiede zwischen den Bundesländern hinsichtlich der verwendeten Konzepte und ihrer Verankerung in der schulischen Praxis. Während in einigen Ländern vor allem Kompetenzstufen genutzt werden, stehen in anderen die Anforderungsbereiche stärker im Vordergrund. Die Vertrautheit mit den jeweiligen Konzepten unterscheidet sich entsprechend.

Auch in dieser Ansicht werden der Klassenwert und der faire Vergleichswert gegenübergestellt. Darüber hinaus wäre es für schulinterne Abstimmungen, beispielsweise in Schul- oder Fachbereichskonferenzen, sinnvoll, zusätzlich den Schulwert darzustellen.

Die Grafik ist interaktiv gestaltet. Die einzelnen Vergleichswerte lassen sich nach Bedarf ein- und ausblenden. Beim Überfahren der Grafik mit dem Mauszeiger werden die genauen Werte der jeweiligen Teilbereiche angezeigt.

Eine weitere Funktion ermöglicht es, einzelne Teilbereiche aus der Darstellung auszublenden. Die übrigen Teilbereiche werden anschließend auf Grundlage der verbleibenden Auswahl neu berechnet. Dadurch können Lehrkräfte die Ergebnisse gezielt aus unterschiedlichen Perspektiven betrachten.

### Ergebnisse im Detail

Das Kernstück des Klassenberichts ist die detaillierte Ergebnisansicht. Sie bietet verschiedene Möglichkeiten, die Ergebnisse der gesamten Klasse, ausgewählter Gruppen oder einzelner Schüler:innen zu betrachten und systematisch auszuwerten.

Im Verlauf der Entwicklung des Prototyps zeigte sich insbesondere für das Fach Mathematik, dass die Ebene der einzelnen Aufgaben für die Interpretation der Ergebnisse besonders wichtig ist. Deshalb werden die Aufgaben in der Detailansicht einzeln in Form von Kästchen dargestellt.

In der Ausgangsansicht sind die Schüler:innen absteigend nach ihren Testergebnissen sortiert. Die Aufgaben werden nach gelösten und nicht gelösten Aufgaben gruppiert. Diese Darstellung bietet einen schnellen Überblick über die Leistungen innerhalb der Klasse und zeigt, wie sich die einzelnen Schüler:innen im Verhältnis zueinander einordnen.
Sofern entsprechende Daten vorliegen, werden ergänzend Merkmale der Schüler:innen und ihre Halbjahresnoten angezeigt.

Die Grafik lässt sich an unterschiedliche Fragestellungen anpassen. Über Farbskalen können Informationen zu den einzelnen Aufgaben dargestellt werden. Dabei ist ein Wechsel zwischen verschiedenen fachlichen Perspektiven möglich, etwa nach Leitideen, Kompetenzstufen oder Anforderungsbereichen.

Darüber hinaus können die Aufgabennamen eingeblendet werden, um die einzelnen Aufgaben leichter zu identifizieren. Die Aufgaben lassen sich entweder gruppiert oder in ihrer tatsächlichen Reihenfolge anzeigen.

Auch die Sortierung kann angepasst werden. Möglich sind Sortierungen nach Schüler:innen, nach der Lösungshäufigkeit der Aufgaben oder nach den Halbjahresnoten.

Diese Funktionen unterstützen Lehrkräfte dabei, Muster in den Ergebnissen zu erkennen und konkrete Fragestellungen zu untersuchen. Dazu gehören beispielsweise:

* Welche Leitideen wurden von der Klasse besonders gut bearbeitet?
* Bei welchen Aufgaben aus dem Anforderungsbereich III zeigen sich Schwierigkeiten?
* Gibt es Aufgaben, die von niemandem gelöst oder überhaupt bearbeitet wurden?
* Erzielen Schüler:innen mit schwächeren Halbjahresnoten bessere Ergebnisse als erwartet?
* Lassen sich innerhalb der Klasse Gruppen mit ähnlichen Ergebnismustern erkennen?

Durch einen Klick auf einzelne Aufgabenkästchen können zusätzliche Informationen zu den jeweiligen Aufgaben aufgerufen werden, beispielsweise der Aufgabenname oder ausgewählte Aufgabenparameter.

Die Detailansicht verbindet damit eine kompakte Übersicht über die gesamte Klasse mit Möglichkeiten zur gezielten Analyse einzelner Aufgaben und Schüler:innengruppen.

### Besonders gut und weniger gut gelöste Aufgaben

Im Anschluss an die detaillierte Ergebnisansicht werden die drei Aufgaben hervorgehoben, bei denen die Klasse im Vergleich zum korrigierten Landesmittelwert besonders gut beziehungsweise weniger gut abgeschnitten hat.

Im Mittelpunkt stehen dabei konkrete Ansatzpunkte für die Weiterarbeit. Entscheidend ist nicht allein, welche Aufgaben absolut betrachtet besonders häufig oder selten gelöst wurden. Vielmehr wird untersucht, bei welchen Aufgaben die Ergebnisse der Klasse im Verhältnis zum korrigierten Landesmittelwert auffällig ausfallen.

Diese Einordnung ist wichtig, da die Lösungshäufigkeit auch vom Schwierigkeitsgrad einer Aufgabe beeinflusst wird. Einfache Aufgaben werden häufig von vielen Schüler:innen richtig gelöst, während anspruchsvolle Aufgaben insgesamt eine geringere Lösungshäufigkeit aufweisen können. Erst der Vergleich mit dem korrigierten Landesmittelwert ermöglicht es, solche Unterschiede differenzierter zu betrachten.

Für die drei besonders gut und die drei weniger gut gelösten Aufgaben werden jeweils der Klassenwert und der Landesmittelwert dargestellt.

Die Beschränkung auf maximal drei Aufgaben pro Kategorie ist bewusst gewählt. Sie soll die Ergebnisse auf die wesentlichen Auffälligkeiten konzentrieren und Lehrkräften konkrete Hinweise für die weitere Unterrichtsarbeit geben.

### Abschlussseite

Die letzte Seite bündelt Anregungen für den Umgang mit den Ergebnissen. Dazu werden konkrete Fragestellungen für die Auseinandersetzung mit den Testergebnissen auf unterschiedlichen Ebenen vorgestellt.

Ergänzend enthält die Seite eine Checkliste mit möglichen nächsten Handlungsschritten. Sie soll Lehrkräfte dabei unterstützen, aus der Analyse der Ergebnisse konkrete Ansatzpunkte für die weitere Arbeit abzuleiten.

### Mögliche Weiterentwicklungen

Der Klassenbericht bildet einen ersten funktionsfähigen Ansatz, dessen Potenzial durch weitere Funktionen und Verknüpfungen noch besser ausgeschöpft werden könnte. Einige der ursprünglich vorgesehenen Funktionen konnten im Rahmen des Prototyps noch nicht umgesetzt werden.

Ergänzung der Homogenitätsdarstellung
Die Darstellung der Klassenhomogenität könnte um einen entsprechenden Landeswert ergänzt werden. Auf dieser Grundlage ließen sich abhängig von den Ergebnissen passende Handlungsempfehlungen bereitstellen. Diese könnten entweder unmittelbar an der Skala oder dynamisch auf der Abschlussseite angezeigt werden.

Erweiterung der Detailansicht
Insbesondere die Detailansicht bietet zahlreiche Möglichkeiten für eine Weiterentwicklung. Ein wichtiger Wunsch aus der Entwicklungsgruppe war, durch einen Klick auf einzelne Schüler:innen direkt zu ihrem bearbeiteten Online-Test zu gelangen. Dadurch könnten Lehrkräfte die Ergebnisse anhand der konkreten Aufgabenbearbeitung genauer nachvollziehen.
Auch eine Verknüpfung mit dem Bericht für die jeweiligen Schüler:innen wäre sinnvoll. Sie könnte eine gemeinsame Grundlage für Lernentwicklungsgespräche und Elterngespräche schaffen und dabei helfen, die Perspektiven der Lehrkräfte und der Lernenden zusammenzuführen.
Darüber hinaus wäre es hilfreich, bei einem Klick auf eine einzelne Aufgabe nicht nur deren Parameter, sondern auch die Aufgabe selbst und die zugehörige Korrekturvorschrift aufrufen zu können.

Unterstützung bei der Interpretation
Um die Nutzung der Detailansicht zu erleichtern, könnten ein kurzes Erklärvideo oder ein integrierter Guide entwickelt werden. Diese Hilfen würden die Funktionen erläutern und den Einstieg in die Arbeit mit der Grafik erleichtern.
Ergänzend wären automatische Hinweise auf auffällige Muster in den Ergebnissen denkbar. In Verbindung mit passenden Handlungsempfehlungen könnten sie Lehrkräfte dabei unterstützen, aus den Analysen konkrete nächste Schritte abzuleiten.

Verknüpfung mit Aufgaben und Weiterarbeitshinweisen
Bei den besonders gut beziehungsweise weniger gut gelösten Aufgaben wäre es hilfreich, die jeweilige Onlineansicht einschließlich der Korrekturvorschrift direkt aufrufen zu können.
Insbesondere bei den weniger gut gelösten Aufgaben könnte zusätzlich eine Verknüpfung mit dem Aufgabenbrowser oder mit konkreten Hinweisen zur Weiterarbeit einen Mehrwert bieten. Dadurch ließen sich die Analyse der Ergebnisse und die Planung weiterer Unterrichtsschritte enger miteinander verbinden.

Dynamische Gestaltung der Abschlussseite
Auch die Abschlussseite könnte künftig stärker auf die Ergebnisse der jeweiligen Klasse abgestimmt werden. Eine dynamische Auswahl von Fragestellungen und Handlungsempfehlungen würde es ermöglichen, die Hinweise gezielter an den festgestellten Ergebnismustern auszurichten.

### Ausblick

Beide Prototypen (s. [Schüler:innenbericht](https://github.com/kompetenztestde/kompetenzstand-mathematik-schuelerinnenbericht) und [Klassenbericht](https://github.com/kompetenztestde/kompetenzstand-mathematik-klassenbericht)) wurden für den Einsatz im Fach Mathematik in Jahrgangsstufe 8 konzipiert. Eine Übertragung auf andere Fächer oder Jahrgangsstufen ist grundsätzlich denkbar, erfordert jedoch eine fachliche Prüfung und entsprechende Anpassungen. Dazu gehören insbesondere die inhaltliche Abstimmung der Rückmeldungen, die Auswahl geeigneter Vergleichswerte, die Überprüfung der Berechnungsgrundlagen sowie gegebenenfalls Anpassungen des Designs.

Die entwickelten Prototypen zeigen, wie Rückmeldungen aus VERA stärker an den Informationsbedürfnissen der jeweiligen Zielgruppen ausgerichtet werden können. Der Schüler:innenbericht stellt eine verständliche und motivierende Einordnung der individuellen Testergebnisse in den Mittelpunkt. Der Klassenbericht bietet Lehrkräften differenzierte Auswertungsmöglichkeiten und Ansatzpunkte für die weitere Unterrichtsentwicklung.

Beide Ansätze verfolgen damit das Ziel, Testergebnisse nicht nur bereitzustellen, sondern ihre Einordnung und Nutzung zu erleichtern. Zugleich bilden die Prototypen eine Grundlage für weitere Entwicklungen, insbesondere für die Verknüpfung mit bestehenden diagnostischen Angeboten und konkreten Möglichkeiten zur Weiterarbeit.

Für die nächsten Schritte empfehlen wir, beide Prototypen unter realen Einsatzbedingungen zu erproben und systematisch zu evaluieren. Dabei sollte insbesondere untersucht werden, wie verständlich die Rückmeldungen für die jeweiligen Zielgruppen sind, wie sie im schulischen Alltag genutzt werden und welche Funktionen den größten Mehrwert bieten. Die Ergebnisse einer solchen Evaluation können dazu beitragen, die Prototypen gezielt weiterzuentwickeln und ihre Eignung für einen breiteren Einsatz zu prüfen.

## Lizenz

Der **Quellcode** steht unter der [MIT-Lizenz](LICENSE), eigene **Illustrationen** unter
[CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0.txt). Welche Datei unter welcher Lizenz steht, listet [`LICENSES.md`](LICENSES.md)
auf – dort ist auch das Firmenlogo als Marke von beiden Lizenzen ausgenommen.

Die eingebundenen Schriftarten Inter und League Spartan stehen unter der SIL Open Font License 1.1
(`src/themes/fonts/OFL.txt`). Eine Übersicht der Lizenzen aller genutzten npm-Pakete findet sich ebenfalls in
[`LICENSES.md`](LICENSES.md); eine vollständige, automatisch erzeugte Liste liefert `pnpm licenses list --long`.
