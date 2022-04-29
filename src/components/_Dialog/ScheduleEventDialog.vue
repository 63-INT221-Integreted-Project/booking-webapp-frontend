<script setup>
import dayjs from "dayjs";

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    events: {
        type: Array,
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
                <h2 class="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                    {{ title }}
                </h2>
                <div class="flex justify-end">
                    <button
                        class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                    >
                        + จองวันนี้
                    </button>
                </div>
                <div v-if="!events.length">
                    <div class="text-center p-12">
                        <div class="text-gray-800 text-xl">
                            ไม่มีกิจกรรมในวันนี้
                        </div>
                    </div>
                </div>

                <div class="mt-4" v-else>
                    <div
                        class="p-6 my-2 bg-red-50 rounded-lg shadow-lg"
                        v-for="event in props.events"
                    >
                        <div class="flex justify-between">
                            <div>
                                <h2 class="block text-lg">
                                    {{ event.bookingName }}
                                </h2>
                                <h3 class="block text-xs">
                                    {{ event.bookingEmail }}
                                </h3>
                            </div>
                            <div>
                                <h2 class="block text-lg">
                                    {{
                                        getHoursAndMinutes(event.eventStartTime)
                                    }}
                                </h2>
                                <h3 class="block text-xs">
                                    {{ event.eventDuration }} นาที
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
