# Lizenzen

Dieses Projekt kombiniert mehrere Lizenzen für unterschiedliche Arten von Inhalten: eigenen Quellcode, eigene
Illustrationen, eingebundene Schriftarten sowie Drittanbieter-Abhängigkeiten aus dem npm-Ökosystem. Diese Datei listet
auf, welcher Teil des Repositories unter welcher Lizenz steht.

---

## 1. Quellcode – MIT

Der gesamte selbst geschriebene Quellcode dieses Repositories steht unter der [MIT-Lizenz](LICENSE)
(Copyright © 2026 outermedia GmbH). Das betrifft insbesondere:

- `src/` – die Vue-3-Anwendung (Views, Komponenten, Composables, Stores, Router, Queries, Typen, Styles)
- `packages/*/src` – die generierten API-Clients (`@tba3/api-resources`, `@tba3/api-new`, `@tba3/api-auth`)
- Konfigurationsdateien im Wurzelverzeichnis (`vite.config.ts`, `vitest.config.ts`, `eslint.config.ts`, `tsconfig*.json` etc.)
- Funktionale UI-Icons als SVG (`src/assets/svgs/*.svg`, `src/themes/icons/*.svg`), da sie Teil der Bedienoberfläche
  und damit des Quellcodes sind

**Ausgenommen** vom Quellcode ist der generierte Code in `packages/*/src` nach einem `pnpm run generate:*`-Lauf
inhaltlich durch die jeweilige API-Spezifikation bestimmt, steht aber lizenzrechtlich ebenfalls unter MIT, da er Teil
dieses Repositories ist.

## 2. Illustrationen – CC BY-SA 4.0

Eigens für dieses Projekt erstellte Illustrationen und grafische Motive stehen unter
[Creative Commons Attribution-ShareAlike 4.0 International](LICENSE-CC-BY-SA-4.0.txt) (CC BY-SA 4.0):

- `src/themes/icons/Bocetos*.png` (inkl. `*_old`- und `*_full`-Varianten)
- `src/themes/icons/celebrate.png`, `contemplative.png`, `trophy.png`, `solid.png`, `Ebene_1.png`

Bei Weiterverwendung dieser Illustrationen sind gemäß CC BY-SA 4.0 eine Namensnennung („outermedia GmbH") sowie die
Weitergabe unter derselben Lizenz erforderlich.

> Hinweis: Aktuell werden im Projekt keine dotLottie-Animationen (`.lottie`-Dateien) ausgeliefert, obwohl die
> Bibliothek `@lottiefiles/dotlottie-vue` als Abhängigkeit eingebunden ist. Sobald Animationsdateien hinzugefügt
> werden, gilt für sie ebenfalls CC BY-SA 4.0, sofern sie eigens für dieses Projekt erstellt wurden.

## 3. Firmenlogo – ausgenommen (Marke)

Das outermedia-Firmenlogo ist als Marke von beiden oben genannten Lizenzen (MIT und CC BY-SA 4.0) **ausgenommen** und
darf nicht ohne gesonderte Erlaubnis der outermedia GmbH verwendet werden:

- `public/om_logo.png`
- `src/assets/logo.svg`

Alle Rechte an diesen Dateien verbleiben bei der outermedia GmbH.

## 4. Schriftarten – SIL Open Font License 1.1

Die eingebundenen Schriftarten stehen unter der [SIL Open Font License, Version 1.1](src/themes/fonts/OFL.txt)
(`src/themes/fonts/OFL.txt`):

| Schriftart      | Copyright                                                                     | Dateien                                          |
| --------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| Inter           | 2020 The Inter Project Authors ([rsms/inter](https://github.com/rsms/inter)) | `src/themes/fonts/inter-v20-*.woff2`             |
| League Spartan  | 2020 The League Spartan Project Authors ([theleagueof/league-spartan](https://github.com/theleagueof/league-spartan)) | `src/themes/fonts/league-spartan-v15-*.woff2`    |

Beide Schriftarten werden über `src/themes/fonts.css` als `@font-face` eingebunden (s. [README2.md](README2.md)).

## 5. Drittanbieter-Abhängigkeiten (npm)

Die produktiven und entwicklungsbezogenen Abhängigkeiten aus `package.json` bringen jeweils ihre eigene Lizenz mit.
Die folgende Tabelle listet die direkten Abhängigkeiten und ihre Lizenz, wie im `license`-Feld des jeweiligen
`package.json` angegeben:

| Paket                          | Lizenz     |
| ------------------------------- | ---------- |
| `vue`                          | MIT        |
| `vue-router`                   | MIT        |
| `pinia`                        | MIT        |
| `vue-i18n`                     | MIT        |
| `@tanstack/vue-query`          | MIT        |
| `echarts`                      | Apache-2.0 |
| `vue-echarts`                  | MIT        |
| `@lottiefiles/dotlottie-vue`   | MIT        |
| `dayjs`                        | MIT        |
| `vite`                         | MIT        |
| `@vitejs/plugin-vue`           | MIT        |
| `vite-plugin-vue-devtools`     | MIT        |
| `vite-svg-loader`              | MIT        |
| `typescript`                   | Apache-2.0 |
| `vue-tsc`                      | MIT        |
| `vitest`                       | MIT        |
| `@vue/test-utils`              | MIT        |
| `jsdom`                        | MIT        |
| `eslint`                       | MIT        |
| `oxlint`                       | MIT        |
| `prettier`                     | MIT        |
| `npm-run-all2`                 | MIT        |

Für eine vollständige, automatisch erzeugte Übersicht aller (auch transitiven) Abhängigkeiten inkl. ihrer
Volltext-Lizenzen kann lokal folgender Befehl ausgeführt werden:

```sh
pnpm licenses list --long
```

> Hinweis: Das Projekt erzeugt aktuell **keine** automatische `THIRD-PARTY-NOTICES.txt` als Teil des Production-Builds
> (`pnpm run build`). Soll eine solche Datei künftig im Build-Output erzeugt werden, ist zusätzlich ein
> Lizenz-Sammel-Tool (z. B. [`license-checker-rseidelsohn`](https://www.npmjs.com/package/license-checker-rseidelsohn))
> als Dev-Abhängigkeit und ein entsprechendes Build-Skript einzurichten.

## 6. Übersicht

| Inhalt                                              | Lizenz                                            |
| ----------------------------------------------------- | -------------------------------------------------- |
| Quellcode (`src/`, `packages/*/src`, Konfiguration)    | [MIT](LICENSE)                                     |
| Eigene Illustrationen (`src/themes/icons/*.png`)       | [CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0.txt)           |
| Firmenlogo (`public/om_logo.png`, `src/assets/logo.svg`) | Marke, alle Rechte bei outermedia GmbH – ausgenommen |
| Schriftarten Inter & League Spartan                    | [SIL OFL 1.1](src/themes/fonts/OFL.txt)            |
| npm-Abhängigkeiten                                     | jeweils eigene Lizenz, s. Tabelle oben             |
