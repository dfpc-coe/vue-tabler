<template>
    <IconButton
        :title='title'
    >
        <IconRefresh
            v-if='!props.refreshing'
            :size='32'
            stroke='1'
        />
        <div 
            v-else
            style='{
            height: 32px;
            width: 32px;
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
import IconButton from './IconButton.vue';

defineProps({
    title: {
        type: String,
        default: 'Refresh'
    },
    refreshing: {
        type: Boolean,
        default: false
    }
})
</script>
