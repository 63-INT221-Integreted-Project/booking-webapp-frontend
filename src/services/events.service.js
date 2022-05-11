import dayjs from "dayjs";
import BaseUrl from "../utils/BaseUrl";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const findAllByBetweenDate = async function (date1, date2) {
    return await fetch(
        `${BaseUrl.getUrl()}/events/check-between?date1=${date1}&date2=${date2}`
    ).then((res) => res.json());
};

const search = async function (dateStart, dateEnd, name, word) {
    if (word == "") {
        if (
            dateStart != "Invalid Date" &&
            dateEnd != "Invalid Date" &&
            name != ""
        ) {
            return await fetch(
                `${BaseUrl.getUrl()}/events/search?dateStart=${dateStart}&dateEnd=${dateEnd}&category=${name}`
            ).then((res) => res.json());
        } else if (
            dateStart != "Invalid Date" &&
            dateEnd != "Invalid Date" &&
            name == ""
        ) {
            return await fetch(
                `${BaseUrl.getUrl()}/events/search/?dateStart=${dateStart}&dateEnd=${dateEnd}`
            ).then((res) => res.json());
        } else if (
            dateStart == "Invalid Date" &&
            dateEnd == "Invalid Date" &&
            name != ""
        ) {
            return await fetch(
                `${BaseUrl.getUrl()}/events/search?category=${name}`
            ).then((res) => res.json());
        } else {
            return await fetch(`${BaseUrl.getUrl()}/events/find/sort/`).then(
                (res) => res.json()
            );
        }
    } else if (word != "") {
        if (
            dateStart != "Invalid Date" &&
            dateEnd != "Invalid Date" &&
            name != ""
        ) {
            return await fetch(
                `${BaseUrl.getUrl()}/events/search?dateStart=${dateStart}&dateEnd=${dateEnd}&category=${name}&word=${word}`
            ).then((res) => res.json());
        } else if (
            dateStart != "Invalid Date" &&
            dateEnd != "Invalid Date" &&
            name == ""
        ) {
            return await fetch(
                `${BaseUrl.getUrl()}/events/search/?dateStart=${dateStart}&dateEnd=${dateEnd}&word=${word}`
            ).then((res) => res.json());
        } else if (
            dateStart == "Invalid Date" &&
            dateEnd == "Invalid Date" &&
            name != ""
        ) {
            return await fetch(
                `${BaseUrl.getUrl()}/events/search?category=${name}&word=${word}`
            ).then((res) => res.json());
        } else {
            return await fetch(`${BaseUrl.getUrl()}/events/find/sort/`).then(
                (res) => res.json()
            );
        }
    } else {
        return await fetch(`${BaseUrl.getUrl()}/events/find/sort/`).then(
            (res) => res.json()
        );
    }
    // โค้ดเดิมโจม
    // return await fetch(
    //     `${BaseUrl.getUrl()}/events/search/filter/test?dateStart=${dateStart}&dateEnd=${dateEnd}&name=${name}&word=${word}`
    // ).then((res) => res.json());
};

const createEvent = async function (event) {
    return await fetch(`${BaseUrl.getUrl()}/events/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bookingName: event.bookingName,
            bookingEmail: event.bookingEmail,
            eventStartTime: event.eventStartTime,
            eventDuration: +event.eventDuration,
            eventNotes: event.eventNotes,
            eventCategoryId: event.eventCategoryId,
        }),
    });
};

const updateEvent = async function (eventId, event) {
    return await fetch(`${BaseUrl.getUrl()}/events/${eventId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            eventStartTime: event.eventStartTime,
            eventNotes: event.eventNotes,
        }),
    });
};

const cancleEvent = async function (eventId) {
    return await fetch(`${BaseUrl.getUrl()}/events/${eventId}`, {
        method: "DELETE",
    });
};

export default {
    search,
    findAllByBetweenDate,
    createEvent,
    cancleEvent,
    updateEvent,
};
