import { defineStore } from "pinia";
import dayjs from "dayjs";

export const useUtilStore = defineStore("util", {
    state: () => ({
        loadingOverlay: false,
    }),
    actions: {
        setLoadingOverlay(loadingOverlay) {
            this.loadingOverlay = loadingOverlay;
        },
        timeout(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        getHoursAndMinutes(event) {
            return (
                dayjs(event.eventStartTime).format("HH:mm") +
                " - " +
                dayjs(event.eventStartTime)
                    .add(event.eventDuration, "minute")
                    .format("HH:mm")
            );
        },
        dateCompare(date, dateEvent) {
            return (
                dayjs(date).format("YYYY-MM-DD") ===
                dayjs(dateEvent).format("YYYY-MM-DD")
            );
        },
        formatDate(date) {
            return dayjs(date).format("DD/MM/YYYY HH:mm");
        },
        getDate(event) {
            return (
                dayjs(event.eventStartTime).format("DD/MM/YYYY") +
                " - " +
                dayjs(event.eventStartTime)
                    .add(event.eventDuration, "minute")
                    .format("DD/MM/YYYY")
            );
        },
        isNumberOnly(evt) {
            if (evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        },
        isEmailInvalid(email) {
            if (!email) return "กรุณากรอกอีเมล";
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
                return "รูปแบบอีเมลไม่ถูกต้อง";
            return null;
        },
    },
});
