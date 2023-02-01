<template>
  <div>
    <div class="signals">
      <Signal
        v-for="signal in signals"
        :config="signal"
        :data="data"
      />      
    </div>
    <div>
      <select v-model="blocksClear">
        <option value="-1">Stop</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3+</option>
      </select>
      <select v-model="direction">
        <option value="straight">straight</option>
        <option value="divert">divert</option>
      </select>
      <input type="checkbox" v-model="canPassRed" /> Can pass red
      <input type="checkbox" v-model="hasTrackLimitHead" /> Track limit head
      <input type="checkbox" v-model="slowTrack" /> Slow track
      <input type="checkbox" v-model="gradeTimer" /> Grade timer
      <input type="checkbox" v-model="gradeTimerOn" /> Grade timer on
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import Signal from "./components/Signal.vue";
import { RouteDirection, SignalConfig, SignalData } from "./types";

const blocksClear = ref(0);
const blocksClearNumber = computed(() => +blocksClear.value);
const direction = ref("straight");
const routeDirection = computed(() =>
  direction.value === "straight"
    ? RouteDirection.Straight
    : RouteDirection.Divert
);
const canPassRed = ref(false);
const hasTrackLimitHead = ref(true);
const slowTrack = ref(true);
const gradeTimer = ref(true);
const gradeTimerOn = ref(true);

const signals = computed(() => {
  const result: SignalConfig[] = [  
    {
      isRepeater: false,
      hasRouteHead: false,
      isRouteAnnouce: true,
      isGradeTimerAnnounce: false,
      hasTrackLimitHead: hasTrackLimitHead.value,
      hasGradeTimerHead: gradeTimer.value,
      sign: 'A'
    },
    {
      isRepeater: false,
      hasRouteHead: false,
      isRouteAnnouce: false,
      isGradeTimerAnnounce: true,
      hasTrackLimitHead: hasTrackLimitHead.value,
      hasGradeTimerHead: gradeTimer.value,
      sign: 'S'
    },
    {
      isRepeater: true,
      hasRouteHead: false,
      isRouteAnnouce: true,
      isGradeTimerAnnounce: false,
      hasTrackLimitHead: hasTrackLimitHead.value,
      hasGradeTimerHead: false,
      sign: 'R'
    },
    {
      isRepeater: false,
      hasRouteHead: false,
      isRouteAnnouce: false,
      isGradeTimerAnnounce: false,
      hasTrackLimitHead: hasTrackLimitHead.value,
      hasGradeTimerHead: gradeTimer.value,
      sign: ''
    },
    {
      isRepeater: false,
      hasRouteHead: true,
      isRouteAnnouce: true,
      isGradeTimerAnnounce: false,
      hasTrackLimitHead: hasTrackLimitHead.value,
      hasGradeTimerHead: gradeTimer.value,
      sign: 'A'
    },
    {
      isRepeater: false,
      hasRouteHead: true,
      isRouteAnnouce: false,
      isGradeTimerAnnounce: true,
      hasTrackLimitHead: hasTrackLimitHead.value,
      hasGradeTimerHead: gradeTimer.value,
      sign: 'S'
    },
    {
      isRepeater: true,
      hasRouteHead: true,
      isRouteAnnouce: true,
      isGradeTimerAnnounce: false,
      hasTrackLimitHead: hasTrackLimitHead.value,
      hasGradeTimerHead: false,
      sign: 'R'
    },
    {
      isRepeater: false,
      hasRouteHead: true,
      isRouteAnnouce: false,
      isGradeTimerAnnounce: false,
      hasTrackLimitHead: hasTrackLimitHead.value,
      hasGradeTimerHead: gradeTimer.value,
      sign: ''
    }
  ]
  return result
})

const data = computed(() => ({
  blocksClear: blocksClear.value,
  canPassRed: canPassRed.value,
  direction: routeDirection.value,
  gradeTimerOn: gradeTimerOn.value,
  slowTrack: slowTrack.value
} as SignalData))

</script>

<style scoped>
.signals {
  display: flex;
  gap: 1.5rem;
}
</style>
