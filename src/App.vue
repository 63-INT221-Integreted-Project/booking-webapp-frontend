<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
    <Navbar></Navbar>
    <div class="container mt-32 flex mx-auto">
        <router-view></router-view>
    </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@500&display=swap");
body {
    background-color: rgb(249 250 251 / 1);
}
#app {
    font-family: "Kanit", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center;
    color: #2c3e50; */
}
</style>
