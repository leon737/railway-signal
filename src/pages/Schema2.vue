<template>
  <div>
    <div class="signals">
      <div class="signal" style="line-height: 1.18rem; text-align: right">
        <span>BLOCK</span>
        <span>ROUTE</span>
        <span>DIVERT</span>
        <span>TLH</span>
        <span>SLOW</span>
        <span>GTH</span>
        <span>TIMER</span>
        <span>PASS</span>
      </div>
      <div v-for="(_, index) in list" class="signal">
        <input type="checkbox" v-model="blocked[index]" />
        <input type="checkbox" v-model="hasRouteHead[index]" />
        <input type="checkbox" v-model="diversion[index]" />
        <input type="checkbox" v-model="hasTrackLimitHead[index]" />
        <input type="checkbox" v-model="slowTrack[index]" />
        <input type="checkbox" v-model="hasGradeTimerHead[index]" />
        <input type="checkbox" v-model="gradeTimerOn[index]" />
        <input type="checkbox" v-model="canPassRed[index]" />        
        <div class="two_signals">
          <Signal :config="signalsUniform[index]" :data="dataUniform[index]" />
        </div>
        <div class="two_signals" style="margin-top: 20px">
          <Signal :config="signalsBrl[index]" :data="dataBrl[index]" />
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
const blocked = ref(new Array(COUNT).fill(false));
const hasRouteHead = ref(new Array(COUNT).fill(false));
const diversion = ref(new Array(COUNT).fill(false));
const hasTrackLimitHead = ref(new Array(COUNT).fill(false));
const slowTrack = ref(new Array(COUNT).fill(false));
const hasGradeTimerHead = ref(new Array(COUNT).fill(false));
const gradeTimerOn = ref(new Array(COUNT).fill(false));
const canPassRed = ref(new Array(COUNT).fill(false));

const { getSignalConfigs: getSignalConfigsBrl, getSignalData: getSignalDataBrl } = useSignalSystem({
  signalType: ref('brl'),
  isUniform: ref(false),
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

const { getSignalConfigs: getSignalConfigsUniform, getSignalData: getSignalDataUniform } = useSignalSystem({
  signalType: ref('uniform'),
  isUniform: ref(true),
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

const signalsBrl = getSignalConfigsBrl();
const dataBrl = getSignalDataBrl(signalsBrl);

const signalsUniform = getSignalConfigsUniform();
const dataUniform = getSignalDataUniform(signalsUniform);

const list = Array.from(new Array(COUNT))

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
