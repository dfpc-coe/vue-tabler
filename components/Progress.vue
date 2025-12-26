<template>
    <div class='progress progress-xs'>
        <div
            class='progress-bar bg-primary'
            :style='`width: ${percent * 100}%;`'
        />
    </div>
</template>

<script setup lang="ts">
export interface ProgressProps {
    percent?: number;
}

withDefaults(defineProps<ProgressProps>(), {
    percent: 1
});
</script>
