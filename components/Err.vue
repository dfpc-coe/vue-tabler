<template>
    <Modal>
        <button
            type='button'
            class='btn-close'
            aria-label='Close'
            @click='close'
        />
        <div class='modal-status bg-yellow' />

        <Alert
            :title='title'
            :err='err'
        >
            <template
                v-if='$slots.advanced'
                #advanced='slotProps'
            >
                <slot
                    name='advanced'
                    v-bind='slotProps'
                />
            </template>
        </Alert>

        <div class='modal-footer'>
            <div class='w-100'>
                <div class='row'>
                    <div class='col'>
                        <a
                            class='cursor-pointer btn w-100'
                            @click='close'
                        >OK</a>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import Alert from './Alert.vue'

export interface ErrProps {
    err: Error;
    title?: string;
    trace?: boolean;
}

withDefaults(defineProps<ErrProps>(), {
    title: 'Website Error',
    trace: true
});

defineSlots<{
    advanced?: (props: { body: string }) => unknown;
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const close = () => {
    emit('close')
}
</script>
