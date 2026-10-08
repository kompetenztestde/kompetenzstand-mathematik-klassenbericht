import competenceTexts from '@/assets/competence_guidingideas_texts.json'
import { useModalStore } from '@/stores/modalStore'

export function useReportInfo() {
  const modalStore = useModalStore()

  function showReportInfo() {
    const { title, info } = competenceTexts.start
    const formattedBody = info.text.replace(/\.($|\s+)/g, '.<br><br>').trim()
    const content = info.important
      ? `${formattedBody}<br><br><strong>${info.important}</strong>`
      : formattedBody
    modalStore.openModal(title, content)
  }

  return { showReportInfo }
}
