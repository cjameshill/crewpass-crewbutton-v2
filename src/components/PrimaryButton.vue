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
    console.log("commit id: ", commitId);
    console.log("env: ", environment);
});
</script>
<template>
    <button
        id="primaryButton"
        @click="buttonClick"
        class="relative inline-flex flex-row items-center py-[4px] pl-[7px] space-x-[12px] pr-[7px] m-0 md:w-[320px] rounded-2xl text-white text-[17px] border-2 border-transparent hover:bg-gray-500 focus:border-gray-400"
        :class="crewUserData.status"
    >
        <img
            class="flex-none w-[25px] h-[25px] p-0 ml-0 my-0 mr-[8px]"
            :src="logo"
        />
        <div v-if="loading" class="flex-none">
            <SpinnerIcon class="w-5 h-5 fill-white animate-spin"></SpinnerIcon>
        </div>
        <div class="flex-auto pl-[6px] pr-[16px] py-0 m-0">
            <span class="text-[14px] p-0 m-0">{{ buttonText }}</span>
        </div>
        <div
            v-if="inDev"
            class="absolute text-right right-[5px] -top-[5px] m-0 p-0"
        >
            <span class="text-[16px] text-red-700 m-0 pt-0">&#9210;</span>
        </div>
    </button>
</template>
<style scoped>
@import "../style.css";

#primaryButton {
    font-weight: 600;
    letter-spacing: -0.5px;
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
