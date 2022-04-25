import BaseUrl from "../utils/BaseUrl";

const findAll = async function () {
    return await fetch(`${BaseUrl.getUrl()}/event-categories/`).then((res) =>
        res.json()
    );
};

export default {
    findAll,
};
