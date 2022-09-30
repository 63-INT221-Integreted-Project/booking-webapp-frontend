<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user";

const route = useRoute();
const userStore = useUserStore();

const dropdownOpen = ref(false);

onMounted(() => {
    listenClickOutside();
});

const navItems = ref([
    {
        name: "Home",
        path: "/kp2",
        text: "หน้าหลัก",
        showMode: ["admin", "student", "lecturer", "guest"],
    },
    {
        name: "Users",
        path: "/kp2/users",
        text: "ผู้ใช้งาน",
        showMode: ["admin"],
    },
    {
        name: "EventCategories",
        path: "/kp2/event-categories",
        text: "หมวดหมู่การจอง",
        showMode: ["admin", "student", "lecturer", "guest"],
    },
    {
        name: "Teams",
        path: "/kp2/teams",
        text: "ทีมของเรา",
        showMode: ["admin", "student", "lecturer", "guest"],
    },
    {
        name: "Login",
        path: "/kp2/login",
        text: "เข้าสู่ระบบ",
        showMode: ["guest"],
    },
]);

function getActiveNavbar(path) {
    return route.name === path;
}

function isShowNavbar(navItem) {
    let role = userStore?.getUserRole();
    if (!role) return navItem.showMode.includes("guest");
    return navItem.showMode.includes(userStore?.getUserRole());
}

function listenClickOutside() {
    document.addEventListener("click", (e) => {
        if (!["dropdown-button", "dropdown-menu"].includes(e.target.id)) {
            dropdownOpen.value = false;
        }
    });
}
</script>

<template>
    <nav
        class="container flex justify-between py-8 mx-auto bg-slate-100 mt-32 px-12"
    >
        <div class="flex items-center">
            <h3 class="text-2xl font-medium text-blue-500">OASIP</h3>
        </div>
        <!-- left header section -->
        <div class="items-center hidden space-x-8 lg:flex">
            <template v-for="item in navItems">
                <a
                    :href="item.path"
                    class="text-black font-bold hover:text-blue-600"
                    :class="{
                        'px-4 py-2 bg-blue-100 rounded-md': getActiveNavbar(
                            item.name
                        ),
                    }"
                    v-if="isShowNavbar(item)"
                >
                    {{ item.text }}
                </a>
            </template>
            <div class="max-w-lg mx-auto" v-if="userStore?.getUserRole()">
                <button
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                    type="button"
                    @click="dropdownOpen = !dropdownOpen"
                    id="dropdown-button"
                >
                    {{ userStore?.getUserName() }}
                    <svg
                        class="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        ></path>
                    </svg>
                </button>

                <!-- Dropdown menu -->
                <div
                    class="bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4 fixed"
                    v-if="dropdownOpen"
                >
                    <div class="px-4 py-3" id="dropdown-menu">
                        <div class="inline">
                            <div class="flex justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-12 h-12"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <span class="text-sm font-bold">
                                {{ userStore?.getUserName() }}</span
                            >
                        </div>
                        <span
                            class="block text-sm font-medium text-gray-900 truncate"
                        >
                            {{ userStore?.getUserEmail() }}</span
                        >
                    </div>
                    <ul class="py-1" aria-labelledby="dropdown">
                        <li class="p-3">
                            <p
                                @click="userStore?.logout()"
                                class="text-sm hover:bg-red-400 hover:text-white hover:rounded-md text-gray-700 block px-3 py-2 cursor-pointer"
                            >
                                Sign out
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<style></style>
