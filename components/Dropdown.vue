<template>
    <div class='dropdown'>
        <div
            :id='id'
            data-bs-toggle='dropdown'
            :data-bs-auto-close='props.autoclose'
            aria-expanded='false'
            @click.stop.prevent=''
        >
            <slot>
                <IconSettings
                    :size='32'
                    :stoke='1'
                    class='cursor-pointer'
                />
            </slot>
        </div>
        <ul
            class='dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card'
            :style='{
                "width": width
            }'
            :aria-labelledby='id'
        >
            <slot name='dropdown'>
                Dropdown Content
            </slot>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    IconSettings
} from '@tabler/icons-vue';

const props = defineProps({
    width: {
        type: Number,
        default: 200
    },
    autoclose: {
        type: String,
        default: 'true'
    }
});

const id = ref('tabler-dropdown-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36));
</script>
