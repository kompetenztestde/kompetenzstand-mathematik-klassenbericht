import { useMutation } from '@tanstack/vue-query'
import { inioAuthApiConfiguration } from './utils'

type SchoolLoginRequest = {
  region: string
  schulNr: string
  passwort: string
}

type SchoolSession = {
  token: string
  tokenExpiresIn: number
  tokenExpiresAt: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function loginSchool(body: SchoolLoginRequest): Promise<SchoolSession> {
  const config = await inioAuthApiConfiguration()
  if (!config.basePath) {
    throw new Error('Die Auth-API ist nicht konfiguriert.')
  }
  const res = await fetch(`${config.basePath.replace(/\/$/, '')}/school`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Unerwartete Antwort vom Server (${res.status}).`)
  }
  const response: unknown = await res.json()
  if (!isRecord(response)) {
    throw new Error('Ungültige Antwort vom Anmeldeserver.')
  }
  if (!res.ok || response.success !== true) {
    throw new Error(
      typeof response.message === 'string' && response.message
        ? response.message
        : 'Anmeldung fehlgeschlagen.',
    )
  }
  const data = response.data
  if (
    !isRecord(data) ||
    typeof data.token !== 'string' ||
    !data.token.trim() ||
    typeof data.tokenExpiresIn !== 'number' ||
    !Number.isFinite(data.tokenExpiresIn) ||
    data.tokenExpiresIn <= 0 ||
    typeof data.tokenExpiresAt !== 'string' ||
    !Number.isFinite(Date.parse(data.tokenExpiresAt.replace(' ', 'T')))
  ) {
    throw new Error('Ungültige Sitzungsdaten vom Anmeldeserver.')
  }
  return {
    token: data.token,
    tokenExpiresIn: data.tokenExpiresIn,
    tokenExpiresAt: data.tokenExpiresAt,
  }
}

export function useSchoolLoginMutation() {
  return useMutation({ mutationFn: loginSchool })
}
