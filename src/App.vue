<script setup>
import Navbar from "./components/Navbar.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";

import { useUtilStore } from "./stores/utils";
import { computed } from "@vue/reactivity";
import { onMounted } from "vue";
import { useUserStore } from "./stores/user";
const userStore = useUserStore();

const util = useUtilStore();

onMounted(async () => {
    await userStore.fetchUser();
});

const getOverlay = computed(() => {
    return util.loadingOverlay;
});
</script>

<template>
    <Navbar></Navbar>
    <div class="container mt-16 flex mx-auto">
        <LoadingOverlay v-if="getOverlay" class="z-20"></LoadingOverlay>
        <router-view></router-view>
    </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@500&display=swap");
#app {
    font-family: "Kanit", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center;
    color: #2c3e50; */
}
</style>
