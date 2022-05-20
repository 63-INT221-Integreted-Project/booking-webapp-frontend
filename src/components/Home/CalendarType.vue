<script setup>
import { ref } from "@vue/reactivity";
import { computed, onMounted, defineExpose } from "@vue/runtime-core";
import EventService from "../../services/events.service";
import eventCategoriesService from "../../services/event-categories.service";
import EventDialog from "../_Dialog/EventDialog.vue";
import dayjs from "dayjs";
import { useModalStore } from "../../stores/modal";
import { useUtilStore } from "../../stores/utils";
import ScheduleEventDialog from "../_Dialog/ScheduleEventDialog.vue";
import WarningDialog from "../_Dialog/WarningDialog.vue";
import Tab from "../Tab.vue";

import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const modal = useModalStore();

const util = useUtilStore();

defineExpose({ fetchEvents });

const props = defineProps({
    eventCategories: {
        type: Array,
        default: () => [],
    },
});

const { openBookingEventModal, editBookingEventModal } = modal;

const MONTH_NAMES = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
];
const DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const month = ref(new Date().getMonth());
const year = ref(new Date().getFullYear());
const no_of_days = ref([]);
const blankdays = ref([]);
const events = ref([]);

onMounted(async () => {
    getNoOfDays();
    await fetchEvents();
});

function isToday(date) {
    const today = new Date();
    const d = new Date(year.value, month.value, date);

    return today.toDateString() === d.toDateString();
}
function isEventPass(event) {
    return dayjs(event.eventStartTime).diff(dayjs(), "seconds") < 0;
}

async function fetchEvents() {
    events.value = await EventService.findAllByBetweenDate(
        dayjs
            .utc(new Date(year.value, month.value, no_of_days.value.length))
            .date(1)
            .hour(0)
            .minute(0)
            .second(0)
            .format(),
        dayjs
            .utc(new Date(year.value, month.value, no_of_days.value.length + 1))
            .format("YYYY-MM-DDT[23:59:59Z]")
    );
    if (
        month.value !== new Date().getMonth() ||
        year.value !== new Date().getFullYear()
    ) {
        let eventToday = await EventService.findAllByBetweenDate(
            dayjs.utc().format("YYYY-MM-DDT[00:00:00Z]"),
            dayjs.utc().format("YYYY-MM-DDT[23:59:59Z]")
        );
        events.value.push(...eventToday);
    }
}

function getNoOfDays() {
    if (month.value === -1) {
        month.value = 11;
        year.value--;
    }
    if (month.value === 12) {
        month.value = 0;
        year.value++;
    }
    let daysInMonth = new Date(year.value, month.value + 1, 0).getDate();

    // find where to start calendar day of week
    let dayOfWeek = new Date(year.value, month.value).getDay();
    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
        blankdaysArray.push(i);
    }

    let daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    blankdays.value = blankdaysArray;
    no_of_days.value = daysArray;
}

const getEventInComing = computed(() => {
    return events.value
        .filter((event) => {
            //Create incoming event and ignore on-going and past about 1 hour event
            return (
                dayjs().diff(dayjs(event.eventStartTime), "second") <= 0 &&
                dayjs(event.eventStartTime).diff(dayjs(), "second") <= 3600
            );
        })
        .sort(
            (a, b) =>
                dayjs(a.eventStartTime).unix() - dayjs(b.eventStartTime).unix()
        );
});

const numBookingInThisMonth = computed(() => {
    return events.value.filter((event) => {
        return dayjs(event.eventStartTime).month() === month.value;
    }).length;
});

const getUniqueEventCategory = computed(() => {
    try {
        let uniqueEventCategory = [];
        if (!numBookingInThisMonth.value) return [];
        events.value
            .map((ev) => ev.eventCategory)
            .forEach((ec) => {
                if (
                    uniqueEventCategory
                        .map((uev) => uev.eventCategoryId)
                        .indexOf(ec.eventCategoryId) === -1
                ) {
                    uniqueEventCategory.push(ec);
                }
            });
        return uniqueEventCategory;
    } catch (error) {
        return [];
    }
});

function openEventScheduleModal(date) {
    let dateConvert = dayjs(`${year.value}-${month.value + 1}-${date}`).format(
        "DD/MM/YYYY"
    );
    modal.openScheduleModal({
        title: `การจองประจำวันที่ ${dateConvert}`,
        open: true,
        date: dayjs(`${year.value}-${month.value + 1}-${date}`).format(
            "YYYY-MM-DD"
        ),
        events: events.value.filter(
            (event) =>
                dayjs(event.eventStartTime).format("YYYY-MM-DD") ===
                dayjs(`${year.value}-${month.value + 1}-${date}`).format(
                    "YYYY-MM-DD"
                )
        ),
    });
}

async function backToDateNow() {
    month.value = new Date().getMonth();
    year.value = new Date().getFullYear();
    getNoOfDays();
    await fetchEvents();
}
</script>

<template>
    <div class="grid grid-rows-3 grid-flow-col gap-x-12 gap-y-0 mt-4">
        <ScheduleEventDialog
            v-if="modal.scheduleModal.open"
            :openModal="modal.scheduleModal.open"
            :title="modal.scheduleModal.title"
            :events="modal.scheduleModal.events"
            :date="modal.scheduleModal.date"
            @close="modal.scheduleModal.open = false"
            @bookingThisDate="openBookingEventModal"
            @cancleEvent="modal.toggleWarningModal"
            @editEvent="editBookingEventModal"
        ></ScheduleEventDialog>
        <div class="col-span-3">
            <div
                class="flex flex-col md:flex-row overflow-hidden bg-white rounded-lg shadow-xl w-full p-8"
            >
                <!-- content -->
                <div class="w-full text-gray-800 flex justify-start">
                    <div class="flex flex-col w-full pr-6">
                        <div class="flex flex-wrap justify-between">
                            <h3
                                class="font-semibold text-lg leading-tight truncate mb-4"
                            >
                                การจองที่กำลังจะมาถึง
                            </h3>
                            <h3 class="text-lg leading-tight truncate mb-4">
                                <span class="font-semibold text-green-700"
                                    >{{ getEventInComing.length }}
                                </span>
                                จอง
                            </h3>
                        </div>
                        <div
                            class="flex items-center space-x-4"
                            v-for="event in getEventInComing"
                        >
                            <div class="flex-shrink-0 text-red-500">
                                ({{ util.getHoursAndMinutes(event) }})
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-medium text-gray-900 truncate"
                                >
                                    <span class="font-bold">ชื่อ:</span>
                                    {{ event.bookingName }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-3">
            <div
                class="flex flex-col md:flex-row overflow-hidden bg-white rounded-lg shadow-xl w-full py-4"
            >
                <!-- media -->
                <div class="h-32 flex items-center justify-center px-12">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                </div>
                <!-- content -->
                <div
                    class="w-full text-gray-800 flex items-center justify-end px-12"
                >
                    <div class="text-right flex flex-col">
                        <h3 class="text-lg leading-tight truncate">
                            จองภายในเดือนนี้
                        </h3>
                        <h2 class="font-bold text-2xl leading-tight truncate">
                            {{ numBookingInThisMonth }}
                        </h2>
                    </div>
                    <p
                        class="text-sm text-gray-700 uppercase tracking-wide font-semibold mt-2"
                    ></p>
                </div>
            </div>
        </div>
        <div class="col-span-3">
            <div
                class="flex flex-col md:flex-row overflow-hidden bg-white rounded-lg shadow-xl w-full h-full py-6 pl-6 pr-18"
            >
                <!-- content -->
                <div class="w-full text-gray-800 flex justify-start">
                    <div class="flex flex-col w-full pr-6">
                        <h3
                            class="font-semibold text-lg leading-tight truncate mb-4"
                        >
                            หมวดหมู่ห้องประชุมที่จองในเดือนนี้
                        </h3>
                        <div
                            class="flex items-center space-x-4"
                            v-for="eventCategory in getUniqueEventCategory"
                        >
                            <div class="flex-shrink-0">*</div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-medium text-gray-900 truncate"
                                >
                                    {{ eventCategory.eventCategoryName }}
                                </p>
                            </div>
                            <div
                                class="inline-flex items-center text-base font-semibold text-gray-900 text-right"
                            >
                                {{ eventCategory.eventDuration }} min
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-5 row-span-3">
            <div class="flex justify-between mb-2">
                <button
                    class="h-12 px-5 m-2 bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase p-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    @click="openBookingEventModal"
                >
                    + จองการประชุม
                </button>
                <Tab @back-to-date-now="backToDateNow"></Tab>
            </div>
            <div>
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="flex items-center justify-between py-2 px-6">
                        <div>
                            <span
                                v-text="MONTH_NAMES[month]"
                                class="text-lg font-bold text-gray-800"
                            ></span>
                            <span
                                v-text="year"
                                class="ml-1 text-lg text-gray-600 font-normal"
                            ></span>
                        </div>
                        <div
                            class="border rounded-lg px-1"
                            style="padding-top: 2px"
                        >
                            <button
                                type="button"
                                class="leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center"
                                @click="
                                    month--;
                                    getNoOfDays();
                                    fetchEvents();
                                "
                            >
                                <svg
                                    class="h-6 w-6 text-gray-500 inline-flex leading-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <div class="border-r inline-flex h-6"></div>
                            <button
                                type="button"
                                class="leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1"
                                @click="
                                    month++;
                                    getNoOfDays();
                                    fetchEvents();
                                "
                            >
                                <svg
                                    class="h-6 w-6 text-gray-500 inline-flex leading-none"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="-mx-1 -mb-1">
                        <div
                            class="flex flex-wrap"
                            style="margin-bottom: -40px"
                        >
                            <template v-for="(day, index) in DAYS" :key="index">
                                <div style="width: 14.26%" class="px-2 py-2">
                                    <div
                                        v-text="day"
                                        class="text-gray-600 text-sm uppercase tracking-wide font-bold text-center"
                                    ></div>
                                </div>
                            </template>
                        </div>

                        <div class="flex flex-wrap border-t border-l">
                            <template v-for="blankday in blankdays">
                                <div
                                    style="width: 14.28%; height: 150px"
                                    class="text-center border-r border-b px-4 pt-2"
                                ></div>
                            </template>
                            <template
                                v-for="(date, dateIndex) in no_of_days"
                                :key="dateIndex"
                            >
                                <div
                                    style="width: 14.28%; height: 150px"
                                    class="px-4 pt-2 border-r border-b relative cursor-pointer"
                                    @click="openEventScheduleModal(date)"
                                >
                                    <div
                                        v-text="date"
                                        class="inline-flex w-8 h-8 items-center justify-center text-center leading-none rounded-full transition ease-in-out duration-100"
                                        :class="{
                                            'bg-blue-500 text-white':
                                                isToday(date),
                                            'text-gray-700 hover:bg-blue-200':
                                                +isToday(date),
                                        }"
                                    ></div>
                                    <div
                                        style="height: 120px"
                                        class="overflow-y-auto mt-1"
                                    >
                                        <!-- <div 
										class="absolute top-0 right-0 mt-2 mr-2 inline-flex items-center justify-center rounded-full text-sm w-6 h-6 bg-gray-700 text-white leading-none"
										x-show="events.filter(e => e.event_date === new Date(year, month, date).toDateString()).length"
										x-text="events.filter(e => e.event_date === new Date(year, month, date).toDateString()).length"></div> -->
                                        <template
                                            v-for="(
                                                event, index
                                            ) in events.filter((event) =>
                                                util.dateCompare(
                                                    dayjs(
                                                        `${year}-${
                                                            month + 1
                                                        }-${date}`
                                                    ).format('YYYY-MM-DD'),
                                                    event.eventStartTime
                                                )
                                            )"
                                        >
                                            <div
                                                class="px-2 py-1 rounded-lg mt-1 overflow-hidden border"
                                                :class="{
                                                    'text-gray-600 bg-gray-200 border-gray-300':
                                                        isEventPass(event),
                                                    'border-blue-200 text-blue-800 bg-blue-100':
                                                        !isEventPass(event),
                                                }"
                                                v-if="index <= 1"
                                            >
                                                <p
                                                    v-html="event.bookingName"
                                                    class="text-sm truncate leading-tight"
                                                ></p>
                                            </div>
                                            <div
                                                class="px-2 py-1 rounded-lg mt-1 overflow-hidden border border-gray-400 text-black bg-gray-100"
                                                v-else
                                            >
                                                <p
                                                    class="text-sm truncate leading-tight"
                                                >
                                                    กดคลิกเพื่อดูเพิ่มเติม
                                                </p>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-2"></div>
        </div>
    </div>
</template>

<style></style>
