import { computed, type ComputedRef } from 'vue'

interface Performer {
  label: string
  hits: number
  total: number
  percentage: number
}

export function useNavigation(
  competenceTopPerformers: ComputedRef<Performer[]>,
  guidingIdeaTopPerformers: ComputedRef<Performer[]>,
  badPerformers: ComputedRef<Performer[]>,
) {
  const allSteps = computed(() => {
    const steps = []

    steps.push({ path: '/step-1', sub: null })
    steps.push({ path: '/step-2', sub: null })
    steps.push({ path: '/step-3', sub: null })
    steps.push({ path: '/step-4', sub: null })
    steps.push({ path: '/step-5', sub: null })
    steps.push({ path: '/step-6', sub: null })
    steps.push({ path: '/step-7', sub: null })

    return steps
  })

  return { allSteps }
}
