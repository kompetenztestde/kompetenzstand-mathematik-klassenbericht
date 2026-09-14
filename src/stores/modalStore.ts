import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
    const isOpen = ref(false);
    const title = ref('');
    const content = ref('');

    function openModal(newTitle: string, newContent: string) {
        title.value = newTitle;
        content.value = newContent;
        isOpen.value = true;
    }

    function closeModal() {
        isOpen.value = false;
    }

    return { isOpen, title, content, openModal, closeModal };
});