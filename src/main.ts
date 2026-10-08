import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n';
import App from './App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'
import { queryClient } from './queryClient'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(i18n);

router.isReady().then(() => app.mount('#app'))
