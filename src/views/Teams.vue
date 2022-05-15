<script setup>
import { ref } from "vue-demi";

const teams = ref([
    {
        name: "Karunpat Promvisut",
        id: "63130500002",
        img: "/kp2/images/63130500002.png",
        ig: "https://www.instagram.com/jom_karunpat/",
        fb: "https://www.facebook.com/jomcootle",
        git: "https://github.com/AloneSpace",
    },
    {
        name: "Thiraphat Itamonchai",
        id: "63130500060",
        img: "/kp2/images/63130500060.jpeg",
        ig: "https://www.instagram.com/futur3_3/?hl=en",
        fb: "https://www.facebook.com/FewThiraphat",
        git: "https://github.com/fewthiraphat",
        // ( src="/images/63130500060.jpeg") ,
    },
    {
        name: "Natasia Yusuwapan",
        id: "63130500070",
        img: "/images/63130500070.png",
        ig: "https://www.instagram.com/nata_zia/?hl=en",
        fb: "https://www.facebook.com/profile.php?id=100002876274183",
        git: "https://github.com/Natasia09",
    },
]);
</script>
<template>
    <div class="flex w-full justify-between">
        <div
            v-for="(team, index) in teams"
            class="rounded-3xl bg-slate-200 my-3 p-24 relative"
            :key="index"
        >
            <div
                class="absolute top-[-5%] bottom-0 left-[50%] absolute inset-x-0 top-0 h-16"
            >
                <img
                    :src="team.img"
                    class="rounded-full border-radius 50% border-solid border-white border-2 -mt-8 w-32 translate-x-[-50%]"
                />
                <!-- src="https://as2.ftcdn.net/v2/jpg/04/93/60/27/1000_F_493602719_ofNXJoIi0ChXSGedE6OpF36sc0RxU5w2.jpg" -->
            </div>

            <h2 class="text-center text-2xl text-blue-600/75">{{ team.id }}</h2>
            <h3 class="text-center text-xl">{{ team.name }}</h3>
            <div>
                <div style="margin-top: 1.2em">
                    <ul class="list-in-line">
                        <li class="inline-block w-20">
                            <a :href="team.ig">
                                <i
                                    class="fa fa-instagram"
                                    style="font-size: 48px; color: black"
                                ></i>
                            </a>
                        </li>

                        <li class="inline-block w-20">
                            <a :href="team.fb">
                                <i
                                    class="fa fa-facebook"
                                    style="font-size: 48px; color: black"
                                ></i>
                            </a>
                        </li>

                        <li class="inline-block w-20">
                            <a :href="team.git">
                                <i
                                    class="fa fa-github"
                                    style="font-size: 48px; color: black"
                                ></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
