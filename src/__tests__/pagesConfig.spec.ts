import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

const source = readFileSync(resolve('public', 'config.example.js'), 'utf8')

type RuntimeWindow = {
  location: { hostname: string }
  appConfig?: {
    api: {
      baseUrl: string
      inioApiUrl: string
      inioAuthApiUrl: string
    }
  }
}

describe('GitHub Pages runtime configuration', () => {
  it.each(['localhost', '127.0.0.1', '[::1]'])('uses local proxies on %s', (hostname) => {
    const window: RuntimeWindow = { location: { hostname } }
    runInNewContext(source, { window })
    expect(window.appConfig?.api).toEqual({
      baseUrl: '/api-proxy',
      inioApiUrl: '/api-inio',
      inioAuthApiUrl: '/api-auth',
    })
  })

  it('uses direct public APIs without embedded credentials on GitHub Pages', () => {
    const window: RuntimeWindow = { location: { hostname: 'kompetenztestde.github.io' } }
    runInNewContext(source, { window })
    expect(window.appConfig?.api).toEqual({
      baseUrl: 'https://apps.indibit.eu/tba3-api',
      inioApiUrl: 'https://api.inio.de/report_data_tba3',
      inioAuthApiUrl: 'https://api.inio.de/auth',
    })
  })
})
