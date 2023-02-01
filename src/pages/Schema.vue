<template>
    <div>
      <input type="checkbox" v-model="showRepeaters" /> Show repeaters
      <div class="signals">
        <div v-for="(signal, index) in signals" class="signal">
          <input type="checkbox" :checked="blocked[index]" @change="onUpdateBlocked(index)" />
          <input type="checkbox" v-model="hasRouteHead[index]" />
          <input type="checkbox" v-model="diversion[index]" />
          <input type="checkbox" v-model="hasTrackLimitHead[index]" />
          <input type="checkbox" v-model="slowTrack[index]" />
          <input type="checkbox" v-model="hasGradeTimerHead[index]" />
          <input type="checkbox" v-model="gradeTimerOn[index]" />
          <input type="checkbox" v-model="canPassRed[index]" />
          <div class="two_signals">
            <Signal
              v-if="showRepeaters"
              :config="signalRepeaters[index]"
              :data="data[index]"
            />  
            <Signal
              :config="signal"
              :data="data[index]"
            />  
          </div>
      </div>   
      </div>
    </div>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from "vue";
  import Signal from "../components/Signal.vue";
  import { RouteDirection, SignalConfig, SignalData } from "../types";

  const showRepeaters = ref(true)
  
  const COUNT = 12

  const blocked = ref(new Array(COUNT).fill(false))
  const onUpdateBlocked = (index: number) => {
    for(let i = 0; i < blocked.value.length; ++i) {
      if (i != index) {
        blocked.value[i] = false
      }
    }
    blocked.value[index] = true
  }

  const hasRouteHead = ref(new Array(COUNT).fill(false))
  const diversion = ref(new Array(COUNT).fill(false))
  const hasTrackLimitHead = ref(new Array(COUNT).fill(false))
  const slowTrack = ref(new Array(COUNT).fill(false))
  const hasGradeTimerHead = ref(new Array(COUNT).fill(false))
  const gradeTimerOn = ref(new Array(COUNT).fill(false))
  const canPassRed = ref(new Array(COUNT).fill(false))

  const signals = computed(() => {
    const model: SignalConfig =  
      {
        isRepeater: false,
        hasRouteHead: false,
        isRouteAnnouce: false,
        isGradeTimerAnnounce: false,
        hasTrackLimitHead: false,
        hasGradeTimerHead: false,
        sign: ''
      }

    const result: SignalConfig[] = []
    for(let i = 0; i < COUNT; ++i) {
      result.push({
        ...model, 
        hasRouteHead: hasRouteHead.value[i] || hasRouteHead.value[i + 1],
        hasTrackLimitHead: hasTrackLimitHead.value[i],
        hasGradeTimerHead: hasGradeTimerHead.value[i] || hasGradeTimerHead.value[i + 1],
        isRouteAnnouce: hasRouteHead.value[i + 1],
        isGradeTimerAnnounce: hasGradeTimerHead.value[i + 1],
        sign: (hasRouteHead.value[i + 1] ? 'A' : '') + (hasGradeTimerHead.value[i + 1] ? 'S' : '')
      })
    }    
    return result
  })

  const signalRepeaters = computed(() => {
    const result = signals.value.map(v => ({
      ...v,
      isRepeater: true,
      sign: 'R'
    }))
    return result
  })
  
  const data = computed(() => {
    const result: SignalData[] = []
    const blockedIndex = blocked.value.findIndex(x => !!x)
    for(let i = 0; i < signals.value.length; ++i) {
      result.push({
      blocksClear: i < blockedIndex ? blockedIndex - i : 0,
      canPassRed: canPassRed.value[i],
      direction: diversion.value[signals.value[i].isRouteAnnouce ? i + 1 : i] ? RouteDirection.Divert : RouteDirection.Straight,
      gradeTimerOn: gradeTimerOn.value[signals.value[i].isGradeTimerAnnounce ? i + 1 : i],
      slowTrack: slowTrack.value[i]
      })
    }
    return result
  })
  
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
  