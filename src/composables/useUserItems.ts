import { apiConfiguration, inioApiConfiguration } from '@/queries/utils'
import { useQuery } from '@tanstack/vue-query'
import { GroupsApi } from '@tba3/api-resources'
import { ReportDataTba3Api } from '@tba3/api-new'
import { computed, type ComputedRef } from 'vue'

export function useUserItems(userName: ComputedRef<string | undefined>) {
  return useQuery({
    queryKey: ['user-items-base', userName.value],
    queryFn: async () => {
      if (!userName.value) return []
      const config = await apiConfiguration()
      const api = new GroupsApi(config)
      const response = await api.getGroupItems({ id: '8b-mathe', type: 'students' })

      const targetUser = response.find((u) => u.name === userName.value)
      return targetUser?.items ?? []
    },
    enabled: computed(() => !!userName.value),
    staleTime: 1000 * 60 * 60,
  })
}

interface UserItemsResponse {
  targetItems: any[]
  allStudentsItems: any[][]
}

export function useUserItemsNew(code?: ComputedRef<string | undefined>) {
  const query = useQuery<UserItemsResponse>({
    queryKey: ['user-items-base', code?.value],
    queryFn: async () => {
      // if (!code.value) return []
      if (!code?.value) return { targetItems: [], allStudentsItems: [] }
      const config = await inioApiConfiguration()
      const api = new ReportDataTba3Api(config)
      const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
        tgId: 270,
        groupId: 1001,
        testId: 9524,
        type: 'students',
        studentCode: code.value,
      })
      const students = response.data?.studentsData ?? []

      const targetUser = students.find((u) => u.code === code.value)
      const targetItems = targetUser?.items ?? []
      const allStudentsItems = students
        .map((student) => student.items)
        .filter((items): items is any[] => Array.isArray(items))

      // return targetUser?.items ?? []
      return {
        targetItems,
        allStudentsItems,
      }
    },
    enabled: computed(() => !!code?.value),
    staleTime: 1000 * 60 * 60,
  })

  // const stats = computed(() => calculateUserStats(query.data.value))
  const singleStudentItems = computed(() => query.data.value?.targetItems ?? [])
  const classItemsMatrix = computed(() => query.data.value?.allStudentsItems ?? [])
  
  const stats = computed(() => calculateUserStats(singleStudentItems.value))

  // return {
  //   ...query,
  //   stats,
  // }
  return {
    ...query,
    data: singleStudentItems, 
    classItemsMatrix,         
    stats,
  }
}

export const calculateUserStats = (items: any[] | undefined) => {
  if (!items || items.length === 0) {
    return { correct: 0, total: 0, percentage: 0 }
  }

  const correct = items.filter((item) => item.descriptiveStatistics?.frequency === 1).length

  const total = items.length
  const percentage = (correct / total) * 100

  return { correct, total, percentage }
}

export function useSchoolForm(code: ComputedRef<string | undefined>) {
  return useQuery({
    queryKey: ['school-form', code.value],
    queryFn: async () => {
      if (!code.value) return null

      const config = await inioApiConfiguration()
      const api = new ReportDataTba3Api(config)
      const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
        tgId: 270,
        groupId: 1001,
        testId: 9524,
        type: 'students',
        studentCode: code.value,
      })

      return response.data?.groupData?.schoolForm ?? null
    },
    enabled: computed(() => !!code.value),
    staleTime: 1000 * 60 * 60,
  })
}

export function useTestData(code: ComputedRef<string | undefined>) {
  return useQuery({
    queryKey: ['testId', code.value],
    queryFn: async () => {
      if (!code.value) return null

      const config = await inioApiConfiguration()
      const api = new ReportDataTba3Api(config)
      const response = await api.testGroupsTgIdTestsGet({
        tgId: 270,
        testIds: '9524',
      })

      return response.data ?? null
    },
    enabled: computed(() => !!code.value),
    staleTime: 1000 * 60 * 60,
  })
}

export function useAllUserItemsNew() {
  const query = useQuery({
    queryKey: ['user-items-all'],
    queryFn: async () => {
      const config = await inioApiConfiguration()
      const api = new ReportDataTba3Api(config)
      const response = await api.testGroupsTgIdTestsTestIdGroupsGroupIdItemsGet({
        tgId: 270,
        groupId: 1001,
        testId: 9524,
        type: 'students',
      })
      const students = response.data?.studentsData ?? []
      return students
    },
    staleTime: 1000 * 60 * 60,
  })

  const stats = computed(() => calculateUserStats(query.data.value))

  return {
    ...query,
    stats,
  }
}

export function getBestAndWorstExercises() {
  const { data: allUsers } = useAllUserItemsNew()

  return computed(() => {
    if (!allUsers.value || allUsers.value.length === 0) {
      return { worstThreeGlobal: [], bestThreeGlobal: [] }
    }

    const taskStats: Record<string, { item: any; totalFrequency: number; userCount: number }> = {}

    allUsers.value.forEach((user) => {
      if (!user.items) return

      user.items.forEach((item) => {
        if (!item.iqbId) return

        if (!taskStats[item.iqbId]) {
          taskStats[item.iqbId] = { item, totalFrequency: 0, userCount: 0 }
        }
        const stats = taskStats[item.iqbId]!

        const freq = item.descriptiveStatistics?.frequency ?? 0
        const score = freq === 1 ? 1 : 0

        stats.totalFrequency += score
        stats.userCount++
      })
    })

    const evaluatedTasks = Object.values(taskStats).map(({ item, totalFrequency, userCount }) => {
      const currentMean = userCount > 0 ? totalFrequency / userCount : 0

      const referenceValue = item.parameters?.solutionFrequencyGymnasium
        ? item.parameters.solutionFrequencyGymnasium / 100
        : currentMean

      const deviation = currentMean - referenceValue

      return {
        ...item,
        currentMean,
        referenceValue,
        deviation,
      }
    })

    const worstThreeGlobal = [...evaluatedTasks]
      .sort((a, b) => a.deviation - b.deviation)
      .slice(0, 3)

    const bestThreeGlobal = [...evaluatedTasks]
      .sort((a, b) => b.deviation - a.deviation)
      .slice(0, 3)

    return {
      worstThreeGlobal,
      bestThreeGlobal,
    }
  })
}
