<template>
  <div>
    <div class="signals">
      <Signal
        :blocksClear="blocksClearNumber"
        :direction="routeDirection"
        :isRepeater="true"
        :numberOfHeads="1"
        :canPassRed="canPassRed"
        :hasTrackLimitHead="hasTrackLimitHead"
        :slowTrack="slowTrack"
      />
      <Signal
        :blocksClear="blocksClearNumber"
        :direction="routeDirection"
        :numberOfHeads="1"
        :canPassRed="canPassRed"
        :hasTrackLimitHead="hasTrackLimitHead"
        :slowTrack="slowTrack"
        :gradeTimer="gradeTimer"
        :gradeTimerOn="gradeTimerOn"
      />
      <Signal
        :blocksClear="blocksClearNumber + 1"
        :direction="routeDirection"
        :numberOfHeads="1"
        :canPassRed="canPassRed"
        :isAnnounce="true"
        :hasTrackLimitHead="hasTrackLimitHead"
        :slowTrack="slowTrack"
        :gradeTimer="gradeTimer"
        :gradeTimerOn="gradeTimerOn"
      />
      <Signal
        :blocksClear="blocksClearNumber + 1"
        :direction="routeDirection"
        :isRepeater="true"
        :numberOfHeads="1"
        :canPassRed="canPassRed"
        :isAnnounce="true"
        :hasTrackLimitHead="hasTrackLimitHead"
        :slowTrack="slowTrack"
      />
      <Signal
        :blocksClear="blocksClearNumber + 1"
        :direction="routeDirection"
        :numberOfHeads="2"
        :canPassRed="canPassRed"
        :isAnnounce="true"
        :hasTrackLimitHead="hasTrackLimitHead"
        :slowTrack="slowTrack"
        :gradeTimer="gradeTimer"
        :gradeTimerOn="gradeTimerOn"
      />
      <Signal
        :blocksClear="blocksClearNumber"
        :direction="routeDirection"
        :isRepeater="true"
        :numberOfHeads="2"
        :canPassRed="canPassRed"
        :hasTrackLimitHead="hasTrackLimitHead"
        :slowTrack="slowTrack"
      />
      <Signal
        :blocksClear="blocksClearNumber"
        :direction="routeDirection"
        :numberOfHeads="2"
        :canPassRed="canPassRed"
        :hasTrackLimitHead="hasTrackLimitHead"
        :slowTrack="slowTrack"
        :gradeTimer="gradeTimer"
        :gradeTimerOn="gradeTimerOn"
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
import { computed, ref } from "vue";
import Signal from "./components/Signal.vue";
import { RouteDirection } from "./types";

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
</script>

<style scoped>
.signals {
  display: flex;
  gap: 1.5rem;
}
</style>
