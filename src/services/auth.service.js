import BaseUrl from "../utils/BaseUrl";

const login = async function (auth) {
    return await fetch(`${BaseUrl.getUrl()}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: auth.email.trim(),
            password: auth.password.trim(),
        }),
    }).then((res) => res.json());
};

const fetchProfile = async function () {
    return await fetch(`${BaseUrl.getUrl()}/auth/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
};

export default {
    login,
    fetchProfile,
};
