<template>
    <div class='progress progress-xs'>
        <div
            class='progress-bar bg-primary'
            :style='`width: ${percent * 100}%;`'
        />
    </div>
</template>

<script setup>
defineProps({
    percent: {
        type: Number,
        default: 1
    }
})
</script>
