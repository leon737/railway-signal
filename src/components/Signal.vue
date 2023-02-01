<template>
  <div class="container">
    <SignalHead
      v-for="head in heads"
      :type="head"
      :config="config"
      :data="data"
    />    
    <Sign :letter="letter" v-if="signVisible" />
  </div>
</template>
<script setup lang="ts">
import SignalHead from "./SignalHead.vue";
import Sign from "./Sign.vue";
import { SignalConfig, SignalData } from "../types";
import { computed } from "vue";
import useSignal from '../useSignal'

const {getHeads} = useSignal()

const props = defineProps<{
  config: SignalConfig;
  data: SignalData;
}>();

const letter = computed(() => props.config.sign);
const signVisible = computed(() => !!props.config.sign);
const signalConfig = computed(() => props.config)
const heads = getHeads(signalConfig)

</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
