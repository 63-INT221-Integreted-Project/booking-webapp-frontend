<script setup>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },
    item: {
        type: Object,
        default: null,
    },
});
const emit = defineEmits(["close", "save"]);

const form = ref({
    eventCategoryId: props.item?.eventCategoryId || "",
    eventCategoryName: props.item?.eventCategoryName || "",
    eventCategoryDescription: props.item?.eventCategoryDescription || "",
    eventDuration: props.item?.eventDuration || "",
});

const modalTitle = computed(() => {
    return !form.value.eventCategoryId
        ? "เพิ่มหมวดหมู่การจอง"
        : `แก้ไขหมวดหมู่การจอง ${form.value.eventCategoryId}`;
});

const isEventDurationInvalid = computed(() => {
    if (!form.value.eventDuration) return "กรุณากรอกระยะเวลาการจอง";
    if (isNaN(form.value.eventDuration))
        return "ระยะเวลาต้องเป็นตัวเลขเท่านั้น";
    if (!(form.value.eventDuration >= 1 && form.value.eventDuration <= 480))
        return "ช่วงระยะเวลาในการจองต้องอยู่ในช่วง 1 - 480 นาที";
    return "";
});

const showErrorList = computed(() => {
    let errorType = [];
    if (isEventDurationInvalid.value)
        errorType.push(isEventDurationInvalid.value);
    if (!form.value.eventCategoryName)
        errorType.push("กรุณากรอกชื่อหมวดหมู่การจอง");
    if (!form.value.eventCategoryDescription)
        errorType.push("กรุณากรอกรายละเอียดหมวดหมู่การจอง");
    return errorType.join("<br/>");
});

function onSubmit() {
    if (
        isEventDurationInvalid.value ||
        !form.value.eventCategoryName ||
        !form.value.eventCategoryDescription
    )
        return;
    emit("save", form.value);
}
</script>

<template>
    <div
        style="background-color: rgba(0, 0, 0, 0.8)"
        class="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
        v-show.transition.opacity="openModal"
        @click.self.prevent.stop="emit('close', !openModal)"
    >
        <div
            class="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden mt-56 top-[5%] 2xl:top-[15%]"
        >
            <div
                class="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
                @click="emit('close', { isOpen: false, item: null })"
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
                    {{ modalTitle }}
                </h2>

                <div role="alert" class="mb-4" v-if="showErrorList.length">
                    <div
                        class="bg-red-500 text-white font-bold rounded-t px-4 py-2"
                    >
                        เกิดข้อผิดพลาด
                    </div>
                    <div
                        class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700"
                    >
                        <p v-html="showErrorList"></p>
                    </div>
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ชื่อหมวดหมู่</label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.eventCategoryName"
                        :class="{
                            'border-red-500 border-3': !form.eventCategoryName,
                        }"
                    />
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="!form.eventCategoryName"
                    >
                        กรุณากรอกชื่อหมวดหมู่การจอง
                    </p>
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >รายละเอียดหมวดหมู่</label
                    >
                    <textarea
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full pt-4 pb-16 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.eventCategoryDescription"
                        :class="{
                            'border-red-500 border-3':
                                !form.eventCategoryDescription,
                        }"
                    />
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="!form.eventCategoryDescription"
                    >
                        กรุณากรอกรายละเอียดหมวดหมู่การจอง
                    </p>
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ระยะเวลา</label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        v-model="form.eventDuration"
                        :class="{
                            'border-red-500 border-3': isEventDurationInvalid,
                        }"
                    />
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="isEventDurationInvalid"
                    >
                        {{ isEventDurationInvalid }}
                    </p>
                </div>

                <div class="mt-8 text-right">
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
                        @click="onSubmit"
                    >
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
