<script setup>
import CalendarType from "../components/Home/CalendarType.vue";
import { useRoute } from "vue-router";
import ListType from "../components/Home/ListType.vue";
import EventService from "../services/events.service";
import { computed, onMounted, ref } from "vue-demi";
import EventDialog from "../components/_Dialog/EventDialog.vue";
import EventCategoriesService from "../services/event-categories.service";
import dayjs from "dayjs";
import { useModalStore } from "../stores/modal";
import WarningDialog from "../components/_Dialog/WarningDialog.vue";
import utc from "dayjs/plugin/utc";
import Sweetalert from "sweetalert2";
import { useUtilStore } from "../stores/utils";

dayjs.extend(utc);

const util = useUtilStore();

const calendarType = ref(null);
const listType = ref(null);

const route = useRoute();

const modal = useModalStore();

const eventCategories = ref([]);

onMounted(async () => {
    eventCategories.value = await getEventCategories();
});

const getTabItem = computed(() => {
    if (route.hash === "#calendar" || !route.hash) {
        return "calendar";
    }
    if (route.hash === "#list") {
        return "list";
    }
});

async function getEventCategories() {
    return await EventCategoriesService.findAll();
}

function validate(form) {
    modal.eventModal.isInvalid = false;
    modal.eventModal.errorType = [];
    if (
        !form.bookingName ||
        !form.bookingEmail ||
        !form.eventDuration ||
        !form.eventCategory ||
        form.eventStartTime === "Invalid Date" ||
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(form.bookingEmail)
    ) {
        if (!form.bookingName) {
            modal.eventModal.errorType.push("- กรุณากรอกชื่อการจอง");
        }
        if (!form.bookingEmail) {
            modal.eventModal.errorType.push("- กรุณากรอกอีเมลผู้จอง");
        }
        if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(
                form.bookingEmail
            )
        ) {
            modal.eventModal.errorType.push("- รูปแบบอีเมลไม่ถูกต้อง");
        }
        if (form.eventStartTime === "Invalid Date") {
            modal.eventModal.errorType.push("- กรุณากรอกเวลาเริ่มการจอง");
        }
        if (!form.eventCategory) {
            modal.eventModal.errorType.push("- กรุณาเลือกหมวดหมู่การจอง");
        }
        if (!form.eventDuration) {
            modal.eventModal.errorType.push("- กรุณากรอกระยะเวลาการจอง");
        }
        if (isNaN(form.eventDuration)) {
            modal.eventModal.errorType.push("- ระยะเวลาต้องเป็นตัวเลขเท่านั้น");
        }
        if (!form.eventDuration >= 1 && !form.eventDuration <= 480) {
            modal.eventModal.errorType.push(
                "- ช่วงระยะเวลาในการจองต้องอยู่ในช่วง 1 - 480 นาที"
            );
        }
        modal.eventModal.isInvalid = true;
        return false;
    }
    return true;
}

async function saveEvent({ event: form, file }) {
    if (!validate(form)) return;
    try {
        util.setLoadingOverlay(true);
        let localTime = dayjs(form.eventStartTime).format(
            "YYYY-MM-DDTHH:mm:ssZ"
        );
        let utcTime = dayjs.utc(localTime);
        let events = await EventService.findAllByBetweenDate(
            utcTime.hour(0).minute(0).second(0).format(),
            utcTime.hour(23).minute(59).second(59).format()
        );

        let findIsInRange = events.find((event) => {
            if (
                event.eventCategory.eventCategoryName === form.eventCategory &&
                form.eventId === event.eventId
            )
                return undefined;
            let startFromEvent = dayjs.utc(event.eventStartTime).format();
            let startFromForm = utcTime.format();
            let endFromEvent = dayjs
                .utc(event.eventStartTime)
                .add(event.eventDuration, "minute")
                .format();
            let endFromForm = utcTime
                .add(form.eventDuration, "minute")
                .format();
            return (
                (event.eventId !== form.eventId &&
                    startFromForm >= startFromEvent &&
                    startFromForm <= endFromEvent) ||
                (endFromForm >= startFromEvent && endFromForm <= endFromEvent)
            );
        });
        if (findIsInRange) {
            modal.eventModal.isInvalid = true;
            modal.eventModal.errorType = [
                "- หมวดหมู่นี่มีการจองในช่วงเวลานี้แล้ว",
            ];
            return;
        }
        if (form.eventId) {
            let res = await EventService.updateEvent(form.eventId, {
                eventStartTime: utcTime,
                eventNotes: form.eventNotes,
            });
        } else {
            await EventService.createEvent(
                {
                    ...form,
                    eventCategoryId: eventCategories.value.find(
                        (eventCategory) =>
                            eventCategory.eventCategoryName ===
                            form.eventCategory
                    ).eventCategoryId,
                    eventStartTime: utcTime,
                },
                file
            );
            await Sweetalert.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                showConfirmButton: false,
                timer: 1500,
            });
        }
        if (getTabItem.value === "calendar")
            await calendarType.value.fetchEvents();
        if (getTabItem.value === "list") await listType.value.search();
        modal.clearEventModal();
    } catch (error) {
        modal.eventModal.isInvalid = true;
        modal.eventModal.errorType = [
            "- เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง",
        ];
    } finally {
        util.setLoadingOverlay(false);
    }
}

function warningCancleEvent(event) {
    modal.scheduleModal.open = false;
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
    if (getTabItem.value === "calendar") await calendarType.value.fetchEvents();
    if (getTabItem.value === "list") await listType.value.search();
}
</script>

<template>
    <div class="block w-full">
        <WarningDialog
            v-if="modal.warningModal.isOpen"
            :openModal="modal.warningModal.isOpen"
            :item="modal.warningModal.item"
            @close="modal.toggleWarningModal({ isOpen: false, item: null })"
            @remove="submitCancleEvent"
            :name="modal.getNameWarningModal('event')"
        ></WarningDialog>
        <EventDialog
            v-if="modal.eventModal.open"
            :openModal="modal.eventModal.open"
            :title="modal.eventModal.title"
            :event="modal.eventModal.event"
            :errorType="modal.eventModal.errorType"
            :eventCategories="eventCategories"
            :isInvalid="modal.eventModal.isInvalid"
            @close="modal.eventModal.open = false"
            @onSave="saveEvent"
        ></EventDialog>
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
        <CalendarType
            ref="calendarType"
            v-if="getTabItem === 'calendar'"
            :eventCategories="eventCategories"
        ></CalendarType>
        <ListType
            v-if="getTabItem === 'list'"
            ref="listType"
            :eventCategories="eventCategories"
        ></ListType>
    </div>
</template>

<style></style>
