<script setup>
import { ref } from "vue-demi";

const teams = ref([
    {
        name: "Karunpat Promvisut",
        id: "63130500002",
        img: "https://i.imgur.com/8Km9tLL.jpg",
    },
    {
        name: "Thiraphat Ita",
        id: "63130500060",
        img: "https://i.imgur.com/8Km9tLL.jpg",
    },
    {
        name: "Karunpat Promvisut",
        id: "63130500002",
        img: "https://i.imgur.com/8Km9tLL.jpg",
    },
]);
</script>
<template>
    <div class="flex w-full justify-between">
        <div
            v-for="(team, index) in teams"
            class="rounded-3xl bg-slate-200 my-3 p-24 relative"
            :key="index"
        >
            <div
                class="absolute top-[-5%] bottom-0 left-[50%] translate-x-[-50%]"
            >
                <img
                    src="https://i.imgur.com/8Km9tLL.jpg"
                    class="rounded-full border-solid border-white border-2 -mt-8 w-32"
                />
            </div>
            <h2 class="text-center text-2xl">{{ team.id }}</h2>
            <h3 class="text-center text-xl">{{ team.name }}</h3>
        </div>
    </div>
</template>

<style></style>
