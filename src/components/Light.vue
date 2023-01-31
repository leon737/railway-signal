<template>
    <div class="lens">
        <div class="light" :style="{'background-color': color }" :class="extraClass">
        </div>        
    </div>
</template>
<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import useFlashingLight from '../useFlashingLight';

    const props = defineProps<{
        color: string;
        flashing: boolean;
        out: boolean;
    }>()

    const {register, unregister} = useFlashingLight()

    const lightOut = ref(props.out)
    const extraClass = computed(() => lightOut.value ? 'light-out': '')

    watch(() => props.out, value => {
        lightOut.value = value
    })

    let cb: any = null

    onMounted(() => {
        cb = register(() => {
            if (props.out) {
                lightOut.value = true
                return
            }
            if (props.flashing) {
                if (lightOut.value) {
                    lightOut.value = false
                }
                else {
                    lightOut.value = true
                }
            }
        })
    })

    onUnmounted(() => {
        unregister(cb)
    })
</script>
<style scoped>
    .lens {
        width: 2rem;
        height: 2rem;
        border-radius: 1rem;
        border: 1px solid #000;
        background-color: #000;
    }

    .light {
        width: 2rem;
        height: 2rem;
        border-radius: 1rem;
    }

    .light-out {
        opacity: 0;
        transition: opacity 0.2s linear;
    }
</style>