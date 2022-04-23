<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

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

onMounted(() => {
    getNoOfDays();
});

function isToday(date) {
    const today = new Date();
    const d = new Date(year.value, month.value, date);

    return today.toDateString() === d.toDateString();
}

function getNoOfDays() {
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
</script>

<template>
    <div class="grid grid-rows-3 grid-flow-col gap-x-12 gap-y-0">
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
                        <h3
                            class="font-semibold text-lg leading-tight truncate"
                        >
                            การจองวันนี้
                        </h3>
                        <h2
                            class="font-semibold text-2xl leading-tight truncate"
                        >
                            0
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
                        <h3
                            class="font-semibold text-lg leading-tight truncate"
                        >
                            ห้องประชุมในระบบ
                        </h3>
                        <h2
                            class="font-semibold text-2xl leading-tight truncate"
                        >
                            0
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
                        <div class="flex items-center space-x-4">
                            <div class="flex-shrink-0">*</div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-medium text-gray-900 truncate"
                                >
                                    ชื่อหมวดหมู่
                                </p>
                            </div>
                            <div
                                class="inline-flex items-center text-base font-semibold text-gray-900 text-right"
                            >
                                20 min
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-5 row-span-3">
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
                                :class="{
                                    'cursor-not-allowed opacity-25': month == 0,
                                }"
                                :disabled="month == 0 ? true : false"
                                @click="
                                    month--;
                                    getNoOfDays();
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
                                :class="{
                                    'cursor-not-allowed opacity-25':
                                        month == 11,
                                }"
                                :disabled="month == 11 ? true : false"
                                @click="
                                    month++;
                                    getNoOfDays();
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
                                    style="width: 14.28%; height: 120px"
                                    class="text-center border-r border-b px-4 pt-2"
                                ></div>
                            </template>
                            <template
                                v-for="(date, dateIndex) in no_of_days"
                                :key="dateIndex"
                            >
                                <div
                                    style="width: 14.28%; height: 120px"
                                    class="px-4 pt-2 border-r border-b relative"
                                >
                                    <div
                                        @click="showEventModal(date)"
                                        v-text="date"
                                        class="inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100"
                                        :class="{
                                            'bg-blue-500 text-white':
                                                isToday(date) == true,
                                            'text-gray-700 hover:bg-blue-200':
                                                isToday(date) == false,
                                        }"
                                    ></div>
                                    <div
                                        style="height: 80px"
                                        class="overflow-y-auto mt-1"
                                    >
                                        <!-- <div 
										class="absolute top-0 right-0 mt-2 mr-2 inline-flex items-center justify-center rounded-full text-sm w-6 h-6 bg-gray-700 text-white leading-none"
										x-show="events.filter(e => e.event_date === new Date(year, month, date).toDateString()).length"
										x-text="events.filter(e => e.event_date === new Date(year, month, date).toDateString()).length"></div> -->

                                        <template
                                            v-for="event in events.filter(
                                                (e) =>
                                                    new Date(
                                                        e.event_date
                                                    ).toDateString() ===
                                                    new Date(
                                                        year,
                                                        month,
                                                        date
                                                    ).toDateString()
                                            )"
                                        >
                                            <div
                                                class="px-2 py-1 rounded-lg mt-1 overflow-hidden border border-blue-200 text-blue-800 bg-blue-100 blue"
                                            >
                                                <p
                                                    x-text="event.event_title"
                                                    class="text-sm truncate leading-tight"
                                                ></p>
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
