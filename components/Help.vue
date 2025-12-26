<template>
    <Modal>
        <button
            type='button'
            class='btn-close'
            aria-label='Close'
            @click='close'
        />
        <div class='modal-status bg-yellow' />
        <div class='modal-header d-flex'>
            <span
                class='modal-title'
                v-text='label'
            />
        </div>
        <div class='modal-body text-center py-4'>
            <div
                class='text-muted'
                v-text='description'
            />
        </div>
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

export interface HelpProps {
    label?: string;
    description: string;
}

withDefaults(defineProps<HelpProps>(), {
    label: 'Help'
});

const emit = defineEmits<{
    (e: 'close'): void
}>()

const close = () => {
    emit('close')
}
</script>
