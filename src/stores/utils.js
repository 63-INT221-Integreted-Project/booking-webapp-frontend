import { defineStore } from "pinia";
import dayjs from "dayjs";

export const useUtilStore = defineStore("util", {
    actions: {
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
    },
});
