<template>
<div class="progress progress-xs">
    <div
        class="progress-bar bg-primary"
        :style='`width: ${percent * 100}%;`'
    ></div>
</div>
</template>

<script>
export default {
    name: 'TablerProgress',
    props: {
        percent: {
            type: Number,
            default: 1
        }
    }
}
</script>
