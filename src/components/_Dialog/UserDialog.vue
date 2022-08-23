<script setup>
import { ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";

onMounted(() => {
    if (form.value.userId) {
        let role = roleList.value.find(
            (item) => item.value === form.value.role
        )?.text;
        form.value.role = role;
    }
});

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },
    item: {
        type: Object,
        default: null,
    },
    isInvalid: {
        type: Boolean,
        default: false,
    },
    errorList: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(["close", "save"]);

const form = ref({
    userId: props.item?.userId || "",
    name: props.item?.name || "",
    email: props.item?.email || "",
    role: props.item?.role || "",
});

const roleList = ref([
    {
        text: "ผู้ดูแลระบบ",
        value: "admin",
    },
    {
        text: "อาจารย์",
        value: "lecture",
    },
    {
        text: "นักเรียน",
        value: "student",
    },
]);

const modalTitle = computed(() => {
    return !form.value.eventCategoryId
        ? "เพิ่มผู้ใช้งาน"
        : `แก้ไขผู้ใช้งาน (${props.item?.name})`;
});

const isEventDurationInvalid = computed(() => {
    if (!form.value.eventDuration) return "- กรุณากรอกระยะเวลาการจอง";
    if (isNaN(form.value.eventDuration))
        return "- ระยะเวลาต้องเป็นตัวเลขเท่านั้น";
    if (!(form.value.eventDuration >= 1 && form.value.eventDuration <= 480))
        return "- ช่วงระยะเวลาในการจองต้องอยู่ในช่วง 1 - 480 นาที";
    return null;
});

const showErrorList = computed(() => {
    let errorType = [];
    if (!props.isInvalid) return [];
    if (props.errorList.length) errorType.push(...props.errorList);
    return errorType.join("<br/>");
});

function onSubmit() {
    let role = roleList.value.find(
        (item) => item.text === form.value.role
    )?.value;
    emit("save", { ...form.value, role: role });
}
</script>

<template>
    <div
        style="background-color: rgba(0, 0, 0, 0.8)"
        class="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
        v-show.transition.opacity="openModal"
    >
        <div
            class="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden top-0 2xl:top-[15%]"
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
                        >ชื่อ-นามสกุล <span class="text-red-800">*</span></label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.name"
                        :class="{
                            'border-red-500 border-3':
                                !form.name && props.isInvalid,
                        }"
                        maxlength="100"
                    />
                    <div class="flex justify-between">
                        <div>
                            <p
                                class="text-error text-sm text-red-600"
                                v-if="!form.name && props.isInvalid"
                            >
                                กรุณากรอกชื่อ-นามสกุล
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">
                                {{ form.name.length }} / 100
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >อีเมลล์ <span class="text-red-800">*</span></label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        v-model="form.email"
                        :class="{
                            'border-red-500 border-3':
                                isEventDurationInvalid && props.isInvalid,
                        }"
                    />
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="isEventDurationInvalid && props.isInvalid"
                    >
                        {{ isEventDurationInvalid }}
                    </p>
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ตำแหน่ง <span class="text-red-800">*</span>
                    </label>

                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.role"
                        list="userList"
                        :class="{
                            'border-red-500 border-3': isInvalid && !form.role,
                        }"
                    />
                    <datalist id="userList">
                        <template v-for="(role, index) in roleList">
                            <option>
                                {{ role.text }}
                            </option>
                        </template>
                    </datalist>
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="isInvalid && !form.role"
                    >
                        กรุณาเลือกตำแหน่ง
                    </p>
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >รหัสผ่าน <span class="text-red-800">*</span>
                    </label>

                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="password"
            
                    />
                    
                   
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
