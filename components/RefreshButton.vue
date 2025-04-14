<template>
    <IconButton
        :title='title'
    >
        <IconRefresh
            v-if='!props.loading'
            :size='props.size'
            stroke='1'
        />
        <div
            v-else
            class='d-flex align-items-center justify-content-center'
            :style='{
                "height": `${props.size}px`,
                "width": `${props.size}px`
            }'
        >
            <div
                class='spinner-border text-secondary'
                role='status'
            />
        </div>
    </IconButton>
</template>

<script setup>
import { defineProps } from 'vue'
import {
    IconRefresh
} from '@tabler/icons-vue';
import IconButton from './IconButton.vue';

const props = defineProps({
    title: {
        type: String,
        default: 'Refresh'
    },
    loading: {
        type: Boolean,
        default: false
    },
    size: {
        type: Number,
        default: 32
    }
})
</script>
