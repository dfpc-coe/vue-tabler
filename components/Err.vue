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
        />

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
import Alert from './Alert.vue';

export default {
    name: 'TablerErr',
    components: {
        Alert,
        Modal
    },
    props: {
        err: {
            type: Error,
            required: true
        },
        title: {
            type: String,
            default: 'Website Error'
        },
        trace: {
            type: Boolean,
            default: true
        }
    },
    emits: [
        'close'
    ],
    data: function() {
        return {
            open: false
        }
    },
    methods: {
        close: function() {
            this.$emit('close');
        },
    }
}
</script>
