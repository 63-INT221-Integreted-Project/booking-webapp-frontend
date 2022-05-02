<script setup>
import CalendarType from "../components/Home/CalendarType.vue";
import { useRoute } from "vue-router";
import { computed } from "vue-demi";
import ListType from "../components/Home/ListType.vue";

const route = useRoute();

const getTabItem = computed(() => {
    if (route.hash === "#calendar" || !route.hash) {
        return "calendar";
    }
    if (route.hash === "#list") {
        return "list";
    }
});
</script>

<template>
    <div class="block w-full">
        <div class="flex justify-center">
            <ul
                class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400"
            >
                <li class="mr-2">
                    <a
                        href="#calendar"
                        class="inline-block py-3 px-4 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                        :class="{
                            'text-white bg-blue-600': getTabItem === 'calendar',
                        }"
                        aria-current="page"
                        >แบบปฏิทิน</a
                    >
                </li>
                <li class="mr-2">
                    <a
                        href="#list"
                        class="inline-block py-3 px-4 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                        :class="{
                            'text-white bg-blue-600': getTabItem === 'list',
                        }"
                        >แบบตาราง</a
                    >
                </li>
            </ul>
        </div>
        <CalendarType v-if="getTabItem === 'calendar'"></CalendarType>
        <ListType v-if="getTabItem === 'list'"></ListType>
    </div>
</template>

<style></style>
