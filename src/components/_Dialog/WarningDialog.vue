<script setup>
import dayjs from "dayjs";

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        default: "",
    },
    item: {
        type: Object,
        default: null,
    },
});
const emit = defineEmits(["close"]);

function getHoursAndMinutes(dateTime) {
    return dayjs(dateTime).format("HH:mm");
}
</script>

<template>
    <div
        style="background-color: rgba(0, 0, 0, 0.8)"
        class="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
        v-show.transition.opacity="openModal"
        @click.self.prevent="emit('close', !openModal)"
    >
        <div
            class="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden top-[25%]"
        >
            <div
                class="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
                @click="emit('close', !openModal)"
            >
                <svg
                    class="fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"
                    />
                </svg>
            </div>

            <div
                class="shadow w-full rounded-lg bg-white overflow-hidden w-full block p-8"
            >
                <!-- <h2 class="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                    {{ title }}
                </h2> -->

                <div class="mt-12">
                    <div class="flex justify-center">
                        <img src="_svg/warning.png" alt="logo" class="w-32" />
                    </div>
                    <div class="text-center p-12">
                        <div class="text-gray-800 text-2xl">
                            คุณต้องการจะลบ {{ name }} หรือไม่ ?
                        </div>
                        <div class="text-gray-600 text-lg mt-2">
                            คุณจะไม่สามารถกู้คืนข้อมูลได้
                            {{ item }}
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <button
                        type="button"
                        class="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
                        @click="emit('close', !openModal)"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="button"
                        class="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 border border-green-700 rounded-lg shadow-sm"
                        @click="emit('remove', item.eventCategoryId)"
                    >
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
