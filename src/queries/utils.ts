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
  const apiKeyVal = auth.apiKeySchool || (window as CustomWindow).appConfig?.api?.xApiKeySchool || import.meta.env.VITE_X_API_KEY_SCHOOL || 'TEST'

  const configFromWindow = (window as CustomWindow).appConfig?.api?.inioApiUrl || ''
  const config = new Configuration2({
    basePath: configFromWindow,
    apiKey: (name: string) => {
      if (name === 'X-API-KEY-SCHOOL') {
        return apiKeyVal
      }
      return ''
    },
  })
  return config
}

export async function inioAuthApiConfiguration(): Promise<ConfigurationAuth> {
  const configFromWindow = (window as CustomWindow).appConfig?.api?.inioAuthApiUrl || ''
  const config = new ConfigurationAuth({ basePath: configFromWindow })
  return config
}
