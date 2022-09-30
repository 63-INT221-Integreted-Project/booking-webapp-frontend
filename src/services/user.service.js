import BaseUrl from "../utils/BaseUrl";

const findAll = async function () {
    return await fetch(`${BaseUrl.getUrl()}/users`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    }).then((res) => res.json());
};

const createUser = async function (user) {
    return await fetch(`${BaseUrl.getUrl()}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: user.name.trim(),
            email: user.email.trim(),
            role: user.role,
        }),
    }).then((res) => res.json());
};

const updateUser = async function (userId, user) {
    return await fetch(`${BaseUrl.getUrl()}/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: user.name.trim(),
            email: user.email.trim(),
            role: user.role,
        }),
    }).then((res) => res.json());
};

const deleteUser = async function (userId) {
    await fetch(`${BaseUrl.getUrl()}/users/${userId}`, {
        method: "DELETE",
    });
};

export default {
    findAll,
    createUser,
    updateUser,
    deleteUser,
};
