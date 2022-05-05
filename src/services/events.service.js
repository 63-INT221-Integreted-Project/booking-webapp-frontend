import BaseUrl from "../utils/BaseUrl";

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
            eventCategoryId: event.eventCategoryId,
        }),
    });
};

const updateEvent = async function (eventId, event) {
    return await fetch(`${BaseUrl.getUrl()}/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            eventId: eventId,
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
