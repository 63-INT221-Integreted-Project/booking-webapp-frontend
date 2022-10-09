import axios from "axios";
import BaseUrl from "../utils/BaseUrl";

const login = async function (auth) {
    let { data } = await axios.post(`${BaseUrl.getUrl()}/auth/login`, {
        email: auth.email.trim(),
        password: auth.password.trim(),
    });
    return data;
    // return await fetch(`${BaseUrl.getUrl()}/auth/login`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    // email: auth.email.trim(),
    // password: auth.password.trim(),
    //     }),
    // }).then((res) => res.json());
};

const refreshToken = async function () {
    let { data } = await axios.get(`${BaseUrl.getUrl()}/auth/refresh`);
    return data;
};

const fetchProfile = async function () {
    let { data } = await axios.get(`${BaseUrl.getUrl()}/auth/profile`);
    return data;
};

export default {
    login,
    fetchProfile,
    refreshToken,
};
