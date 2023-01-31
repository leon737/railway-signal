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
import { reactive, ref, watch } from "vue";
import {
  HeadType,
  RouteLight,
  SpeedLight,
  LightData,
  RouteDirection,
} from "../types";
import Light from "./Light.vue";

const props = defineProps<{
  type: HeadType;
  speedLight: SpeedLight;
  routeLight: RouteLight;
  isRepeater: boolean;
  isAnnounce: boolean;
  slowTrack: boolean;
  gradeTimerOn?: boolean;
}>();

const lights = reactive([] as LightData[]);

const greenIndices = [1, 0, 0];
const yellowIndices = [2, 1, 1];
const redIndices = [3, 2, 2];

let greenIndex = 0;
let yellowIndex = 0;
let redIndex = 0;

watch(
  () => props.type,
  (_) => {
    lights.splice(0, lights.length);

    greenIndex = greenIndices[props.type];
    yellowIndex = yellowIndices[props.type];
    redIndex = redIndices[props.type];

    if (props.type == HeadType.Speed || props.type == HeadType.TrackLimit) {
      lights.push({
        color: "red",
        flashing: false,
        out: true,
      });
    }

    switch (props.type) {
      case HeadType.Speed:
      case HeadType.MiniSpeed:
      case HeadType.Route:
        lights.push({
          color: "#0f0",
          flashing: false,
          out: true,
        });
        lights.push({
          color: "yellow",
          flashing: false,
          out: true,
        });
        lights.push({
          color: "red",
          flashing: false,
          out: false,
        });
        break;
      case HeadType.GradeTime:
        lights.push({
          color: "#FFF",
          flashing: false,
          out: false,
        });
        break;
    }
  },
  {
    immediate: true,
  }
);

switch (props.type) {
  case HeadType.Speed:
  case HeadType.MiniSpeed:
    watch(
      [
        () => props.speedLight.blocksClear,
        () => props.speedLight.canPassRed,
        () => props.gradeTimerOn,
      ],
      ([blocksClear, canPassRed, gradeTimerOn]) => {
        let index = -1;
        let flashing = false;
        if (blocksClear < 1) {
          index = redIndex;
        } else if (blocksClear == 1) {
          index = yellowIndex;
        } else if (blocksClear == 2) {
          index = greenIndex;
        } else {
          index = greenIndex;
          flashing = true;
        }
        for (let i = 0; i < lights.length; ++i) {
          lights[i].out = true;
        }
        if (props.isRepeater && (blocksClear < 2 || blocksClear > 3)) {
          flashing = true;
        }

        lights[index].flashing = flashing;
        lights[index].out = false;

        if (
          (canPassRed || gradeTimerOn) &&
          blocksClear < 1 &&
          !props.isRepeater
        ) {
          lights[redIndex].flashing = !!canPassRed;
          if (props.type != HeadType.MiniSpeed) {
            lights[0].out = false;
          }
        }
      },
      {
        immediate: true,
      }
    );
    break;
  case HeadType.Route:
    watch(
      [
        () => props.routeLight.direction,
        () => props.speedLight.blocksClear,
        () => props.speedLight.canPassRed,
        () => props.gradeTimerOn,
      ],
      ([direction, blocksClear, canPassRed, gradeTimerOn]) => {
        let index = -1;
        let flashing = false;
        if (blocksClear < 1 && !canPassRed && !gradeTimerOn) {
          index = redIndex;
        } else {
          if (direction == RouteDirection.Straight) {
            index = props.isAnnounce ? -1 : greenIndex;
          } else {
            index = yellowIndex;
            if (props.isAnnounce) {
              flashing = true;
            }
          }
        }
        for (let i = 0; i < lights.length; ++i) {
          lights[i].out = true;
        }
        if (index >= 0) {
          lights[index].flashing = flashing;
          lights[index].out = false;
        }
      },
      {
        immediate: true,
      }
    );
    break;
  case HeadType.TrackLimit:
    watch(
      [
        () => props.slowTrack,
        () => props.speedLight.blocksClear,
        () => props.speedLight.canPassRed,
        () => props.gradeTimerOn,
      ],
      ([slowTrack, blocksClear, canPassRed, gradeTimerOn]) => {
        if (blocksClear < 1) {
          lights[0].out = (!gradeTimerOn && !canPassRed) || props.isRepeater;
        } else {
          lights[0].out = !slowTrack;
        }
        lights[0].flashing = props.isRepeater;
      },
      {
        immediate: true,
      }
    );
    break;
  case HeadType.GradeTime:
    watch(
      [() => props.gradeTimerOn, () => props.speedLight.blocksClear],
      ([gradeTimerOn, blocksClear]) => {
        lights[0].out = !gradeTimerOn || blocksClear > 1;
        lights[0].flashing = props.isAnnounce;
      },
      {
        immediate: true,
      }
    );
    break;
}
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
