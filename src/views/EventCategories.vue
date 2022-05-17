<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import EventCategoriesService from "../services/event-categories.service";
import EventCategoryDialog from "../components/_Dialog/EventCategoryDialog.vue";
import WarningDialog from "../components/_Dialog/WarningDialog.vue";
import { useModalStore } from "../stores/modal";

const route = useRoute();
const eventCategories = ref([]);
const modal = useModalStore();

const pagination = ref({
    page: 1,
    perPage: 10,
});

onMounted(async () => {
    eventCategories.value = await EventCategoriesService.findAll();
});

async function saveEventCategory(eventCategory) {
    modal.eventCategoryModal.isInvalid = false;
    let valid = checkFormValid(eventCategory);
    if (valid.length) {
        modal.eventCategoryModal.isInvalid = true;
        modal.eventCategoryModal.errorList = valid;
        return;
    }

    let findExistCategoryName = eventCategories.value.find(
        (ec) =>
            ec.eventCategoryName.trim() ===
                eventCategory.eventCategoryName.trim() &&
            ec.eventCategoryId !== eventCategory.eventCategoryId
    );
    if (findExistCategoryName) {
        modal.eventCategoryModal.isInvalid = true;
        modal.eventCategoryModal.errorList = ["- ชื่อหมวดหมู่ซ้ำ"];
        return;
    }
    if (eventCategory.eventCategoryId) {
        await EventCategoriesService.updateEventCategory(
            eventCategory.eventCategoryId,
            eventCategory
        );
    } else {
        await EventCategoriesService.createEventCategory(eventCategory);
    }
    eventCategories.value = await EventCategoriesService.findAll();
    modal.toggleEventCategoryModal({
        isOpen: false,
        item: null,
        isInvalid: false,
    });
}

function checkFormValid(eventCategory) {
    let errorList = [];
    if (!eventCategory.eventCategoryName)
        errorList.push("- กรุณากรอกชื่อหมวดหมู่");
    if (!eventCategory.eventCategoryName.length > 100)
        errorList.push("- ชื่อหมวดหมู่ต้องไม่เกิน 100 ตัวอักษร");
    if (!eventCategory.eventCategoryDescription.length > 500)
        errorList.push("- คำอธิบายหมวดหมู่ต้องไม่เกิน 500 ตัวอักษร");
    if (!eventCategory.eventDuration)
        errorList.push("- กรุณากรอกระยะเวลาการจอง");
    if (isNaN(eventCategory.eventDuration))
        errorList.push("- ระยะเวลาต้องเป็นตัวเลขเท่านั้น");
    if (
        !(
            eventCategory.eventDuration >= 1 &&
            eventCategory.eventDuration <= 480
        )
    )
        errorList.push("- ช่วงระยะเวลาในการจองต้องอยู่ในช่วง 1 - 480 นาที");
    return errorList;
}

async function deleteEventCategory(eventCategory) {
    await EventCategoriesService.deleteEventCategory(
        eventCategory.eventCategoryId
    );
    modal.toggleWarningModal({ isOpen: false, item: null });
    eventCategories.value = await EventCategoriesService.findAll();
}
</script>

<template>
    <div class="w-full px-4 mx-auto">
        <EventCategoryDialog
            v-if="modal.eventCategoryModal.isOpen"
            :openModal="modal.eventCategoryModal.isOpen"
            :item="modal.eventCategoryModal.item"
            @close="
                modal.toggleEventCategoryModal({
                    isOpen: false,
                    item: null,
                    isInvalid: false,
                })
            "
            :isInvalid="modal.eventCategoryModal.isInvalid"
            :errorList="modal.eventCategoryModal.errorList"
            @save="saveEventCategory"
        ></EventCategoryDialog>
        <WarningDialog
            v-if="modal.warningModal.isOpen"
            :openModal="modal.warningModal.isOpen"
            :item="modal.warningModal.item"
            @remove="deleteEventCategory"
            @close="modal.toggleWarningModal({ isOpen: false, item: null })"
            :name="modal.getNameWarningModal('event-category')"
        ></WarningDialog>
        <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
        >
            <div class="rounded-t mb-0 px-4 py-8 border-0">
                <div class="flex flex-wrap items-center">
                    <div
                        class="relative w-full px-4 max-w-full flex-grow flex-1"
                    >
                        <h3 class="font-semibold text-xl text-blueGray-700">
                            หมวดหมู่การจอง
                        </h3>
                    </div>
                    <div
                        class="relative w-full px-4 max-w-full flex-grow flex-1 text-right"
                    >
                        <button
                            class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            @click="
                                modal.toggleEventCategoryModal({
                                    isOpen: true,
                                    item: null,
                                    isInvalid: false,
                                })
                            "
                        >
                            เพิ่มหมวดหมู่การจอง
                        </button>
                    </div>
                </div>
            </div>

            <div class="block w-full overflow-x-auto">
                <table
                    class="items-center bg-transparent w-full border-collapse"
                >
                    <thead>
                        <tr>
                            <th
                                class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >
                                ชื่อหมวดหมู่
                            </th>
                            <th
                                class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >
                                รายละเอียดหมวดหมู่
                            </th>
                            <th
                                class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >
                                ระยะเวลา
                            </th>
                            <th
                                class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                            >
                                เพิ่มเติม
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="(event, index) in eventCategories"
                            :key="index"
                            class="text-black font-normal"
                        >
                            <th
                                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
                            >
                                {{ event.eventCategoryName }}
                            </th>
                            <td
                                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                            >
                                {{ event.eventCategoryDescription }}
                            </td>
                            <td
                                class="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                            >
                                {{ event.eventDuration }} mins
                            </td>
                            <td
                                class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                            >
                                <button
                                    class="bg-yellow-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-yellow-600 hover:border-blue rounded mr-2"
                                    @click="
                                        modal.toggleEventCategoryModal({
                                            isOpen: true,
                                            item: event,
                                            isInvalid: false,
                                        })
                                    "
                                >
                                    แก้ไข
                                </button>
                                <!-- <button
                                    class="bg-red-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-red-600 hover:border-blue rounded"
                                    @click="
                                        modal.toggleWarningModal({
                                            isOpen: true,
                                            item: event,
                                        })
                                    "
                                >
                                    ลบ
                                </button> -->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="w-full">
                <div
                    class="hidden sm:flex sm:items-center sm:justify-between px-6 py-8"
                >
                    <div>
                        <p class="text-sm text-black font-bold">
                            Showing
                            <span>1</span>
                            to
                            <span>10</span>
                            of
                            <span>{{ eventCategories.length }}</span>
                            results
                        </p>
                    </div>
                    <div>
                        <nav
                            class="relative z-0 inline-flex rounded-md shadow-sm"
                            aria-label="Pagination"
                        >
                            <button
                                href="#"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{
                                    'cursor-not-allowed opacity-50':
                                        pagination.page === 1,
                                }"
                                :disabled="pagination.page === 1"
                            >
                                <span>Previous</span>
                                <!-- Heroicon name: solid/chevron-left -->
                                <svg
                                    class="h-5 w-5 sr-only"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                            <button
                                href="#"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                :class="{
                                    'cursor-not-allowed opacity-50':
                                        eventCategories.length / 10 <
                                        pagination.page,
                                }"
                                :disabled="
                                    eventCategories.length / 10 <
                                    pagination.page
                                "
                            >
                                <span>Next</span>
                                <!-- Heroicon name: solid/chevron-right -->
                                <svg
                                    class="h-5 w-5 sr-only"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
