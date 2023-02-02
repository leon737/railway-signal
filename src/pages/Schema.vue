<template>
  <div>
    <input type="checkbox" v-model="isBrl" /> Block Reducted Length
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
      <div v-for="(signal, index) in signals" class="signal">
        <input type="checkbox" v-model="blocked[index]" />
        <input type="checkbox" v-model="hasRouteHead[index]" />
        <input type="checkbox" v-model="diversion[index]" />
        <input type="checkbox" v-model="hasTrackLimitHead[index]" />
        <input type="checkbox" v-model="slowTrack[index]" />
        <input type="checkbox" v-model="hasGradeTimerHead[index]" />
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
import { RouteDirection, SignalConfig, SignalData } from "../types";
import useSignal from "../useSignal";

const { checkCanPass } = useSignal();

const COUNT = 20;

const isBrl = ref(true);
const blocked = ref(new Array(COUNT).fill(false));
const hasRouteHead = ref(new Array(COUNT).fill(false));
const diversion = ref(new Array(COUNT).fill(false));
const hasTrackLimitHead = ref(new Array(COUNT).fill(false));
const slowTrack = ref(new Array(COUNT).fill(false));
const hasGradeTimerHead = ref(new Array(COUNT).fill(false));
const gradeTimerOn = ref(new Array(COUNT).fill(false));
const canPassRed = ref(new Array(COUNT).fill(false));

const signals = computed(() => {
  const model: SignalConfig = {
    isBrl: isBrl.value,
    hasRouteHead: false,
    isRouteAnnouce: false,
    isGradeTimerAnnounce: false,
    hasTrackLimitHead: false,
    hasGradeTimerHead: false,
    sign: "",
  };

  const result: SignalConfig[] = [];
  for (let i = 0; i < COUNT; ++i) {
    result.push({
      ...model,
      hasRouteHead: hasRouteHead.value[i],
      hasTrackLimitHead: hasTrackLimitHead.value[i],
      hasGradeTimerHead: hasGradeTimerHead.value[i],
      isRouteAnnouce: hasRouteHead.value[i + 1],
      isGradeTimerAnnounce: hasGradeTimerHead.value[i + 1],
      sign:
        (hasRouteHead.value[i + 1] ? "A" : "") +
        (hasGradeTimerHead.value[i + 1] ? "S" : ""),
    });
  }
  return result;
});

const data = computed(() => {
  const getBlocksAhead = (blocked: boolean[], index: number) => {
    let result = 0;
    for (let i = index; i <= COUNT; ++i) {
      if (blocked[i]) {
        break;
      }
      result++;
    }
    return result;
  };

  const result: SignalData[] = [];
  for (let i = 0; i < signals.value.length; ++i) {
    const blocksAhead = getBlocksAhead(blocked.value, i);
    result.push({
      blocksClear: blocksAhead,
      canPassRed: canPassRed.value[i],
      direction: diversion.value[i]
        ? RouteDirection.Divert
        : RouteDirection.Straight,
      announceDirection: signals.value[i].isRouteAnnouce
        ? diversion.value[i + 1]
          ? RouteDirection.Divert
          : RouteDirection.Straight
        : RouteDirection.None,
      gradeTimerOn: gradeTimerOn.value[i],
      slowTrack: slowTrack.value[i],
      announceGradeTimerOn: signals.value[i].isGradeTimerAnnounce
        ? gradeTimerOn.value[i + 1]
        : false,
      canPassNextSignal: false,
    });
  }
  for (let i = 0; i < result.length - 1; ++i) {
    result[i].canPassNextSignal = checkCanPass(
      signals.value[i + 1],
      result[i + 1]
    );
  }
  return result;
});
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
