<script setup>
import { ref, onMounted } from "vue";
import { useEventListener } from "@vueuse/core";

import { useButtonsComposable } from "@/composables/buttonsComposable";
import SpinnerIcon from "@/components/SpinnerIcon.vue";
import parse from "simple-parse-json";
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
    inputData,
    logout,
    formDataKeys,
    popupFullUrl,
    popupFullUrlObject,
    queryParams,
    popupUrl,
    sanitizedParams,
} = useButtonsComposable();
const messages = ref([]);

const inDev = import.meta.env.VITE_ENVIRONMENT === "dev";

useEventListener(window, "message", (message) => {
    if (message.origin === popupOrigin.value) {
        console.log("message: ", message);
        const messageData = parse(message.data || {});
        messages.value.push(messageData);
        if (
            messageData?.status &&
            messageData?.user &&
            messageData?.status !== "closed"
        ) {
            console.log("setting message response: ", messageData);
            setMessageResponse(messageData);
        }
    }
});

onMounted(() => {
    const button = document.getElementById("cp-agency-crew-profile-button");
    console.log("button dataset: ", button.dataset);
    setButtonData(button.dataset);
    console.log("crewUserData.value: ", crewUserData.value?.status);
    if (crewUserData.value && crewUserData.value?.status) {
        setContent(crewUserData.value?.status?.toLowerCase());
    }
});
</script>
<template>
    <div
        id="cp_primaryButtonHold"
        class="relative m-0 mb-[10px] w-[256px] p-0 md:w-[320px]"
    >
        <div
            id="cp_primaryButton"
            @click="buttonClick"
            class="relative m-0 inline-flex w-full cursor-pointer flex-row items-center justify-center space-x-[12px] rounded-[30px] border-2 border-transparent py-[6px] pl-[7px] pr-[7px] text-[17px] text-white transition hover:bg-gray-500 focus:border-gray-400 active:border-gray-500 active:bg-gray-600"
            :class="crewUserData.status"
        >
            <img
                class="my-0 mx-0 h-[25px] w-[25px]"
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
            <div class="m-0 flex-auto py-0 pr-[16px] text-center">
                <span class="m-0 p-0 text-[14px]">{{ buttonText }}</span>
            </div>
            <div
                v-if="inDev"
                class="absolute right-[5px] -top-[5px] m-0 p-0 text-right"
            >
                <span class="m-0 pt-0 text-[16px] text-red-700">&#9210;</span>
            </div>
        </div>
        <div
            v-if="
                inputData &&
                crewUserData &&
                crewUserData.user &&
                crewUserData.user?.name
            "
            class="absolute -bottom-[15px] right-0 m-0 py-0 pl-0 pr-[18px]"
        >
            <div class="text-italics text-[8px] text-gray-400">
                <span class="pr-[10px]"
                    >logged in as {{ crewUserData.user?.name }}</span
                >
                <span
                    @click="logout"
                    class="cursor-pointer hover:underline"
                    >Switch user</span
                >
            </div>
        </div>
    </div>
</template>
<style scoped>
@import "../style.css";

#cp_primaryButton,
#cp_primaryButtonHold {
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
