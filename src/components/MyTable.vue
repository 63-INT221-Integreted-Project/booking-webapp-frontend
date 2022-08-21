<template>
    <div class="block w-full overflow-x-auto px-4 pb-12">
        <table class="items-center bg-transparent w-full border-collapse">
            <thead>
                <tr>
                    <th
                        v-for="(header, index) in headers"
                        :key="index"
                        class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                    >
                        {{ header.text }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!items.length">
                    <td
                        :colspan="headers.length"
                        class="px-6 py-16 text-center text-blueGray-700"
                    >
                        <div class="flex justify-center items-center">
                            <img
                                src="/images/_svg/no-data.svg"
                                alt="no-data"
                                width="300"
                            />
                        </div>
                        <h2 class="text-xl text-center">ไม่มีข้อมูล</h2>
                    </td>
                </tr>
                <tr
                    v-else
                    v-for="(item, index) in items"
                    :key="index"
                    class="text-black font-normal"
                >
                    <th
                        class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
                        v-for="(key, columIndex) in getColumnsByHeaders"
                        :key="columIndex"
                    >
                        <slot
                            :name="'item.' + key"
                            v-bind="getSlotItem(index, item)"
                        >
                            {{ item[key] }}
                        </slot>
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
    headers: {
        type: Array,
        default: () => [],
    },
    items: {
        type: Array,
        default: () => [],
    },
});

const getColumnsByHeaders = computed(() => {
    let keys = props.headers.map((header) => header.value);
    return keys;
});

const getSlotItem = (index, item) => ({
    index,
    item,
});
</script>

<style lang="scss" scoped></style>
