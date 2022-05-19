<script setup>
import { computed } from "vue-demi";

const props = defineProps({
    tabList: {
        type: Array,
    },
});

const emit = defineEmits(["update:modelValue", "backToDateNow"]);
</script>

<template>
    <div>
        <button
            class="h-12 px-5 m-2 bg-green-500 text-white active:bg-green-600 text-sm font-bold uppercase p-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 w-full"
            type="button"
            @click="emit('backToDateNow')"
        >
            ย้อนกลับไปยังเดือนปัจจุบัน
        </button>
    </div>
</template>

<style></style>
