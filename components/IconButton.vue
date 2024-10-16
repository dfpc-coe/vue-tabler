<template>
<div
    tabindex='0'
    role='button'
    v-tooltip='title'
    class='cursor-pointer hover-button rounded'
>
    <IconButton
        :title='title'
        :size='size'
        :stroke='stroke'
    />
</div>
</template>

<script setup>
import { defineAsyncComponent, defineProps } from 'vue'
import * as Icons from '@tabler/icons-vue';

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        default: 32
    },
    stroke: {
        type: Number,
        default: 1
    }
})

const IconButton = Icons[props.icon];
</script>
