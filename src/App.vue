<script setup>
import PrimaryButton from "@/components/PrimaryButton.vue";
import { onMounted } from "vue";
const setSession = async () => {
    const res = await fetch("/cookies");
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
