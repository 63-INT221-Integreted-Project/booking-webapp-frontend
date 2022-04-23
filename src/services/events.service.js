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
                id: event.eventCategoryId,
            },
        }),
    }).then((res) => res.json());
};

export default {
    addEvent,
};
