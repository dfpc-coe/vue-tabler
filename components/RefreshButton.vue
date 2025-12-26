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

<script setup lang="ts">
import {
    IconRefresh
} from '@tabler/icons-vue';
import IconButton from './IconButton.vue';

export interface RefreshButtonProps {
    title?: string;
    loading?: boolean;
    size?: number;
}

const props = withDefaults(defineProps<RefreshButtonProps>(), {
    title: 'Refresh',
    loading: false,
    size: 32
});
</script>
