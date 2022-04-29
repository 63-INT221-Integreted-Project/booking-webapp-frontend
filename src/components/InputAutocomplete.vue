<template>
    <div class="relative">
        <input
            :value="value"
            @input="handleInput"
            :placeholder="placeholder"
            ref="input"
            tabindex="0"
            :class="inputClass"
        />
        <span
            v-if="value"
            @click.prevent="reset()"
            class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        >
            x
        </span>
        <div
            v-show="value && showOptions"
            @click.self="handleSelf()"
            @focusout="showOptions = false"
            tabindex="0"
            :class="dropdownClass"
        >
            <ul class="py-1">
                <li
                    v-for="(item, index) in searchResults"
                    :key="index"
                    @click="handleClick(item)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-200"
                >
                    {{ item.name }}
                </li>
                <li v-if="!searchResults.length" class="px-3 py-2 text-center">
                    No Matching Results
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";

const props = defineProps({
    value: {
        type: String,
        required: false,
    },
    placeholder: {
        type: String,
        required: false,
        default: "Enter text here.",
    },
    items: {
        type: Array,
        default: [],
        required: true,
    },
    inputClass: {
        type: String,
        required: false,
        default:
            "bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500",
    },
    dropdownClass: {
        type: String,
        required: false,
        default:
            "absolute w-full z-50 bg-white border border-gray-300 mt-1 mh-48 overflow-hidden overflow-y-scroll rounded-md shadow-md",
    },
});

const emit = defineEmits(["input", "chosen"]);

let showOptions = ref(false);
let chosenOption = ref("");
let searchTerm = ref("");
let input = ref(null);

let searchResults = computed(() => {
    return props.items.filter((item) => {
        return item?.name
            .toLowerCase()
            .includes(searchTerm.value.toLowerCase());
    });
});

function reset() {
    emit("input", "");
    chosenOption.value = "";
}

function handleInput(evt) {
    emit("input", evt.target.value);
    searchTerm.value = evt.target.value;
    showOptions.value = true;
}

function handleClick(item) {
    emit("input", item.name);
    emit("chosen", item);
    chosenOption.value = item.name;
    showOptions.value = false;
    input._value.focus();
}

function clickedOutside() {
    showOptions.value = false;
    if (!chosenOption.value) {
        emit("input", "");
    }
}
</script>

<style scoped>
.mh-48 {
    max-height: 10rem;
}
</style>
