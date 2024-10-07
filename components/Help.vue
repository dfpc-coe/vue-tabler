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

<script>
import Modal from './Modal.vue';

export default {
    name: 'TablerHelp',
    components: {
        Modal,
    },
    props: {
        label: {
            type: String,
            require: false,
            default: 'Help'
        },
        description: {
            type: String,
            require: true
        }
    },
    emits: [
        'close'
    ],
    methods: {
        close: function() {
            this.$emit('close');
        }
    }
}
</script>
