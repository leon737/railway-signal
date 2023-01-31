<template>
    <div class="box">
        <Light v-for="light in lights" :color="light.color" :flashing="light.flashing" :out="light.out" />
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { HeadType, RouteLight, SpeedLight, LightData, RouteDirection } from '../types';
import Light from './Light.vue';

const props = defineProps<{
        type: HeadType;
        speedLight: SpeedLight;
        routeLight: RouteLight;
        isRepeater: boolean;
        isAnnounce: boolean;
    }>()

const lights = reactive([] as LightData[])    


if (props.type == HeadType.Speed) {
    lights.push({
    color: 'red',
    flashing: false,
    out: true
})  
}
lights.push({
    color: '#0f0',
    flashing: false,
    out: true
})
lights.push({
    color: 'yellow',
    flashing: false,
    out: true
})
lights.push({
    color: 'red',
    flashing: false,
    out: false
})

switch(props.type) {
    case HeadType.Speed:
        watch([() => props.speedLight.blocksClear, () => props.speedLight.canPassRed], ([blocksClear, canPassRed]) => {
            let index = -1
            let flashing = false
            if (blocksClear < 1) {
                index = 3
            } else if (blocksClear == 1) {
                index = 2
            } else if (blocksClear == 2) {
                index = 1
            } else {
                index = 1
                flashing = true
            }
            for (let i = 0; i < lights.length; ++i) {
                lights[i].out = true
            }
            if (props.isRepeater) {
                flashing = true
            }
            lights[index].out = false
            lights[index].flashing = flashing

            if (canPassRed && blocksClear < 1 && !props.isRepeater) {
                lights[3].flashing = true
                lights[0].out = false
            }

        }, {
            immediate: true
        })
        break
    case HeadType.Route:
        watch([() => props.routeLight.direction, () => props.speedLight.blocksClear], ([direction, blocksClear]) => {
            let index = -1
            let flashing = false
            if (blocksClear < 1) {
                index = 2
            }
            else  {
                if (direction == RouteDirection.Straight) {
                    index = 0
                } else {
                    index = 1
                    if (props.isAnnounce) {
                        flashing = true
                    }
                }
            }
            for (let i = 0; i < lights.length; ++i) {
                lights[i].out = true
            }
            lights[index].out = false
            lights[index].flashing = flashing
        }, {
            immediate: true
        })
        break
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