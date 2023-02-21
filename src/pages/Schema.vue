<template>
  <div>
    <select v-model="signalType">
      <option value="normal">Normal</option>
      <option value="brl">BRL</option>
      <option value="uniform">Uniform</option>
      <option value="uniformSmart">Uniform Smart</option>
    </select>
    <div class="signals">
      <div class="signal" style="line-height: 1.18rem; text-align: right">
        <span>BLOCK</span>
        <span>ROUTE</span>
        <span>DIVERT</span>
        <span v-if="!isUniform">TLH</span>
        <span>SLOW</span>
        <span v-if="!isUniform">GTH</span>
        <span>TIMER</span>
        <span>PASS</span>
      </div>
      <div v-for="(signal, index) in signals" class="signal">
        <input type="checkbox" v-model="blocked[index]" />
        <input type="checkbox" v-model="hasRouteHead[index]" />
        <input type="checkbox" v-model="diversion[index]" />
        <input v-if="!isUniform" type="checkbox" v-model="hasTrackLimitHead[index]" />
        <input type="checkbox" v-model="slowTrack[index]" />
        <input v-if="!isUniform" type="checkbox" v-model="hasGradeTimerHead[index]" />
        <input type="checkbox" v-model="gradeTimerOn[index]" />
        <input type="checkbox" v-model="canPassRed[index]" />
        <div class="two_signals">
          <Signal :config="signal" :data="data[index]" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import Signal from "../components/Signal.vue";
import useSignalSystem from '../useSignalSystem'

const COUNT = 20;
const signalType = ref('normal');
const isUniform = computed(() => signalType.value.includes('uniform'))
const blocked = ref(new Array(COUNT).fill(false));
const hasRouteHead = ref(new Array(COUNT).fill(false));
const diversion = ref(new Array(COUNT).fill(false));
const hasTrackLimitHead = ref(new Array(COUNT).fill(false));
const slowTrack = ref(new Array(COUNT).fill(false));
const hasGradeTimerHead = ref(new Array(COUNT).fill(false));
const gradeTimerOn = ref(new Array(COUNT).fill(false));
const canPassRed = ref(new Array(COUNT).fill(false));

const { getSignalConfigs, getSignalData } = useSignalSystem({
  signalType,
  isUniform,
  signalsCount: ref(COUNT)
}, {
  hasRouteHead,
  hasTrackLimitHead,
  hasGradeTimerHead,
  blocked,
  canPassRed,
  diversion,
  gradeTimerOn,
  slowTrack
})

const signals = getSignalConfigs();
const data = getSignalData(signals);

</script>

<style scoped>
.signals {
  margin-top: 1em;
  display: flex;
  gap: 1.5rem;
}
.signal {
  display: flex;
  flex-direction: column;
}
.two_signals {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>
