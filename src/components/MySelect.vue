<template>
    <div class="relative flex w-full">
        <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            type="text"
            list="eventCategoriesList"
        />
        <select
            id="select-role"
            name="roles[]"
            multiple
            placeholder="Select roles..."
            autocomplete="off"
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
        >
            <option value="1">super admin</option>
            <option value="2">admin</option>
            <option value="3">writer</option>
            <option value="4">user</option>
        </select>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
