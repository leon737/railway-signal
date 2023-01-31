<template>
    <div class="container">
        <SignalHead :type="HeadType.Speed" :speedLight="speedLight" :routeLight="routeLight" :isRepeater="!!isRepeater" :isAnnounce="!!isAnnounce" />
        <SignalHead v-if="numberOfHeads > 1" :type="HeadType.Route" :speedLight="speedLight" :routeLight="routeLight" :isRepeater="!!isRepeater" :isAnnounce="!!isAnnounce"/>
        <Sign :letter="letter" v-if="signVisible" />
    </div>
</template>
<script setup lang="ts">
import SignalHead from "./SignalHead.vue";
import Sign from './Sign.vue'
import { HeadType, RouteDirection, RouteLight, SpeedLight } from "../types";
import { computed, ref, watch } from "vue";

const props = defineProps<{
    blocksClear: number;
    direction: RouteDirection;
    isRepeater?: boolean;
    numberOfHeads: number;
    canPassRed: boolean;
    isAnnounce?: boolean;
}>()

const speedLight = ref({
    blocksClear: props.blocksClear,
    canPassRed: props.canPassRed
} as SpeedLight)

const routeLight = ref({
    direction: props.direction
} as RouteLight)

watch([() => props.blocksClear, () => props.canPassRed], ([blocksClear, canPassRed]) => {
    speedLight.value = {
        blocksClear,
        canPassRed: !!canPassRed
    }
})

watch(() => props.direction, value => {
    routeLight.value = {
        direction: value,
        isAnnounce: !!props.isAnnounce
    }
})

const letter = ref("R")
const signVisible = computed(() => props.isRepeater)


</script>
<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>