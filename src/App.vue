<template>
  <div>
    <div class="signals">
    <Signal :blocksClear="blocksClearNumber" :direction="routeDirection" :isRepeater="true" :numberOfHeads="1" :canPassRed="canPassRed" />
    <Signal :blocksClear="blocksClearNumber" :direction="routeDirection" :numberOfHeads="1" :canPassRed="canPassRed" />
    <Signal :blocksClear="blocksClearNumber + 1" :direction="routeDirection" :isRepeater="true" :numberOfHeads="2" :canPassRed="canPassRed" :isAnnounce="true" />
    <Signal :blocksClear="blocksClearNumber + 1" :direction="routeDirection" :numberOfHeads="2" :canPassRed="canPassRed" :isAnnounce="true"/>    
    <Signal :blocksClear="blocksClearNumber" :direction="routeDirection" :isRepeater="true" :numberOfHeads="2" :canPassRed="canPassRed" />
    <Signal :blocksClear="blocksClearNumber" :direction="routeDirection" :numberOfHeads="2" :canPassRed="canPassRed" />    
  </div>
    <div>
      <select v-model="blocksClear">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <select v-model="direction">
        <option value="straight">straight</option>
        <option value="divert">divert</option>
      </select>
      <input type="checkbox" v-model="canPassRed" /> Can pass red
  </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import Signal from './components/Signal.vue'
import { RouteDirection } from './types';

const blocksClear = ref(0)
const blocksClearNumber = computed(() => +blocksClear.value)
const direction = ref("straight")
const routeDirection = computed(() => direction.value === "straight" ? RouteDirection.Straight : RouteDirection.Divert)
const canPassRed = ref(false)
</script>

<style scoped>
  .signals {
    display: flex;
    gap: 1.5rem;
  }
</style>
