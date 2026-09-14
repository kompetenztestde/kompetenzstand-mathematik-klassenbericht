<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import styles from './styles.module.css'
const { t } = useI18n()
</script>
<template>
  <div :class="styles.page">
    <h1 :class="styles.title">
      {{ t('ideasForFuture.firstAdvice.title') }}
    </h1>
    <div :class="styles.firstAdvice">
      <div :class="styles.firstAdviceLeftSide">
        {{ t('ideasForFuture.firstAdvice.text') }}
      </div>
      <div :class="styles.firstAdviceRightSide" class="text-body">
        <span>Diese können z.B. lauten:</span>
        <ul :class="styles.listStyle">
          <li>Veränderte Schwerpunktsetzungen im eigenen Unterricht</li>
          <li>Veränderung des methodisch-didaktischen Vorgehens in relevanten Teilgebieten</li>
          <li>Einzelgespräche mit Schüler:innen sowie Eltern über verbesserte Förderung</li>
          <li>
            Gemeinsame Auswertung der Ergebnisse und Schwerpunktsetzungen in der Fachschaft (z. B.
            Austausch und die gemeinsame Entwicklung von Unterrichtsmaterialien)
          </li>
          <li>
            Fachübergreifende Projekte zur Förderung benötigter Schlüsselkompetenzen (z. B.
            Lesekompetenz)
          </li>
          <li>Nutzung von externer Unterstützung (z. B. Fachberater:innen)</li>
        </ul>
        <span
          >Die Ihnen auf dem Schulportal zur Verfügung stehenden didaktischen Materialien
          unterstützen Sie bei diesen Prozessen. Hier finden Sie Informationen über die Hintergründe
          zu den einzelnen Aufgaben sowie Aufgabenbeispiele für die Unterrichtsgestaltung.</span
        >
      </div>
    </div>

    <div :class="styles.secondAdvice">
      <h1 :class="styles.title">
        {{ t('ideasForFuture.secondAdvice.title') }}
      </h1>
      <span class="text-body" :class="styles.secondAdviceDesc">
        {{ t('ideasForFuture.secondAdvice.text') }}
      </span>
      <div :class="styles.secondAdviceSubMenu">
        <div :class="styles.secondAdviceMiniContainer">
          <h2 :class="styles.secondAdviceMiniTitle">
            {{ t('ideasForFuture.secondAdvice.miniTitle1') }}
          </h2>
          <ul>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.one') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.two') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.three') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints1.four') }}
            </li>
          </ul>
        </div>
        <div :class="styles.secondAdviceMiniContainer">
          <h2 :class="styles.secondAdviceMiniTitle">
            {{ t('ideasForFuture.secondAdvice.miniTitle2') }}
          </h2>
          <ul>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints2.one') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints2.two') }}
            </li>
          </ul>
        </div>
        <div :class="styles.secondAdviceMiniContainer">
          <h2 :class="styles.secondAdviceMiniTitle">
            {{ t('ideasForFuture.secondAdvice.miniTitle3') }}
          </h2>
          <ul>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints3.one') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints3.two') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints3.three') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints3.four') }}
            </li>
            <li>
              {{ t('ideasForFuture.secondAdvice.bulletPoints3.five') }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div :class="styles.thirdAdvice">
      <h1 :class="styles.thirdAdviceTitle">
        {{ t('ideasForFuture.thirdAdvice.title') }}
      </h1>
      <div :class="styles.thirdAdviceMiniContainer">
        <h2>
          {{ t('ideasForFuture.thirdAdvice.miniTitle') }}
        </h2>
        <span>
          {{ t('ideasForFuture.thirdAdvice.text') }}
        </span>
        <div :class="styles.checkList">
          <div :class="styles.checkListItem">
            <input type="checkbox" :class="styles.checkbox" />
            <span>{{ t('ideasForFuture.thirdAdvice.checkList.one') }}</span>
          </div>
          <div :class="styles.checkListItem">
            <input type="checkbox" :class="styles.checkbox" />
            <span>{{ t('ideasForFuture.thirdAdvice.checkList.two') }}</span>
          </div>
          <div :class="styles.checkListItem">
            <input type="checkbox" :class="styles.checkbox" />
            <span>{{ t('ideasForFuture.thirdAdvice.checkList.three') }}</span>
          </div>
          <div :class="styles.checkListItem">
            <input type="checkbox" :class="styles.checkbox" />
            <span>{{ t('ideasForFuture.thirdAdvice.checkList.four') }}</span>
          </div>
          <div :class="styles.checkListItem">
            <input type="checkbox" :class="styles.checkbox" />
            <span>{{ t('ideasForFuture.thirdAdvice.checkList.five') }}</span>
          </div>
          <div :class="styles.checkListItem">
            <input type="checkbox" :class="styles.checkbox" />
            <span>{{ t('ideasForFuture.thirdAdvice.checkList.six') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
