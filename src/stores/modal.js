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
    actions: {
        getNameWarningModal(type) {
            let name = {
                "event-category": this.warningModal.item?.eventCategoryName,
                event: this.warningModal.item?.bookingName,
            };
            return name[type];
        },
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
