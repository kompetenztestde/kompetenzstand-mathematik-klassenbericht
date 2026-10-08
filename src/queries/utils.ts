import { Configuration } from '@tba3/api-resources'
import { Configuration as Configuration2 } from '@tba3/api-new'
import { Configuration as ConfigurationAuth } from '@tba3/api-auth'
import { useAuthStore } from '@/stores/auth'

type CustomWindow = Window & {
  appConfig?: {
    api?: {
      baseUrl?: string
      inioApiUrl?: string
      inioAuthApiUrl?: string
      xApiKeySchool?: string
    }
    defaultPageSize?: number
  }
}

export async function apiConfiguration(): Promise<Configuration> {
  const configFromWindow = (window as CustomWindow).appConfig?.api?.baseUrl || ''
  const config = new Configuration({ basePath: configFromWindow })
  return config
}

export async function inioApiConfiguration(): Promise<Configuration2> {
  const auth = useAuthStore()
  if (!auth.isAuthenticated || auth.isSessionExpired()) {
    throw new Error('Bitte melde dich erneut an.')
  }

  const configFromWindow = (window as CustomWindow).appConfig?.api?.inioApiUrl || ''
  const config = new Configuration2({
    basePath: configFromWindow,
    ...(auth.demoAccess
      ? { apiKey: (name: string) => (name === 'X-API-KEY-SCHOOL' ? auth.apiKeySchool! : '') }
      : { headers: { Authorization: `Bearer ${auth.token}` } }),
  })
  return config
}

export async function inioAuthApiConfiguration(): Promise<ConfigurationAuth> {
  const configFromWindow = (window as CustomWindow).appConfig?.api?.inioAuthApiUrl || ''
  const config = new ConfigurationAuth({ basePath: configFromWindow })
  return config
}
