import { defineStore } from "pinia";
import dayjs from "dayjs";

export const useModalStore = defineStore("modal", {
    state: () => {
        return {
            eventModal: {
                open: false,
                event: {},
                title: "",
                isInvalid: false,
                errorType: [],
            },
            warningModal: {
                isOpen: false,
                item: null,
            },
            scheduleModal: {
                open: false,
                events: [],
                title: "",
                date: "",
            },
            eventCategoryModal: {
                isOpen: false,
                item: null,
            },
        };
    },
    actions: {
        clearEventModal() {
            this.eventModal = {
                open: false,
                event: {},
                isInvalid: false,
                errorType: [],
            };
        },
        openBookingEventModal(date, event) {
            this.scheduleModal.open = false;
            this.eventModal = {
                open: true,
                //*กรณีมี event หรือเราจะอัพเดท ให้ใช้ Logic แรก
                ...(event
                    ? {
                          event: {
                              ...event,
                              eventCategory:
                                  event.eventCategory.eventCategoryName,
                              eventStartTime: dayjs(
                                  event.eventStartTime
                              ).format("YYYY-MM-DDTHH:mm"),
                          },
                      }
                    : {
                          event: {
                              eventStartTime:
                                  dayjs(date).format("YYYY-MM-DDTHH:mm"),
                          },
                      }),
                isInvalid: false,
                errorType: [],
                title: `เพิ่ม Event`,
            };
        },
        openScheduleModal(scheduleModal) {
            this.scheduleModal = scheduleModal;
        },
        editBookingEventModal(event) {
            this.openBookingEventModal(null, event);
        },
        getNameWarningModal(type) {
            let name = {
                "event-category": this.warningModal.item?.eventCategoryName,
                event: this.warningModal.item?.bookingName,
            };
            return name[type];
        },
        toggleWarningModal(data) {
            this.scheduleModal.open = false;
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
