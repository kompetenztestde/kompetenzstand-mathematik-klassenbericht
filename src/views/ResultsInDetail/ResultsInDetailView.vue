<script setup lang="ts">
import { useAllUserItemsNew } from '@/composables/useUserItems'
import styles from './styles.module.css'
import { computed, ref, watch } from 'vue'
import type { ItemsStudentsDataInner } from '@tba3/api-new'

const { data } = useAllUserItemsNew()
const radioButtonTexts = ['Allgemein', 'Kompetenzstufe', 'Anforderungsbereich', 'Leitidee']

const currentViewMode = ref('Allgemein')
const groupWrongTasks = ref(true)
const notWorkedOn = ref(false)
const sortKey = ref<'score' | 'hnote' | 'user'>('score')
const sortDirection = ref<'asc' | 'desc'>('desc')
const enableMultiSort = ref(false)

function getItems(user: ItemsStudentsDataInner) {
  const items = user.items ? [...user.items] : []
  if (!groupWrongTasks.value) return items

  return items.sort(
    (a, b) => (b.descriptiveStatistics?.frequency ?? 0) - (a.descriptiveStatistics?.frequency ?? 0),
  )
}

const competenceColors: Record<string, string> = {
  '1': '#E3F2FD',
  '2': '#BBDEFB',
  '3': '#90CAF9',
  '4': '#64B5F6',
  '5': '#42A5F5',
  '6': '#2196F3',
}

const cognitiveColors: Record<string, string> = {
  '1': '#E8F5E9',
  '2': '#A5D6A7',
  '3': '#66BB6A',
}

const coreIdeaColors: Record<string, string> = {
  '1': '#FFF3E0',
  '2': '#FFE0B2',
  '3': '#FFCC80',
  '4': '#FFB74D',
  '5': '#FFA726',
}

function getCorrectItemsCount(user: ItemsStudentsDataInner): number {
  return getItems(user).filter((item) => item.descriptiveStatistics?.frequency === 1).length
}

function getHNote(user: ItemsStudentsDataInner): number | typeof NaN {
  if (!user.covariates) return NaN
  const hnoteObj = user.covariates.find((cov) => 'hnote' in cov) as any
  const note = hnoteObj?.hnote
  return typeof note === 'number' ? note : NaN
}

function getBLSF(user: ItemsStudentsDataInner): number | typeof NaN {
  if (!user.covariates) return NaN
  const blsfObj = user.covariates.find((cov) => 'blsf' in cov) as any
  const blsf = blsfObj?.blsf
  return typeof blsf === 'number' ? blsf : NaN
}

function getClassRepeateruser(user: ItemsStudentsDataInner): number | typeof NaN {
  if (!user.covariates) return NaN
  const wiederh8Obj = user.covariates.find((cov) => 'wiederh8' in cov) as any
  const wiederh8 = wiederh8Obj?.wiederh8
  return typeof wiederh8 === 'number' ? wiederh8 : NaN
}

function getLanguage(user: ItemsStudentsDataInner): number | typeof NaN {
  if (!user.covariates) return NaN
  const muspracheObj = user.covariates.find((cov) => 'musprache' in cov) as any
  const musprache = muspracheObj?.musprache
  return typeof musprache === 'number' ? musprache : NaN
}

function getCrossIndicator(
  type: 'musprache' | 'wiederh8' | 'blsf',
  user: ItemsStudentsDataInner,
): string {
  if (type === 'musprache') {
    const val = getLanguage(user)
    return !isNaN(val) ? '✗' : ''
  }

  if (type === 'wiederh8') {
    const val = getClassRepeateruser(user)
    return !isNaN(val) ? '✗' : ''
  }

  if (type === 'blsf') {
    const val = getBLSF(user)
    return val === 1 ? '✗' : ''
  }

  return ''
}

function toggleSort(key: 'score' | 'hnote' | 'user') {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = key === 'hnote' ? 'asc' : 'desc'
  }
}

const compareUsers = {
  user: (a: ItemsStudentsDataInner, b: ItemsStudentsDataInner) =>
    (a.code || '').localeCompare(b.code || '', undefined, { numeric: true, sensitivity: 'base' }),

  score: (a: ItemsStudentsDataInner, b: ItemsStudentsDataInner) =>
    getCorrectItemsCount(a) - getCorrectItemsCount(b),

  hnote: (a: ItemsStudentsDataInner, b: ItemsStudentsDataInner) => {
    const numA = getHNote(a),
      numB = getHNote(b)
    if (isNaN(numA) && isNaN(numB)) return 0
    if (isNaN(numA)) return 1
    if (isNaN(numB)) return -1
    return numA - numB
  },
}

const sortedData = computed(() => {
  if (!data.value) return []

  return [...data.value].sort((userA, userB) => {
    if (enableMultiSort.value) {
      const noteResult = compareUsers.hnote(userA, userB)
      if (noteResult !== 0) return noteResult
      return compareUsers.score(userB, userA)
    }

    const modifier = sortDirection.value === 'asc' ? 1 : -1
    return compareUsers[sortKey.value](userA, userB) * modifier
  })
})
function getMetadataValue(obj: any): string {
  if (!obj) return ''
  if (typeof obj !== 'object') return String(obj)
  const val = obj.nameShort ?? obj.code ?? obj.level ?? obj.value ?? obj.number
  return val !== undefined && val !== null ? String(val) : ''
}

function getItemStyle(item: any) {
  const freq = item.descriptiveStatistics?.frequency

  if (freq === -1) return { backgroundColor: notWorkedOn.value ? '#555555' : '#9e9e9e' }
  if (freq === 0) return { backgroundColor: '#9e9e9e' }
  if (currentViewMode.value === 'Allgemein') return { backgroundColor: '#006400' }

  const params = item.parameters
  const modeMappings: Record<string, { param: any; colors: Record<string, string> }> = {
    Kompetenzstufe: { param: params?.competenceLevel, colors: competenceColors },
    Anforderungsbereich: { param: params?.cognitiveDemandLevel, colors: cognitiveColors },
    Leitidee: { param: params?.coreIdea, colors: coreIdeaColors },
  }

  const currentMapping = modeMappings[currentViewMode.value]
  if (currentMapping?.param) {
    const key = getMetadataValue(currentMapping.param)
    if (currentMapping.colors[key]) {
      return { backgroundColor: currentMapping.colors[key] }
    }
  }

  return { backgroundColor: '#2196f3' }
}

watch(
  () => data.value,
  (newData) => {
    console.log('Daten von allen Usern sind da:', newData)
  },
)
</script>

<template>
  <div :class="styles.mainHeaderContainer">
    <div :class="styles.headRow">
      <h2 :class="styles.title">Ergebnisse im Detail</h2>
      <div :class="styles.verticalGroup">
        <label v-for="mode in radioButtonTexts" :key="'radio-' + mode" :class="styles.labelRow">
          <input type="radio" name="detail-options" :value="mode" v-model="currentViewMode" />
          <span>{{ mode }}</span>
        </label>
      </div>

      <div :class="styles.verticalGroup">
        <label :class="styles.labelRow">
          <input type="checkbox" />
          <span>Aufgaben-Nummer</span>
        </label>
        <label :class="styles.labelRow">
          <input type="checkbox" v-model="notWorkedOn" />
          <span>Nicht bearbeitete Aufgaben</span>
        </label>
        <label :class="styles.labelRow">
          <input type="checkbox" v-model="groupWrongTasks" />
          <span>Falsch gelöste Aufgaben gruppieren</span>
        </label>
        <label :class="styles.labelRow">
          <input type="checkbox" />
          <span>Fit-to-Screen</span>
        </label>
      </div>
    </div>

    <div :class="styles.metaGrid">
      <div :class="styles.gridCell" style="grid-area: 1 / 1"><strong>Metadaten</strong></div>
      <div :class="styles.gridCell" style="grid-area: 2 / 1">Kompetenzstufe</div>
      <div :class="styles.gridCell" style="grid-area: 3 / 1">Anforderungsbereich</div>
      <div :class="styles.gridCell" style="grid-area: 4 / 1">Leitidee</div>

      <div :class="styles.gridCell" style="grid-area: 2 / 2">
        <div :class="styles.legendRow">
          <div
            v-for="(color, n) in competenceColors"
            :key="'legend-comp-' + n"
            :class="styles.legendSquare"
            :style="{ backgroundColor: color }"
          >
            {{ n }}
          </div>
        </div>
      </div>
      <div :class="styles.gridCell" style="grid-area: 3 / 2">
        <div :class="styles.legendRow">
          <div
            v-for="(color, roman) in cognitiveColors"
            :key="'legend-cog-' + roman"
            :class="styles.legendSquare"
            :style="{ backgroundColor: color }"
          >
            {{ roman }}
          </div>
        </div>
      </div>
      <div :class="styles.gridCell" style="grid-area: 4 / 2">
        <div :class="styles.legendRow">
          <div
            v-for="(color, n) in coreIdeaColors"
            :key="'legend-idea-' + n"
            :class="styles.legendSquare"
            :style="{ backgroundColor: color }"
          >
            {{ n }}
          </div>
        </div>
      </div>

      <div :class="styles.gridCell" style="grid-area: 1 / 3">
        <strong>Aufgabe allgemein</strong>
      </div>
      <div :class="styles.gridCell" style="grid-area: 2 / 3 / span 3 / 3">
        <div :class="styles.verticalGroup">
          <div :class="styles.labelRow">
            <div :class="[styles.legendSquare, styles.bgDarkGreen]"></div>
            <span>richtig</span>
          </div>
          <div :class="styles.labelRow">
            <div :class="[styles.legendSquare, styles.bgGray]"></div>
            <span>falsch</span>
          </div>
          <div :class="styles.labelRow">
            <div :class="[styles.legendSquare, styles.bgDarkGray]"></div>
            <span>nicht bearbeitet</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div :class="styles.tableWrapper">
    <div :class="styles.tableContainer">
      <div :class="styles.tableHeaderRow">
        <div
          :class="[styles.metaHeaderColumn, styles.narrowColumn]"
          title="Muttersprache (nicht null)"
        >
          Sprache
        </div>
        <div
          :class="[styles.metaHeaderColumn, styles.narrowColumn]"
          title="Klassenwiederholer (nicht null)"
        >
          Wiederh.
        </div>
        <div :class="[styles.metaHeaderColumn, styles.narrowColumn]" title="BLSF (Wert ist 1)">
          BLSF
        </div>
        <div :class="[styles.userHeaderColumn, styles.sortableHeader]" @click="toggleSort('user')">
          User Code
          <span v-if="sortKey === 'user'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
        </div>
        <div
          :class="[styles.itemsHeaderColumn, styles.sortableHeader]"
          @click="toggleSort('score')"
        >
          Aufgaben-Ergebnisse (Items 1-43)
          <span v-if="sortKey === 'score'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
        </div>

        <div
          :class="[styles.hNoteHeaderColumn, styles.sortableHeader]"
          @click="toggleSort('hnote')"
        >
          Halbjahresnote
          <span v-if="sortKey === 'hnote'">{{ sortDirection === 'asc' ? '▼' : '▲' }}</span>
        </div>
      </div>

      <div v-if="sortedData.length" :class="styles.tableBody">
        <div
          v-for="user in sortedData"
          :key="user.code || Math.random().toString()"
          :class="styles.tableRow"
        >
        <div :class="[styles.metaColumn, styles.narrowColumn]">{{ getCrossIndicator('musprache', user) }}</div>
      <div :class="[styles.metaColumn, styles.narrowColumn]">{{ getCrossIndicator('wiederh8', user) }}</div>
      <div :class="[styles.metaColumn, styles.narrowColumn]">{{ getCrossIndicator('blsf', user) }}</div>
          <div :class="styles.userColumn">
            {{ user.code || 'Unbekannt' }}
          </div>
          <div :class="styles.itemsColumn">
            <div
              v-for="item in getItems(user)"
              :key="item.iqbId"
              :class="styles.itemBadge"
              :style="getItemStyle(item)"
              :title="
                `
Aufgabe: ${item.name || 'Unbekannt'}
IQB-ID: ${item.iqbId || '-'}
Frequenz: ${item.descriptiveStatistics?.frequency ?? 0}
---------------------------
Kompetenzstufe: ${getMetadataValue(item.parameters?.competenceLevel) || '-'}
Anforderungsbereich: ${getMetadataValue(item.parameters?.cognitiveDemandLevel) || '-'}
Leitidee: ${getMetadataValue(item.parameters?.coreIdea) || '-'}
    `.trim()
              "
            ></div>
          </div>
          <div :class="styles.hNoteColumn">
            {{ getHNote(user) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
