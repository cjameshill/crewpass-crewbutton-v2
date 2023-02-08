<script setup>
import PrimaryButton from "@/components/PrimaryButton.vue";
import { onMounted } from "vue";
const setSession = async () => {
    const res = await fetch(
        "https://crewpass-crewbutton-v2-dev.netlify.app/session"
    );
    console.log("response from edge function: ", res.text());
};
onMounted(async () => {
    await setSession();
});
</script>

<template>
    <PrimaryButton></PrimaryButton>
</template>

<style></style>
