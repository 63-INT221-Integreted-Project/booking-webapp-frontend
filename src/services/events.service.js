import BaseUrl from "../utils/BaseUrl";

const addEvent = async function (event) {
    return await fetch(`${BaseUrl.getUrl()}/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bookingName: event.bookingName,
            bookingEmail: event.bookingEmail,
            eventStartTime: event.eventStartTime,
            eventNotes: event.eventNotes,
            eventCategoryId: {
                eventCategoryId: event.eventCategoryId,
            },
        }),
    }).then((res) => res.json());
};

const findAllByBetweenDate = async function (date1, date2) {
    return await fetch(
        `${BaseUrl.getUrl()}/events/check-between?date1=${date1}&date2=${date2}`
    ).then((res) => res.json());
};

const search = async function (dateStart, dateEnd, name, word) {
    return await fetch(
        `${BaseUrl.getUrl()}/events/search?dateStart=${dateStart}&dateEnd=${dateEnd}&name=${name}&word=${word}`
    ).then((res) => res.json());
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
            eventCategory: event.eventCategory,
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
    addEvent,
    findAllByBetweenDate,
    createEvent,
    cancleEvent,
};
