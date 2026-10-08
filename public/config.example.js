const isLocalDevelopment = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

window.appConfig = {
  api: isLocalDevelopment
    ? {
        baseUrl: '/api-proxy',
        inioApiUrl: '/api-inio',
        inioAuthApiUrl: '/api-auth',
      }
    : {
        baseUrl: 'https://apps.indibit.eu/tba3-api',
        inioApiUrl: 'https://api.inio.de/report_data_tba3',
        inioAuthApiUrl: 'https://api.inio.de/auth',
      },
  defaultPageSize: 20,
}
