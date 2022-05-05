<script setup>
import { ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import EventService from "@/services/events.service";
import EventCategoriesService from "@/services/event-categories.service";
import EventDialog from "@/components/_Dialog/EventDialog.vue";
import dayjs from "dayjs";

import { useModalStore } from "../../stores/modal";
import ScheduleEventDialog from "../_Dialog/ScheduleEventDialog.vue";
import WarningDialog from "../_Dialog/WarningDialog.vue";

const modal = useModalStore();

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
const eventCategories = ref([]);
const eventModal = ref({
    open: false,
    event: {},
    isInvalid: false,
    errorType: [],
});
const scheduleModal = ref({
    open: false,
    events: [],
    title: "",
    date: "",
});

onMounted(async () => {
    getNoOfDays();
    await fetchEvents();
    eventCategories.value = await getEventCategories();
});

function isToday(date) {
    const today = new Date();
    const d = new Date(year.value, month.value, date);

    return today.toDateString() === d.toDateString();
}

async function fetchEvents() {
    events.value = await EventService.findAllByBetweenDate(
        dayjs(new Date(year.value, month.value, 1)).format(
            "YYYY-MM-DD HH:mm:ss"
        ),
        dayjs(
            new Date(year.value, month.value, no_of_days.value.length)
        ).format("YYYY-MM-DD [23:59:59]")
    );
}

async function getEventCategories() {
    return await EventCategoriesService.findAll();
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

//*Create convert function from example 2022-4-24T01:30:00.000-05:00 to 2022-4-24 01:30:00
function formatDate(date) {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}

function dateCompare(date, dateEvent) {
    return (
        dayjs(`${year.value}-${month.value + 1}-${date}`).format(
            "YYYY-MM-DD"
        ) === dayjs(dateEvent).format("YYYY-MM-DD")
    );
}

const bookingToday = computed(() => {
    return events.value.filter((event) =>
        dateCompare(dayjs().date(), event.eventStartTime)
    ).length;
});

const bookingInThisMonth = computed(() => {
    return events.value.length;
});

const getUniqueEventCategory = computed(() => {
    try {
        let uniqueEventCategory = [];
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
    scheduleModal.value = {
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
    };
}

function openBookingEventModal(date) {
    scheduleModal.value.open = false;
    eventModal.value = {
        open: true,
        event: {
            eventStartTime: dayjs(date).format("YYYY-MM-DDTHH:mm"),
        },
        isInvalid: false,
        errorType: [],
        title: `เพิ่ม Event`,
    };
}

function validate(form) {
    eventModal.value.errorType = [];
    if (
        !form.bookingName ||
        !form.bookingEmail ||
        !form.eventDuration ||
        !form.eventCategory ||
        !form.eventStartTime ||
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(form.bookingEmail)
    ) {
        if (!form.bookingName) {
            eventModal.value.errorType.push("- กรุณากรอกชื่อผู้จอง");
        }
        if (!form.bookingEmail) {
            eventModal.value.errorType.push("- กรุณากรอกอีเมลผู้จอง");
        }
        if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(
                form.bookingEmail
            )
        ) {
            eventModal.value.errorType.push("- รูปแบบอีเมลไม่ถูกต้อง");
        }
        if (!form.eventStartTime) {
            eventModal.value.errorType.push("- กรุณากรอกเวลาเริ่มการจอง");
        }
        if (!form.eventCategory) {
            eventModal.value.errorType.push("- กรุณาเลือกหมวดหมู่การจอง");
        }
        if (!form.eventDuration) {
            eventModal.value.errorType.push("- กรุณากรอกระยะเวลาการจอง");
        }
        if (isNaN(form.eventDuration)) {
            eventModal.value.errorType.push("- ระยะเวลาต้องเป็นตัวเลขเท่านั้น");
        }
        if (!form.eventDuration >= 1 && !form.eventDuration <= 480) {
            eventModal.value.errorType.push(
                "- ช่วงระยะเวลาในการจองต้องอยู่ในช่วง 1 - 480 นาที"
            );
        }
        eventModal.value.isInvalid = true;
        return false;
    }
    return true;
}

async function addEvent(form) {
    if (!validate(form)) return;
    let findIsInRange = events.value.find((event) => {
        if (event.eventCategory.eventCategoryName !== form.eventCategory)
            return undefined;
        let startFromEvent = dayjs(event.eventStartTime).format(
            "YYYY-MM-DD HH:mm"
        );
        let startFromForm = dayjs(form.eventStartTime).format(
            "YYYY-MM-DD HH:mm"
        );
        let endFromEvent = dayjs(event.eventStartTime)
            .add(event.eventDuration, "minute")
            .format("YYYY-MM-DD HH:mm");
        let endFromForm = dayjs(form.eventStartTime)
            .add(form.eventDuration, "minute")
            .format("YYYY-MM-DD HH:mm");
        return (
            (startFromForm >= startFromEvent &&
                startFromForm <= endFromEvent) ||
            (endFromForm >= startFromEvent && endFromForm <= endFromEvent)
        );
    });
    if (findIsInRange) {
        eventModal.value.isInvalid = true;
        eventModal.value.errorType = ["- หมวดหมู่นี่มีการจองในช่วงเวลานี้แล้ว"];
        return;
    }
    await EventService.createEvent({
        ...form,
        eventCategoryId: eventCategories.value.find(
            (eventCategory) =>
                eventCategory.eventCategoryName === form.eventCategory
        ).eventCategoryId,
        eventStartTime: dayjs(form.eventStartTime).format(
            "YYYY-MM-DD HH:mm:ss"
        ),
    });
    await fetchEvents();
    eventModal.value = {
        open: false,
        event: {},
        isInvalid: false,
        errorType: [],
    };
}

function warningCancleEvent(event) {
    scheduleModal.value.open = false;
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
    await fetchEvents();
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
        <EventDialog
            v-if="eventModal.open"
            :openModal="eventModal.open"
            :title="eventModal.title"
            :event="eventModal.event"
            :errorType="eventModal.errorType"
            :eventCategories="eventCategories"
            :isInvalid="eventModal.isInvalid"
            @close="eventModal.open = false"
            @onSave="addEvent"
        />
        <ScheduleEventDialog
            v-if="scheduleModal.open"
            :openModal="scheduleModal.open"
            :title="scheduleModal.title"
            :events="scheduleModal.events"
            :date="scheduleModal.date"
            @close="scheduleModal.open = false"
            @bookingThisDate="openBookingEventModal"
            @cancleEvent="warningCancleEvent"
        ></ScheduleEventDialog>

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
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                    </svg>
                </div>
                <!-- content -->
                <div
                    class="w-full text-gray-800 flex items-center justify-end px-12"
                >
                    <div class="text-right flex flex-col">
                        <h3 class="text-lg leading-tight truncate">
                            การจองวันนี้
                        </h3>
                        <h2 class="font-bold text-2xl leading-tight truncate">
                            {{ bookingToday }}
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
                            {{ bookingInThisMonth }}
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
                            หมวดหมู่ห้องประชุม
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
            <div class="flex justify-end mb-2">
                <button
                    class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    @click="openBookingEventModal"
                >
                    + จองการประชุม
                </button>
            </div>
            <div>
                <!-- <div class="font-bold text-gray-800 text-xl mb-4">
				Schedule Tasks
			</div> -->

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
                                    class="px-4 pt-2 border-r border-b relative"
                                >
                                    <div
                                        @click="openEventScheduleModal(date)"
                                        v-text="date"
                                        class="inline-flex w-8 h-8 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100"
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
                                            ) in events.filter((e, i) =>
                                                dateCompare(
                                                    date,
                                                    e.eventStartTime
                                                )
                                            )"
                                        >
                                            <div
                                                class="px-2 py-1 rounded-lg mt-1 overflow-hidden border border-blue-200 text-blue-800 bg-blue-100"
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
