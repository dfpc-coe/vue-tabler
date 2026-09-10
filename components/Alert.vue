<template>
    <div class='card-body'>
        <div
            class='d-flex justify-content-center'
            :class='{
                "mt-4 mb-2": !compact
            }'
        >
            <IconAlertTriangle
                v-if='compact'
                :size='32'
                stroke='1'
            />
            <IconAlertTriangle
                v-else
                :size='48'
                stroke='1'
            />
        </div>

        <h3
            class='pt-3 text-center'
            v-text='title'
        />
        <div
            class='text-center'
            :class='{
                "mb-4 mt-2": !compact
            }'
        >
            <div><span v-text='err.message' /></div>
        </div>

        <template v-if='advanced && (err.body || err.stack)'>
            <div class='py-2 px-3'>
                <div
                    class='subheader d-flex align-items-center cursor-pointer'
                    @click='open = !open'
                >
                    <IconChevronRight
                        v-if='!open'
                        :size='24'
                        stroke='1'
                        class='cursor-pointer'
                    />
                    <IconChevronDown
                        v-else
                        :size='24'
                        stroke='1'
                        class='cursor-pointer'
                    />
                    <span>Advanced</span>
                </div>
                <slot
                    v-if='open'
                    name='advanced'
                    :body='body'
                >
                    <pre
                        class='my-3'
                        style='white-space: pre-wrap; word-break: break-word;'
                        v-text='body'
                    />
                </slot>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    IconAlertTriangle,
    IconChevronRight,
    IconChevronDown,
} from '@tabler/icons-vue'

export interface AlertProps {
    title?: string;
    err?: Error & { body?: string | Record<string, unknown> };
    compact?: boolean;
    advanced?: boolean;
}

const props = withDefaults(defineProps<AlertProps>(), {
    title: 'Generic Error',
    err: () => new Error('Something is amiss'),
    compact: false,
    advanced: true
});

defineSlots<{
    advanced?: (props: { body: string }) => unknown;
}>()

const open = ref(false)

const body = computed<string>(() => {
    const raw = props.err.body || props.err.stack || '';
    return typeof raw === 'string' ? raw : JSON.stringify(raw, null, 4);
})
</script>
