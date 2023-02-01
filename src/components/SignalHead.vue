<template>
  <div class="box">
    <Light
      v-for="light in lights"
      :color="light.color"
      :flashing="light.flashing"
      :out="light.out"
    />
  </div>
</template>
<script setup lang="ts">
import {
  HeadType,
  SignalConfig,
  SignalData,
} from "../types";
import Light from "./Light.vue";
import useSignal from '../useSignal'
import { computed } from "@vue/reactivity";

const {getHead} = useSignal()

const props = defineProps<{
  type: HeadType;
  config: SignalConfig;
  data: SignalData
}>();

const headType = computed(() => props.type)
const signalConfig = computed(() => props.config)
const signalData = computed(() => props.data)
const lights = getHead(headType, signalConfig, signalData)

</script>
<style scoped>
.box {
  border: 1px solid #000;
  width: 3rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: #333;
}
</style>
