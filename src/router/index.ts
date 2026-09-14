import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView/HomeView.vue'
import ConclusionView from '@/views/Conclusion/ConclusionView.vue'
import ClassResultsSubTopicsView from '@/views/ClassResultsSubTopics/ClassResultsSubTopicsView.vue'
import ResultsInDetailView from '@/views/ResultsInDetail/ResultsInDetailView.vue'
import BestExercisesView from '@/views/BestExercises/BestExercisesView.vue'
import WorstExercisesView from '@/views/WorstExercises/WorstExercisesView.vue'
import IdeasForFutureView from '@/views/IdeasForFuture/IdeasForFutureView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/step-1',
    },
    { path: '/step-1', name: 'home', component: HomeView },
    { path: '/step-2', name: 'step2', component: ConclusionView },
    { path: '/step-3', name: 'step3', component: ClassResultsSubTopicsView },
    { path: '/step-4', name: 'step4', component: ResultsInDetailView },
    { path: '/step-5', name: 'step5', component: BestExercisesView },
    { path: '/step-6', name: 'step6', component: WorstExercisesView },
    { path: '/step-7', name: 'step7', component: IdeasForFutureView },
  ],
})

export default router
