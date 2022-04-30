import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
    state: () => {
        return {
            warningModal: {
                isOpen: false,
                item: null,
            },
            eventCategoryModal: {
                isOpen: false,
                item: null,
            },
        };
    },
    getters: {
        getNameWarningModal() {
            return this.warningModal.item?.eventCategoryName;
        },
    },
    actions: {
        toggleWarningModal(data) {
            this.warningModal = {
                isOpen: data.isOpen,
                item: data.item,
            };
        },
        toggleEventCategoryModal({ isOpen, item }) {
            this.eventCategoryModal = {
                isOpen: isOpen,
                item: item,
            };
        },
    },
});
