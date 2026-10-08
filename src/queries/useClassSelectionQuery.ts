import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { TEST_GROUP_ID } from '@/stores/reportSelection'
import { inioApiConfiguration } from './utils'

export type MathTest = { testId: number; name: string; booklet: string }
export type SelectableClass = { groupId: number; groupName: string; tests: MathTest[] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseId(value: unknown): number {
  const id = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Ungültige Klassen- oder Test-ID vom Server.')
  }
  return id
}

async function loadList(path: string, signal: AbortSignal): Promise<unknown[]> {
  const config = await inioApiConfiguration()
  const response = await fetch(
    `${config.basePath.replace(/\/$/, '')}/test-groups/${TEST_GROUP_ID}/${path}`,
    {
      headers: config.headers,
      signal,
    },
  )
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Unerwartete Antwort bei der Klassenauswahl (${response.status}).`)
  }
  const body: unknown = await response.json()
  if (!isRecord(body) || !response.ok || body.success !== true || !Array.isArray(body.data)) {
    throw new Error(
      isRecord(body) && typeof body.message === 'string' && body.message
        ? body.message
        : `Klassen und Tests konnten nicht geladen werden (${response.status}).`,
    )
  }
  return body.data
}

export function matchClasses(groups: unknown[], tests: unknown[]): SelectableClass[] {
  const mathTests = tests.flatMap((test): MathTest[] => {
    if (!isRecord(test)) throw new Error('Ungültige Testdaten vom Server.')
    if (test.subject !== 'Mathematik' || String(test.gradeLevel) !== '8') return []
    if (typeof test.nameDisplay !== 'string' || typeof test.booklet !== 'string') {
      throw new Error('Ungültige Mathematiktestdaten vom Server.')
    }
    return [{ testId: parseId(test.testId), name: test.nameDisplay, booklet: test.booklet }]
  })
  return groups.flatMap((group): SelectableClass[] => {
    if (!isRecord(group)) throw new Error('Ungültige Klassendaten vom Server.')
    if (String(group.groupLevel) !== '8') return []
    if (
      typeof group.groupName !== 'string' ||
      !group.groupName.trim() ||
      !Array.isArray(group.participatedTests)
    ) {
      throw new Error('Ungültige Klassendaten vom Server.')
    }
    const participatedTests = group.participatedTests.map(parseId)
    const matchingTests = mathTests.filter((test) => participatedTests.includes(test.testId))
    if (!matchingTests.length) return []
    return [{ groupId: parseId(group.groupId), groupName: group.groupName, tests: matchingTests }]
  })
}

export function useClassSelectionQuery() {
  const auth = useAuthStore()
  return useQuery({
    queryKey: computed(() => ['class-selection', auth.schoolNumber]),
    enabled: computed(() => auth.isAuthenticated && !auth.demoAccess),
    queryFn: ({ signal }) => loadSelectableClasses(signal),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export async function loadSelectableClasses(signal: AbortSignal) {
  const [groups, tests] = await Promise.all([
    loadList('participated-groups', signal),
    loadList('tests', signal),
  ])
  return matchClasses(groups, tests)
}
