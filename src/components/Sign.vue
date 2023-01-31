<template>
    <div class="box">
        {{letter}}
    </div>
</template>
<script setup lang="ts">
    defineProps<{
        letter: string;
    }>()
</script>
<style scoped>
    .box {
        border: 1px solid #000;
        width: 3rem;
        height: 3rem;
        background-color: #eee;
        font-size: 2rem;
        text-align: center;
        line-height: 3rem;
    }
</style>
