<script setup>
import { computed } from "vue-demi";

const props = defineProps({
    tabList: {
        type: Array,
    },
    modelValue: {
        type: Number,
        default: 1,
    },
});

const emit = defineEmits(["update:modelValue"]);

const activeTab = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        return emit("update:modelValue", value);
    },
});
</script>

<template>
    <div>
        <p class="text-black font-bold text-right text-xl mb-2">
            ประวัติการจอง
        </p>
        <ul
            class="list-none bg-blue-900 bg-opacity-30 p-1 rounded-lg text-center overflow-auto whitespace-nowrap flex items-center mb-6"
        >
            <li
                v-for="(tab, index) in tabList"
                :key="index"
                class="w-full px-4 py-1 rounded-lg"
                :class="{
                    'text-blue-600 bg-white shadow-xl': index + 1 === activeTab,
                    'text-white': index + 1 !== activeTab,
                }"
            >
                <label
                    :for="`tab-${index}`"
                    v-text="tab"
                    class="cursor-pointer block"
                />
                <input
                    :id="`tab-${index}`"
                    type="radio"
                    :name="`${index}-tab`"
                    :value="index + 1"
                    v-model="activeTab"
                    class="hidden"
                />
            </li>
        </ul>
    </div>
</template>

<style></style>
