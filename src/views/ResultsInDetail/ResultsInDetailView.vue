<script setup lang="ts">
import { useAllUserItemsNew } from '@/composables/useUserItems'
import styles from './styles.module.css'
import { computed, ref, watch } from 'vue'
import type { ItemsStudentsDataInner } from '@tba3/api-new'
import CrossIcon from './icons/CrossIcon.svg?component'
import CloseIcon from './icons/CloseIcon.svg?component'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/stores/modalStore'
import CheckIcon from './icons/CheckIcon.svg?component'

const { t } = useI18n()
const modalStore = useModalStore()
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

function getHowItWorksHtml(): string {
  return `
   <br/>  
    <h3>${t('resultInDetailsHelp.viewModeTitle')}</h3>   
    <p>${t('resultInDetailsHelp.viewModeDesc')}</p>
    <ul>
      <li><strong>${t('resultInDetails.general')}:</strong> ${t('resultInDetailsHelp.viewModeGeneral')}</li>
      <li><strong>${t('resultInDetails.competenceLevel')} / ${t('resultInDetails.cognitiveDemand')} / ${t('resultInDetails.coreIdea')}:</strong> ${t('resultInDetailsHelp.viewModeDomain')}</li>
    </ul>
    <br/>
    <h3>${t('resultInDetailsHelp.optionsTitle')}</h3>
    <ul>
      <li><strong>${t('resultInDetails.showNumbers')}:</strong> ${t('resultInDetailsHelp.optShowNumbers')}</li>
      <li><strong>${t('resultInDetails.showNotWorkedOn')}:</strong> ${t('resultInDetailsHelp.optShowNotWorkedOn')}</li>
      <li><strong>${t('resultInDetails.groupTasks')}:</strong> ${t('resultInDetailsHelp.optGroupTasks')}</li>
      <li><strong>${t('resultInDetails.fitToScreen')} / ${t('resultInDetails.maximizeArea')}:</strong> ${t('resultInDetailsHelp.optFitToScreen')}</li>
    </ul>
    <br/>
    <h3>${t('resultInDetailsHelp.detailsTitle')}</h3>
    <ul>
      <li>${t('resultInDetailsHelp.detailsFeatures')}</li>
      <li>${t('resultInDetailsHelp.detailsItems')}</li>
    </ul>
    <br/>
    <h3>${t('resultInDetailsHelp.sortingTitle')}</h3>
    <p>${t('resultInDetailsHelp.sortingDesc')}</p>
  `
}

function openHowItWorksModal() {
  modalStore.openModal(t('resultInDetailsHelp.title'), getHowItWorksHtml())
}

const competenceColors: Record<string, string> = {
  '1': '#2DD8FF',
  '2': '#0BC0F2',
  '3': '#01ABE9',
  '4': '#008DEB',
  '5': '#017DDC',
  '6': '#024DE3',
}

const cognitiveColors: Record<string, string> = {
  '1': '#EF74FB',
  '2': '#D433D0',
  '3': '#971ABD',
}

const coreIdeaColors: Record<string, string> = {
  '1': '#BBF066',
  '2': '#89E849',
  '3': '#27E586',
  '4': '#0DCFAF',
  '5': '#01999F',
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

function hasCrossIndicator(
  type: 'musprache' | 'wiederh8' | 'blsf',
  user: ItemsStudentsDataInner,
): boolean {
  if (type === 'musprache') {
    return !isNaN(getLanguage(user))
  }

  if (type === 'wiederh8') {
    return !isNaN(getClassRepeateruser(user))
  }

  if (type === 'blsf') {
    return getBLSF(user) === 1
  }

  return false
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

  if (freq === -1) return { backgroundColor: notWorkedOn.value ? '#FFF' : '#EAEAEA' }
  if (freq === 0) {
    return {
      backgroundColor: '#EAEAEA',
      backgroundImage:
        'linear-gradient(135deg, transparent calc(50% - 1px), #9e9e9e calc(50% - 0.5px), #9e9e9e calc(50% + 0.5px), transparent calc(50% + 1px))',
    }
  }
  if (currentViewMode.value === 'Allgemein') return { backgroundColor: '#008574' }

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

const showLegendPopup = ref(false)

function toggleLegendPopup() {
  showLegendPopup.value = !showLegendPopup.value
}

const showNumbers = ref(false)
const showNotWorkedOn = ref(false)
const fitToScreen = ref(false)
const maximizeArea = ref(false)

function toggleShowNumbers() {
  showNumbers.value = !showNumbers.value
}
function toggleNotWorkedOn() {
  notWorkedOn.value = !notWorkedOn.value
}
function toggleGroupWrongTasks() {
  groupWrongTasks.value = !groupWrongTasks.value
}
function toggleFitToScreen() {
  fitToScreen.value = !fitToScreen.value
}
function toggleMaximizeArea() {
  maximizeArea.value = !maximizeArea.value
}

function extractTaskNumber(text: string) {
  if (!text) return ''

  const match = text.match(/\d+([.,]\d+)?/)

  return match ? match[0] : ''
}

const romanNumbers: Record<string, string> = {
  '1': 'I',
  '2': 'II',
  '3': 'III',
}

function getCompetenceTextColor(key: string): string {
  return Number(key) <= 3 ? '#000000' : '#ffffff'
}

function getCoreIdeaTextColor(key: string, totalCount: number): string {
  return Number(key) === totalCount ? '#ffffff' : '#000000'
}

const selectedUserForPopup = ref<ItemsStudentsDataInner | null>(null)

function openUserPopup(user: ItemsStudentsDataInner) {
  selectedUserForPopup.value = user
}

function closeUserPopup() {
  selectedUserForPopup.value = null
}

const selectedItemForPopup = ref<any | null>(null)

function openItemPopup(item: any) {
  selectedItemForPopup.value = item
}

function closeItemPopup() {
  selectedItemForPopup.value = null
}

function getItemTextColor(item: any): string {
  const freq = item.descriptiveStatistics?.frequency

  if (freq === -1 || freq === 0) return '#000000'

  if (currentViewMode.value === 'Allgemein') return '#ffffff'

  const params = item.parameters

  if (currentViewMode.value === 'Kompetenzstufe') {
    const key = getMetadataValue(params?.competenceLevel)
    return getCompetenceTextColor(key)
  }

  if (currentViewMode.value === 'Anforderungsbereich') {
    return '#ffffff'
  }

  if (currentViewMode.value === 'Leitidee') {
    const key = getMetadataValue(params?.coreIdea)
    const totalCount = Object.keys(coreIdeaColors).length
    return getCoreIdeaTextColor(key, totalCount)
  }

  return '#ffffff'
}
</script>

<template>
  <div :class="[styles.resultsInDetailContainer, 'noPaddingPage']">
    <div :class="styles.controlheaderContainer">
      <div :class="styles.firstRow">
        <h2 :class="styles.title">{{ t('resultInDetails.title') }}</h2>
        <button
          :class="styles.legendButton"
          @click="openHowItWorksModal"
          :aria-label="t('resultInDetails.howItWorks')"
        >
          <span :class="styles.buttonLabel"> {{ t('resultInDetails.howItWorks') }}</span>
          <div :class="styles.buttonIcon">
            <span :class="styles.buttonIconSpan">?</span>
          </div>
        </button>
      </div>
      <div :class="styles.secondRow">
        <button
          @click="currentViewMode = 'Allgemein'"
          :class="[styles.defaultContainer, currentViewMode === 'Allgemein' && styles.activeMode]"
        >
          <span :class="styles.buttonStyle">{{ t('resultInDetails.general') }}</span>
          <div :class="styles.legendRow">
            <div :class="[styles.legendSquare, styles.correctLegend]">
              {{ t('resultInDetails.correct') }}
            </div>
            <div :class="[styles.legendSquare, styles.falseLegend]">
              {{ t('resultInDetails.wrong') }}
            </div>
            <div :class="[styles.legendSquare, styles.notWorkedOnLegend]">
              {{ t('resultInDetails.notWorkedOn') }}
            </div>
          </div>
        </button>
        <button
          :class="[
            styles.competenceContainer,
            currentViewMode === 'Kompetenzstufe' && styles.activeMode,
          ]"
          @click="currentViewMode = 'Kompetenzstufe'"
        >
          <span :class="styles.buttonStyle">{{ t('resultInDetails.competenceLevel') }}</span>
          <div :class="styles.legendRow">
            <div
              v-for="(color, n) in competenceColors"
              :key="'legend-comp-' + n"
              :class="styles.legendSquare"
              :style="{ backgroundColor: color, color: getCompetenceTextColor(String(n)) }"
            >
              {{ n }}
            </div>
          </div>
        </button>
        <button
          :class="[
            styles.requirementsContainer,
            currentViewMode === 'Anforderungsbereich' && styles.activeMode,
          ]"
          @click="currentViewMode = 'Anforderungsbereich'"
        >
          <span :class="styles.buttonStyle">{{ t('resultInDetails.cognitiveDemand') }}</span>
          <div :class="styles.legendRow">
            <div
              v-for="(color, n) in cognitiveColors"
              :key="'legend-cog-' + n"
              :class="styles.legendSquare"
              :style="{ backgroundColor: color, color: '#ffffff' }"
            >
              {{ romanNumbers[n] || n }}
            </div>
          </div>
        </button>
        <button
          :class="[
            styles.guidingIdeasContainer,
            currentViewMode === 'Leitidee' && styles.activeMode,
          ]"
          @click="currentViewMode = 'Leitidee'"
        >
          <span :class="styles.buttonStyle">{{ t('resultInDetails.coreIdea') }}</span>
          <div :class="styles.legendRow">
            <div
              v-for="(color, n) in coreIdeaColors"
              :key="'legend-idea-' + n"
              :class="styles.legendSquare"
              :style="{
                backgroundColor: color,
                color: getCoreIdeaTextColor(String(n), Object.keys(coreIdeaColors).length),
              }"
            >
              {{ n }}
            </div>
          </div>
        </button>
      </div>

      <div :class="styles.thirdRow">
        <button
          :class="[styles.thirdRowBtn, showNumbers && styles.active]"
          @click="toggleShowNumbers"
        >
          <!-- <input type="checkbox" :checked="showNumbers" tabindex="-1" :class="styles.checkbox" /> -->
          <input
            type="checkbox"
            disabled
            v-model="showNumbers"
            :class="styles.visuallyHidden"
            :aria-label="t('classResultsInSubTopics.ariaShowMean')"
          />
          <div :class="[styles.checkboxIcon, showNumbers && styles.checkboxActive]">
            <CheckIcon v-if="showNumbers" aria-hidden="true" />
          </div>
          <span>{{ t('resultInDetails.showNumbers') }}</span>
        </button>

        <button
          :class="[styles.thirdRowBtn, notWorkedOn && styles.active]"
          @click="toggleNotWorkedOn"
        >
          <!-- <input
            type="checkbox"
            v-model="notWorkedOn"
            :checked="notWorkedOn"
            tabindex="-1"
            :class="styles.checkbox"
          /> -->
          <div :class="[styles.checkboxIcon, notWorkedOn && styles.checkboxActive]">
            <CheckIcon v-if="notWorkedOn" aria-hidden="true" />
          </div>
          <span>{{ t('resultInDetails.showNotWorkedOn') }}</span>
        </button>

        <button
          :class="[styles.thirdRowBtn, groupWrongTasks && styles.active]"
          @click="toggleGroupWrongTasks"
        >
          <!-- <input
            type="checkbox"
            :checked="groupWrongTasks"
            v-model="groupWrongTasks"
            tabindex="-1"
            :class="styles.checkbox"
          /> -->
          <div :class="[styles.checkboxIcon, groupWrongTasks && styles.checkboxActive]">
            <CheckIcon v-if="groupWrongTasks" aria-hidden="true" />
          </div>
          <span>{{ t('resultInDetails.groupTasks') }}</span>
        </button>

        <button
          :class="[styles.thirdRowBtn, fitToScreen && styles.active]"
          @click="toggleFitToScreen"
        >
          <!-- <input type="checkbox" :checked="fitToScreen" tabindex="-1" :class="styles.checkbox" /> -->
          <div :class="[styles.checkboxIcon, fitToScreen && styles.checkboxActive]">
            <CheckIcon v-if="fitToScreen" aria-hidden="true" />
          </div>
          <span>{{ t('resultInDetails.fitToScreen') }}</span>
        </button>

        <button
          :class="[styles.thirdRowBtn, maximizeArea && styles.active]"
          @click="toggleMaximizeArea"
        >
          <!-- <input type="checkbox" :checked="maximizeArea" tabindex="-1" :class="styles.checkbox" /> -->
          <div :class="[styles.checkboxIcon, maximizeArea && styles.checkboxActive]">
            <CheckIcon v-if="maximizeArea" aria-hidden="true" />
          </div>
          <span>{{ t('resultInDetails.maximizeArea') }}</span>
        </button>
      </div>
    </div>
    <div
      :class="[
        styles.tableWrapper,
        maximizeArea && styles.maximized,
        fitToScreen && styles.fitToScreenMode,
      ]"
    >
      <div :class="styles.tableContainer">
        <div :class="styles.tableHeaderRow">
          <template v-if="maximizeArea">
            <div
              :class="[styles.metaHeaderColumn, styles.narrowColumn, styles.combinedMetaHeader]"
              title="Sprache | Wiederholer | BLSF"
              @click="toggleLegendPopup"
            ></div>
          </template>

          <template v-else>
            <div
              :class="[styles.metaHeaderColumn, styles.narrowColumn]"
              title="BL/SF: Bes. Lernschwierigkeiten/Sonderpädagogischer Förderbedarf"
              @click="toggleLegendPopup"
            >
              {{ t('resultInDetails.blsfLabel').replace(':', '') }}
            </div>
            <div
              :class="[styles.metaHeaderColumn, styles.narrowColumn]"
              title="KW: Klasse wiederholt"
              @click="toggleLegendPopup"
            >
              {{ t('resultInDetails.kwLabel').replace(':', '') }}
            </div>
            <div :class="[styles.metaHeaderColumn, styles.narrowColumn]" title="HB: Hochbegabung">
              {{ t('resultInDetails.hbLabel').replace(':', '') }}
            </div>
            <div
              :class="[styles.metaHeaderColumn, styles.narrowColumn]"
              title="MND: Muttersprache n. Deutsch"
              @click="toggleLegendPopup"
            >
              {{ t('resultInDetails.mndLabel').replace(':', '') }}
            </div>
          </template>

          <div v-if="showLegendPopup" :class="styles.popupOverlay" @click="showLegendPopup = false">
            <div :class="styles.popupContent" @click.stop>
              <div :class="styles.popupHeader">
                <div :class="styles.popupHeaderRow">
                  <span :class="styles.popupTitle">Schüler*innen Merkmale</span>
                  <CloseIcon aria-hidden="true" @click="showLegendPopup = false" />
                </div>
              </div>
              <div :class="styles.popupBody">
                <div :class="styles.popupRow">
                  <strong>BL/SF:</strong>Bes. Lernschwierigkeiten / Sonderpädagogischer Förderbedarf
                </div>
                <div :class="styles.popupRow"><strong>KW:</strong> Klasse wiederholt</div>
                <div :class="styles.popupRow"><strong>HB:</strong> Hochbegabung</div>
                <div :class="styles.popupRow"><strong>MND:</strong> Muttersprache n. Deutsch</div>
              </div>
            </div>
          </div>
          <div
            :class="[styles.userHeaderColumn, styles.sortableHeader]"
            @click="toggleSort('user')"
          >
            {{ maximizeArea ? t('resultInDetails.sus') : t('resultInDetails.students') }}
            <span v-if="sortKey === 'user'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </div>

          <div
            :class="[styles.itemsHeaderColumn, styles.sortableHeader]"
            @click="toggleSort('score')"
          >
            {{ t('resultInDetails.taskSolutionFrequency') }}
            <span v-if="sortKey === 'score'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
          </div>

          <div
            :class="[styles.hNoteHeaderColumn, styles.sortableHeader, styles.stickyRight]"
            @click="toggleSort('hnote')"
          >
            {{ t('resultInDetails.halfYearGrade') }}
            <span v-if="sortKey === 'hnote'">{{ sortDirection === 'asc' ? '▼' : '▲' }}</span>
          </div>
        </div>

        <div v-if="selectedUserForPopup" :class="styles.popupOverlay" @click="closeUserPopup">
          <div :class="styles.popupContent" @click.stop>
            <div :class="styles.popupHeader">
              <div :class="styles.popupHeaderRow">
                <span :class="styles.popupTitle">{{
                  selectedUserForPopup.code || t('resultInDetails.unknown')
                }}</span>
                <CloseIcon aria-hidden="true" @click="closeUserPopup" style="cursor: pointer" />
              </div>
            </div>
            <div :class="styles.popupBody">
              <div :class="styles.popupRow">
                <span :class="styles.resultStudentText">
                  {{
                    t('resultInDetails.solvedCorrectly', {
                      count: getCorrectItemsCount(selectedUserForPopup),
                      total: getItems(selectedUserForPopup).length,
                      percent: Math.round(
                        100 *
                          (getCorrectItemsCount(selectedUserForPopup) /
                            getItems(selectedUserForPopup).length),
                      ),
                    })
                  }}
                </span>
              </div>
              <div :class="styles.popupRow">
                <strong>{{ t('resultInDetails.halfYearGrade') }}:</strong>
                {{ isNaN(getHNote(selectedUserForPopup)) ? '-' : getHNote(selectedUserForPopup) }}
              </div>
              <div :class="styles.popupRow">
                <strong>{{ t('resultInDetails.specialEdNeeds') }}</strong>
                {{ hasCrossIndicator('blsf', selectedUserForPopup) ? 'Ja' : 'Nein' }}
              </div>
              <div :class="styles.popupRow">
                <strong>{{ t('resultInDetails.classRepeated') }}</strong>
                {{ hasCrossIndicator('wiederh8', selectedUserForPopup) ? 'Ja' : 'Nein' }}
              </div>
              <div :class="styles.popupRow">
                <strong>{{ t('resultInDetails.motherTongueNotGerman') }}</strong>
                {{ hasCrossIndicator('musprache', selectedUserForPopup) ? 'Ja' : 'Nein' }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="sortedData.length" :class="styles.tableBody">
          <div
            v-for="user in sortedData"
            :key="user.code || Math.random().toString()"
            :class="styles.tableRow"
          >
            <template v-if="maximizeArea">
              <div
                :class="[
                  styles.metaColumn,
                  styles.narrowColumn,
                  styles.combinedMetaColumn,
                  styles.stickyLeft,
                ]"
              >
                <div :class="styles.infoIcon">
                  <span :class="styles.infoLabel">i</span>
                </div>
              </div>
            </template>

            <template v-else>
              <div :class="[styles.metaColumn, styles.narrowColumn, styles.stickyLeftBLSF]">
                <CrossIcon v-if="hasCrossIndicator('blsf', user)" aria-hidden="true" />
              </div>
              <div :class="[styles.metaColumn, styles.narrowColumn, styles.stickyLeftKW]">
                <CrossIcon v-if="hasCrossIndicator('wiederh8', user)" aria-hidden="true" />
              </div>
              <div :class="[styles.metaColumn, styles.narrowColumn, styles.stickyLeftHB]">
                <CrossIcon aria-hidden="true" />
              </div>
              <div :class="[styles.metaColumn, styles.narrowColumn, styles.stickyLeftMND]">
                <CrossIcon v-if="hasCrossIndicator('musprache', user)" aria-hidden="true" />
              </div>
            </template>
            <div
              @click="openUserPopup(user)"
              :class="[styles.userColumn, styles.stickyLeftUsers, styles.clickableUser]"
            >
              {{ user.code || 'Unbekannt !!!!!!!!!!!!!!!' }}
            </div>
            <div :class="styles.itemsColumn">
              <div
                v-for="item in getItems(user)"
                :key="item.iqbId"
                :class="styles.itemBadge"
                :style="{
                  ...getItemStyle(item),
                  color: getItemTextColor(item),
                }"
                @click="openItemPopup(item)"
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
              >
                <span v-if="!fitToScreen && showNumbers">{{
                  extractTaskNumber(item.name ?? '')
                }}</span>
              </div>
            </div>
            <div :class="[styles.hNoteColumn, styles.fixedRight]">{{ getHNote(user) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedItemForPopup" :class="styles.popupOverlay" @click="closeItemPopup">
      <div :class="styles.popupContent" @click.stop>
        <div :class="styles.popupHeader">
          <div :class="styles.popupHeaderRow">
            <span :class="styles.popupTitle">
              {{ t('resultInDetails.task') }}
              {{ selectedItemForPopup.name || t('resultInDetails.unknown') }}</span
            >
            <CloseIcon aria-hidden="true" @click="closeItemPopup" style="cursor: pointer" />
          </div>
        </div>
        <div :class="styles.popupBody">
          <div :class="styles.popupRow">
            <strong>IQB-ID:</strong> {{ selectedItemForPopup.iqbId || '-' }}
          </div>
          <div :class="styles.popupRow">
            <strong>{{ t('resultInDetails.statusFrequency') }}</strong>
            {{ selectedItemForPopup.descriptiveStatistics?.frequency ?? 0 }}
          </div>
          <div :class="styles.popupRow">
            <strong>{{ t('resultInDetails.competenceLevel') }}:</strong>
            {{ getMetadataValue(selectedItemForPopup.parameters?.competenceLevel) || '-' }}
          </div>
          <div :class="styles.popupRow">
            <strong>{{ t('resultInDetails.cognitiveDemand') }}:</strong>
            {{ getMetadataValue(selectedItemForPopup.parameters?.cognitiveDemandLevel) || '-' }}
          </div>
          <div :class="styles.popupRow">
            <strong>{{ t('resultInDetails.coreIdea') }}:</strong>
            {{ getMetadataValue(selectedItemForPopup.parameters?.coreIdea) || '-' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
