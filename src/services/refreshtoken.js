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

// ผมไปไม่เปง แงง 
//ตัวอย่างจากเว็บ 
// import UserToken from "../models/UserToken.js";
// import jwt from "jsonwebtoken";

// const verifyRefreshToken = (refreshToken) => {
//     const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

//     return new Promise((resolve, reject) => {
//         UserToken.findOne({ token: refreshToken }, (err, doc) => {
//             if (!doc)
//                 return reject({ error: true, message: "Invalid refresh token" });

//             jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
//                 if (err)
//                     return reject({ error: true, message: "Invalid refresh token" });
//                 resolve({
//                     tokenDetails,
//                     error: false,
//                     message: "Valid refresh token",
//                 });
//             });
//         });
//     });
// };

// export default verifyRefreshToken;
