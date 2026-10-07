import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import license, { type Dependency } from 'rollup-plugin-license'
import { visualizer } from 'rollup-plugin-visualizer'

const ALLOWED_LICENSES = [
    'MIT',
    'MIT-0',
    'ISC',
    'Apache-2.0',
    'BSD-2-Clause',
    'BSD-3-Clause',
    '0BSD',
    'BlueOak-1.0.0',
    'CC0-1.0',
    'Unlicense',
    'Python-2.0',
].join(' OR ')

const FONT_NOTICE = `Inter (src/themes/fonts/inter-v20-*.woff2)
Copyright 2020 The Inter Project Authors
(https://github.com/rsms/inter)
Lizenz: SIL Open Font License, Version 1.1 — vollstaendiger Text in OFL.txt

League Spartan (src/themes/fonts/league-spartan-v15-*.woff2)
Copyright 2020 The League Spartan Project Authors
(https://github.com/theleagueof/league-spartan)
Lizenz: SIL Open Font License, Version 1.1 — vollstaendiger Text in OFL.txt`

const SEPARATOR = '-'.repeat(78)

function renderThirdPartyNotices(dependencies: Dependency[]): string {
    const sections = dependencies
        .slice()
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
        .map((dep) => {
            const title = `${dep.name ?? 'unbekannt'}@${dep.version ?? '?'} — ${dep.license ?? 'Lizenz nicht angegeben'}`
            const fallback = `Kein Lizenztext im Paket hinterlegt. Siehe ${dep.homepage ?? 'https://www.npmjs.com/package/' + dep.name}.`
            const body = dep.licenseText?.trim() || fallback
            const notice = dep.noticeText?.trim()
            return [SEPARATOR, title, SEPARATOR, '', body, notice ? `\nNOTICE:\n${notice}` : ''].join('\n')
        })

    return [
        'Diese Anwendung enthaelt Software Dritter. Nachfolgend die Lizenzen und',
        'Copyright-Hinweise aller im Bundle enthaltenen Pakete sowie der',
        'verwendeten Schriftart.',
        '',
        SEPARATOR,
        'Schriftarten',
        SEPARATOR,
        '',
        FONT_NOTICE,
        '',
        ...sections,
    ].join('\n')
}



// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools(), svgLoader(), visualizer({ open: true })],
    build: {
        rollupOptions: {
            plugins: [
                license({
                    thirdParty: {
                        allow: {
                            test: ALLOWED_LICENSES,
                            failOnUnlicensed: false,
                            failOnViolation: true,
                        },
                        output: {
                            file: fileURLToPath(new URL('./dist/THIRD-PARTY-NOTICES.txt', import.meta.url)),
                            template: renderThirdPartyNotices,
                        },
                    },
                }),
            ],
        },
    },
    server: {
        proxy: {
            '/api-proxy': {
                target: 'https://apps.indibit.eu/tba3-api/',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api-proxy/, ''),
            },
            '/api-inio': {
                target: 'https://api.inio.de/report_data_tba3',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-inio/, ''),
            },
            '/api-auth': {
                target: 'https://api.inio.de/auth',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-auth/, ''),
            },
        },
        host: true,
        port: 3000,
    },
    preview: {
        host: true,
        port: 4173,
        proxy: {
            '/api-proxy': {
                target: 'https://apps.indibit.eu/tba3-api/',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api-proxy/, ''),
            },
            '/api-inio': {
                target: 'https://api.inio.de/report_data_tba3',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-inio/, ''),
            },
            '/api-auth': {
                target: 'https://api.inio.de/auth',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-auth/, ''),
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
