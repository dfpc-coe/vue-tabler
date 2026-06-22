<template>
    <div class='position-relative'>
        <pre
            v-if='pre'
            class='my-0'
            v-text='text'
        />
        <span
            v-else
            v-text='text'
        />
        <TablerIconButton
            title='Copy'
            class='position-absolute'
            style='right: 4px; top: 4px;'
            @click.stop.prevent='copy'
        >
            <IconCopy
                :size='20'
                stroke='1'
            />
        </TablerIconButton>
    </div>
</template>

<script setup lang="ts">
import IconButton from './IconButton.vue'
import {
    IconCopy,
} from '@tabler/icons-vue'

const TablerIconButton = IconButton;

export interface CopyFieldProps {
    text: string;
    pre?: boolean;
}

const props = withDefaults(defineProps<CopyFieldProps>(), {
    pre: false
});

async function copy() {
    await navigator.clipboard.writeText(props.text);
}
</script>
