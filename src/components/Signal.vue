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
import { HeadType, SignalConfig, SignalData } from "../types";
import { computed, ref } from "vue";

const props = defineProps<{
  config: SignalConfig;
  data: SignalData;
}>();

const letter = computed(() => props.config.sign);
const signVisible = computed(() => !!props.config.sign);

const heads = computed(() => {
  const result: HeadType[] = []
  if (props.config.hasTrackLimitHead) {
    result.push(HeadType.TrackLimit)
    result.push(HeadType.MiniSpeed)
  }
  else {
    result.push(HeadType.Speed)
  }
  if (props.config.hasRouteHead) {
    result.push(HeadType.Route)
  }
  if (props.config.hasGradeTimerHead) {
    result.push(HeadType.GradeTime)
  }
  return result
})

</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
