<script setup>
import dayjs from "dayjs";
import { onMounted, ref } from "vue-demi";
import EventsService from "../../services/events.service";

const events = ref([]);

const form = ref({
    startDateTime: "",
    endDateTime: "",
});

async function filterByDateTime() {
    const { startDateTime, endDateTime } = form.value;
    const startDate = startDateTime
        ? dayjs(startDateTime).format("YYYY-MM-DD HH:mm:ss")
        : dayjs().format("YYYY-MM-DD HH:mm:ss");
    const endDate = endDateTime
        ? dayjs(endDateTime).format("YYYY-MM-DD HH:mm:ss")
        : dayjs().format("YYYY-MM-DD HH:mm:ss");
    events.value = await EventsService.findAllByBetweenDate(startDate, endDate);
}

function getHoursAndMinutes(event) {
    return (
        dayjs(event.eventStartTime).format("HH:mm") +
        " - " +
        dayjs(event.eventStartTime)
            .add(event.eventDuration, "minute")
            .format("HH:mm")
    );
}
</script>

<template>
    <div class="grid grid-rows-3 grid-flow-col gap-x-12 gap-y-0 mt-4">
        <div class="col-span-1">
            <div
                class="overflow-hidden bg-white rounded-lg shadow-xl w-full p-8 h-full"
            >
                <h2 class="text-2xl">กรองข้อมูล</h2>
                <div class="my-8 w-full">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >เลือกหมวดหมู่</label
                    >
                    <select
                        name="cars"
                        id="cars"
                        form="carform"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    >
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
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
                            @input="filterByDateTime"
                            type="datetime-local"
                        />
                        <input
                            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-1/2 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 ml-2"
                            v-model="form.endDateTime"
                            @input="filterByDateTime"
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
                    />
                </div>
                <div class="mb-8 w-full">
                    <button
                        class="bg-red-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-red-600 hover:border-blue rounded"
                    >
                        ล้างข้อมูล
                    </button>
                </div>
            </div>
        </div>
        <div class="col-span-5 row-span-3">
            <div
                class="flex flex-wrap md:flex-row overflow-hidden bg-white rounded-lg shadow-xl w-full p-8 h-[900px]"
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
                    <h2 class="text-2xl text-center">ไม่พบข้อมูล</h2>
                </div>
                <div class="flex flex-col w-full" v-else>
                    <h2 class="block text-xl mb-4">
                        ผลการค้นหาทั้งหมด {{ events.length }} กิจกรรม
                    </h2>
                    <div
                        class="p-6 my-2 bg-gray-50 border-1 rounded-xl shadow-xl"
                        v-for="event in events"
                    >
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="block text-lg">
                                    <span class="text-blue-700 font-bold"
                                        >หมวดหมู่: </span
                                    >{{ event.eventCategory.eventCategoryName }}
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
                                    {{ getHoursAndMinutes(event) }} ({{
                                        event.eventDuration
                                    }}
                                    นาที)
                                </h3>
                            </div>
                            <!-- <div>
                                <h2 class="block text-lg">
                                    {{ getHoursAndMinutes(event) }}
                                </h2>
                                <h3 class="block text-xs">
                                    {{ event.eventDuration }} นาที
                                </h3>
                            </div> -->
                            <div>
                                <button
                                    class="bg-red-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-red-600 hover:border-blue rounded"
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
</template>

<style></style>
