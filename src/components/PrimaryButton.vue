<script setup>
import { ref, onMounted } from "vue";
import { useEventListener } from "@vueuse/core";

import { useButtonsComposable } from "@/composables/buttonsComposable";
import SpinnerIcon from "@/components/SpinnerIcon.vue";
const {
    buttonText,
    logo,
    buttonClick,
    loading,
    crewUserData,
    popupOrigin,
    setButtonData,
    setContent,
    setMessageResponse,
    commitId,
    environment,
    inputData,
    attachResponseToForm,
} = useButtonsComposable();
const messages = ref([]);

const inDev = import.meta.env.VITE_ENVIRONMENT === "dev";

useEventListener(window, "message", (message) => {
    console.log("message origin: ", message.origin);
    console.log("message: ", message.data);
    if (message.origin === popupOrigin.value) {
        console.log("message: ", message);
        messages.value.push(message.data);
        if (message.data?.status && message.data?.cpUniqueId) {
            console.log("setting message response: ", message.data);
            setMessageResponse(message.data);
        }
    }
});

onMounted(() => {
    const button = document.getElementById("cp-agency-crew-profile-button");
    setButtonData(button.dataset);
    console.log("crewUserData.value: ", crewUserData.value?.status);
    if (crewUserData.value && crewUserData.value?.status) {
        setContent(crewUserData.value?.status?.toLowerCase());
    }
});
</script>
<template>
    <div class="relative m-0 mb-[10px] w-[256px] p-0 md:w-[320px]">
        <button
            id="cp_primaryButton"
            @click="buttonClick"
            class="relative m-0 inline-flex w-full flex-row items-center space-x-[12px] rounded-2xl border-2 border-transparent py-[4px] pl-[7px] pr-[7px] text-[17px] text-white transition hover:bg-gray-500 focus:border-gray-400"
            :class="crewUserData.status"
        >
            <img
                class="my-0 ml-0 mr-[8px] h-[25px] w-[25px] flex-none p-0"
                :src="logo"
            />
            <div
                v-if="loading"
                class="absolute left-[30px]"
            >
                <SpinnerIcon
                    class="h-3 w-3 animate-spin fill-white"
                ></SpinnerIcon>
            </div>
            <div class="m-0 flex-auto py-0 pl-[6px] pr-[16px]">
                <span class="m-0 p-0 text-[14px]">{{ buttonText }}</span>
            </div>
            <div
                v-if="inDev"
                class="absolute right-[5px] -top-[5px] m-0 p-0 text-right"
            >
                <span class="m-0 pt-0 text-[16px] text-red-700">&#9210;</span>
            </div>
        </button>
        <div
            v-if="
                inputData &&
                inputData.experimentalFeatures &&
                crewUserData &&
                crewUserData.crewEmail
            "
            class="absolute -bottom-[17px] right-0 m-0 py-0 pl-0 pr-[18px]"
        >
            <div class="text-[9px] text-gray-400">logged in as</div>
        </div>
    </div>
</template>
<style scoped>
@import "../style.css";

#cp_primaryButton {
    letter-spacing: -0.5px;
    line-height: 15px;
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
}

.pending {
    background-color: #f39200;
}

.not-checked {
    background-color: #2b3d4b;
}

.loading {
    background-color: #2b3d4b;
}

.approved {
    background-color: #3aaa35;
}

.verified {
    background-color: #3aaa35;
}

.declined {
    background-color: #e6332a;
}

.unchecked {
    background-color: #878787;
}
</style>
