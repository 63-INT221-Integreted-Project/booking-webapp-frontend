import BaseUrl from "../utils/BaseUrl";
import axios from "axios"

const refreshToken = async function (auth) {
    return await axios.interceptors(`${BaseUrl.getUrl()}/auth/login`, {
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

const interceptorsProfile = async function () {
    return await axios.interceptors(`${BaseUrl.getUrl()}/auth/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
};

export default {
    interceptorsProfile ,
    refreshToken ,
};
