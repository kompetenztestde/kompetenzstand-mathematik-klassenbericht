import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView/HomeView.vue'
import ConclusionView from '@/views/Conclusion/ConclusionView.vue'
import ClassResultsSubTopicsView from '@/views/ClassResultsSubTopics/ClassResultsSubTopicsView.vue'
import ResultsInDetailView from '@/views/ResultsInDetail/ResultsInDetailView.vue'
import BestExercisesView from '@/views/BestExercises/BestExercisesView.vue'
import WorstExercisesView from '@/views/WorstExercises/WorstExercisesView.vue'
import IdeasForFutureView from '@/views/IdeasForFuture/IdeasForFutureView.vue'
import { useAuthStore } from '@/stores/auth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: (to) => {
        const auth = useAuthStore()
        return auth.isAuthenticated ? '/step-1' : { name: 'login', query: to.query }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/layouts/LoginLayout.vue'),
    },
    { path: '/step-1', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/step-2', name: 'step2', component: ConclusionView, meta: { requiresAuth: true } },
    { path: '/step-3', name: 'step3', component: ClassResultsSubTopicsView, meta: { requiresAuth: true } },
    { path: '/step-4', name: 'step4', component: ResultsInDetailView, meta: { requiresAuth: true } },
    { path: '/step-5', name: 'step5', component: BestExercisesView, meta: { requiresAuth: true } },
    { path: '/step-6', name: 'step6', component: WorstExercisesView, meta: { requiresAuth: true } },
    { path: '/step-7', name: 'step7', component: IdeasForFutureView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { path: '/step-1' }
  }
})

export default router
