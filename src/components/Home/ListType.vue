<script setup>
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue-demi";
import EventCategoriesService from "../../services/event-categories.service";
import EventService from "../../services/events.service";

import { useModalStore } from "../../stores/modal";
import { useUtilStore } from "../../stores/utils";
import WarningDialog from "../_Dialog/WarningDialog.vue";
import EventDialog from "../_Dialog/EventDialog.vue";

import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const props = defineProps({
    eventCategories: [],
});

defineExpose({ search });

const modal = useModalStore();
const util = useUtilStore();
const events = ref([]);

const form = ref({
    startDateTime: "",
    endDateTime: "",
    eventCategory: "",
    search: "",
});

const arrDate = ref([]);

const getNameEventCategories = computed(() =>
    props.eventCategories.map(
        (eventCategory) => eventCategory.eventCategoryName
    )
);

async function search() {
    let localStartDateTime = dayjs(form.value.startDateTime).format();
    let localEndDateTime = dayjs(form.value.endDateTime).format();
    let data = await EventService.search(
        dayjs.utc(localStartDateTime).format(),
        dayjs.utc(localEndDateTime).format(),
        form.value.eventCategory,
        form.value.search
    );
    createUniqueDate(data);
    events.value = data;
}

function createUniqueDate(events) {
    arrDate.value = [];
    for (let event of events) {
        let startDate = dayjs(event.eventStartTime).format("DD/MM/YYYY");
        //* กรณีที่ startDate เท่ากับใน Array หรือเปล่า
        if (!arrDate.value.map((data) => data.text).includes(startDate)) {
            arrDate.value.push({
                text: startDate,
                value: dayjs(event.eventStartTime).format("YYYY-MM-DD"),
            });
        }
    }
}

function clearInputFilter() {
    form.value = {
        startDateTime: "",
        endDateTime: "",
        eventCategory: "",
        search: "",
    };
}

function warningCancleEvent(event) {
    modal.warningModal = {
        isOpen: true,
        item: event,
    };
}

async function submitCancleEvent(event) {
    await EventService.cancleEvent(event.eventId);
    modal.warningModal = {
        isOpen: false,
        item: null,
    };
    await search();
}

function isCanModifyEvent(event) {
    return dayjs().diff(dayjs(event.eventStartTime), "second") <= 0;
}

function editEvent(event) {
    modal.editBookingEventModal(event);
}
</script>

<template>
    <div class="grid grid-rows-3 grid-flow-col gap-x-12 gap-y-0 mt-4">
        <WarningDialog
            v-if="modal.warningModal.isOpen"
            :openModal="modal.warningModal.isOpen"
            :item="modal.warningModal.item"
            @close="modal.toggleWarningModal({ isOpen: false, item: null })"
            @remove="submitCancleEvent"
            :name="modal.getNameWarningModal('event')"
        ></WarningDialog>
        <div class="col-span-1">
            <div class="bg-white rounded-lg shadow-xl w-full p-8 h-full">
                <h2 class="text-2xl">กรองข้อมูล</h2>
                <div class="my-8 w-full">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >เลือกหมวดหมู่</label
                    >
                    <select
                        name="cars"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        placeholder="--- เลือกหมวดหมู่ ---"
                        v-model="form.eventCategory"
                    >
                        <option
                            v-for="(ec, index) in getNameEventCategories"
                            :key="index"
                            :value="ec"
                        >
                            {{ ec }}
                        </option>
                    </select>
                </div>
                <div class="mb-8 w-full">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >เลือกตามช่วงเวลา</label
                    >
                    <div class="flex justify-between">
                        <input
                            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-1/2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 mr-2"
                            placeholder="วันที่"
                            v-model="form.startDateTime"
                            type="datetime-local"
                        />
                        <input
                            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-1/2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 ml-2"
                            v-model="form.endDateTime"
                            placeholder="สิ้นสุด"
                            type="datetime-local"
                        />
                    </div>
                </div>
                <div class="mb-8 w-full">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ค้นหาโดยภาพรวม</label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.search"
                    />
                </div>
                <div class="mb-8 w-full flex justify-end">
                    <button
                        class="transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-2 px-4 border-b-4 border-blue-600 hover:border-blue-700 rounded mr-4"
                        @click="search"
                    >
                        ค้นหา
                    </button>
                    <button
                        class="transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 bg-red-500 hover:bg-red-600 text-white font-extrabold py-2 px-4 border-b-4 border-red-600 hover:border-red-700 rounded"
                        @click="clearInputFilter"
                    >
                        ล้างข้อมูล
                    </button>
                </div>
            </div>
        </div>
        <div class="col-span-5 row-span-3">
            <div
                class="overflow-y-scroll flex flex-wrap md:flex-row bg-white rounded-lg shadow-xl w-full p-8 h-[900px]"
            >
                <div
                    class="flex flex-col items-center justify-center w-full"
                    v-if="!events.length"
                >
                    <img
                        src="/images/_svg/no-data.svg"
                        alt="calendar"
                        width="500"
                    />
                    <h2 class="text-2xl text-center">ไม่มีข้อมูลการจอง</h2>
                </div>
                <div class="flex flex-col w-full" v-else>
                    <h2 class="block text-xl mb-4">
                        ผลการค้นหาทั้งหมด {{ events.length }} การจอง
                    </h2>
                    <div v-for="date in arrDate" class="my-6">
                        <div class="border-l-8 border-blue-600">
                            <h2 class="text-3xl pl-4">
                                {{ date.text }}
                            </h2>
                        </div>
                        <div
                            class="p-6 my-2 bg-gray-50 border-1 rounded-xl shadow-xl"
                            v-for="event in events.filter((e) =>
                                util.dateCompare(date.value, e.eventStartTime)
                            )"
                        >
                            <div class="flex justify-between items-center">
                                <div>
                                    <h2 class="block text-lg">
                                        <span class="text-blue-700 font-bold"
                                            >หมวดหมู่: </span
                                        >{{
                                            event.eventCategory
                                                .eventCategoryName
                                        }}
                                    </h2>
                                    <h2 class="block text-lg">
                                        <span class="text-blue-500 font-bold"
                                            >ชื่อการจอง: </span
                                        >{{ event.bookingName }}
                                    </h2>
                                    <h3 class="block text-lg">
                                        <span class="text-blue-500 font-bold"
                                            >อีเมล:
                                        </span>
                                        {{ event.bookingEmail }}
                                    </h3>
                                    <h3 class="block text-lg">
                                        <span class="text-blue-500 font-bold"
                                            >ระยะเวลา:
                                        </span>
                                        {{ util.getHoursAndMinutes(event) }} ({{
                                            event.eventDuration
                                        }}
                                        นาที)
                                    </h3>
                                    <h3 class="block text-lg">
                                        <span class="text-blue-500 font-bold"
                                            >หมายเหตุ:
                                        </span>
                                        <span
                                            v-if="!event.eventNotes"
                                            class="text-gray-400 italic font-thin"
                                            >ไม่มีหมายเหตุ</span
                                        >
                                        <span v-else>
                                            {{ event.eventNotes }}
                                        </span>
                                    </h3>
                                </div>
                                <div v-if="isCanModifyEvent(event)">
                                    <div class="block mb-2">
                                        <button
                                            class="bg-yellow-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-yellow-600 rounded mr-2"
                                            @click="editEvent(event)"
                                        >
                                            แก้ไขการจอง
                                        </button>
                                    </div>
                                    <div class="block">
                                        <button
                                            class="bg-red-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-red-600 hover:border-blue rounded"
                                            @click="warningCancleEvent(event)"
                                        >
                                            ยกเลิกการจอง
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
