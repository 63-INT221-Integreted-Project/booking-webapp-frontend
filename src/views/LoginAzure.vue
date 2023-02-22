<template></template>

<script setup>
import { myMSAL, params } from "../authConfig";
import { ref, onBeforeMount } from "vue";
import AuthService from "../services/auth.service";
const setUser = (userInput) => {
    const user = {
        name: "",
        role: "",
        email: "",
    };
    user.name = userInput.name;
    try {
        user.role = userInput.idToken.roles[0];
    } catch {
        user.role = "guest";
    }
    user.email = userInput.userName;
    return user;
};

async function getToken() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    try {
        const login = await myMSAL.acquireTokenSilent(params);
        const userAd = setUser(myMSAL.getAccount(params));
        let res = await AuthService.loginAzure(userAd);
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        window.location.href = "/kp2/";
        return login.accessToken;
    } catch (error) {
        await myMSAL.loginPopup(params);
        const login = await myMSAL.acquireTokenSilent(params);
        const userAd = setUser(myMSAL.getAccount(params));
        let res = await AuthService.loginAzure(userAd);
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        window.location.href = "/kp2/";
        return login.accessToken;
    }
}
onBeforeMount(() => {
    getToken();
});
// import { useIsAuthenticated } from "../composition-api/useIsAuthenticated";
// import { useMsalAuthentication } from "../composition-api/useMsalAuthentication";
// import { InteractionType } from "@azure/msal-browser";
// import { reactive, ref, watch } from "vue";
// import { loginRequest } from "../authConfig";

// const { result, acquireToken } = useMsalAuthentication(
//   InteractionType.Redirect,
//   loginRequest
// );

// const data = ref(null);

// const isAuthenticated = useIsAuthenticated();
// async function updateData() {
//   if (result.value.accessToken) {
//     const apiResult = await callAPI(result.value.accessToken).catch(() =>
//       acquireToken()
//     );
//     data.value = apiResult;
//   }
// }

// updateData();

// watch(result, () => {
//   // Fetch new data from the API each time the result changes (i.e. a new access token was acquired)
//   updateData();
// });

// function callAPI(accessToken: any) {
//   throw new Error("Function not implemented.");
// }
</script>
