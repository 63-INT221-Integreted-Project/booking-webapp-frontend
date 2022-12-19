<template>
    <div class="w-full px-4 mx-auto">
        <UserDialog
            v-if="modal.isOpen"
            :openModal="modal.isOpen"
            :item="modal.user"
            @close="
                toggleModal({
                    isOpen: false,
                    user: null,
                    isInvalid: false,
                })
            "
            :isInvalid="modal.isInvalid"
            :errorList="modal.errorList"
            @save="saveUser"
        ></UserDialog>
        <WarningDialog
            v-if="dialog.warningModal.isOpen"
            :openModal="dialog.warningModal.isOpen"
            :item="dialog.warningModal.item"
            @remove="deleteUser"
            @close="dialog.toggleWarningModal({ isOpen: false, item: null })"
            :name="dialog.getNameWarningModal('event-category')"
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
                            ผู้ใข้งาน
                        </h3>
                    </div>
                    <div
                        class="relative w-full px-4 max-w-full flex-grow flex-1 text-right"
                    >
                        <button
                            class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            @click="
                                toggleModal({
                                    isOpen: true,
                                    item: null,
                                    isInvalid: false,
                                })
                            "
                        >
                            เพิ่มผู้ใช้งาน
                        </button>
                    </div>
                </div>
            </div>
            <MyTable :headers="headers" :items="users">
                <template #item.name="{ item }"> {{ item.name }} </template>
                <template #item.createdOn="{ item }">
                    {{ util.formatDate(item.createdOn) }}
                </template>
                <template #item.updatedOn="{ item }">
                    {{ util.formatDate(item.updatedOn) }}
                </template>
                <template #item.actions="{ item }">
                    <button
                        class="bg-yellow-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-yellow-600 hover:border-blue rounded mr-2"
                        @click="
                            toggleModal({
                                isOpen: true,
                                user: item,
                                isInvalid: false,
                            })
                        "
                    >
                        แก้ไข
                    </button>
                    <button
                        class="bg-red-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-red-600 hover:border-blue rounded"
                        @click="
                            dialog.toggleWarningModal({
                                isOpen: true,
                                item: item,
                            })
                        "
                    >
                        ลบ
                    </button>
                </template>
            </MyTable>
        </div>
    </div>
</template>

<script setup>
import UserDialog from "../components/_Dialog/UserDialog.vue";
import UserService from "../services/user.service";
import MyTable from "../components/MyTable.vue";
import { ref, onMounted } from "vue-demi";
import { useUtilStore } from "../stores/utils";
import WarningDialog from "../components/_Dialog/WarningDialog.vue";
import { useModalStore } from "../stores/modal";
import { useRouter } from "vue-router";
import Sweetalert from "sweetalert2";
const router = useRouter();
const util = useUtilStore();
const dialog = useModalStore();

onMounted(async () => {
    await fetchUsers();
});

const headers = ref([
    {
        text: "ชื่อ-นามสกุล",
        value: "name",
    },
    {
        text: "อีเมล",
        value: "email",
    },
    {
        text: "ตำแหน่ง",
        value: "role",
    },
    {
        text: "สมัครเมื่อ",
        value: "createdOn",
    },
    {
        text: "อัพเดทเมื่อ",
        value: "updatedOn",
    },
    {
        text: "",
        value: "actions",
    },
]);

const users = ref([]);

const modal = ref({
    isOpen: false,
    user: null,
    isInvalid: false,
    errorList: [],
});

function toggleModal({ isOpen, user, isInvalid }) {
    modal.value = {
        isOpen,
        user,
        isInvalid,
    };
}

async function fetchUsers() {
    try {
        users.value = await UserService.findAll();
    } catch (error) {
        router.push("/");
    }
}

async function deleteUser(user) {
    try {
        await UserService.deleteUser(user.userId);
    } catch (error) {
        if (error.response.status === 400) {
            await Sweetalert.fire({
                icon: "error",
                title: "ไม่สามารถลบได้",
                text: "เนื่องจากอาจารย์ท่านนี้เป็นเจ้าของ Category เพียงคนเดียว",
            });
        }
    }
    dialog.toggleWarningModal({
        isOpen: false,
        user: null,
    });
    await Sweetalert.fire({
        icon: "success",
        title: "ลบข้อมูล",
        text: "ระบบได้ทำการลบข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
        timer: 2000,
        showConfirmButton: false,
    });
    users.value = await UserService.findAll();
}

async function saveUser(user) {
    try {
        if (!user.email) {
            throw Error("Email is required");
        }
        if (!user.name) {
            throw Error("Name is required");
        }
        if (!user.role) {
            throw Error("Role is required");
        }
        modal.value.isInvalid = false;
        if (!user.userId) await UserService.createUser(user);
        if (user.userId) await UserService.updateUser(user.userId, user);
    } catch (error) {
        modal.value.isInvalid = true;
    } finally {
        await fetchUsers();
        toggleModal({
            isOpen: false,
            user: null,
            isInvalid: false,
        });
    }
}
</script>

<style lang="scss" scoped></style>
