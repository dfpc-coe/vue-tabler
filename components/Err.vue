<template>
    <Modal>
        <button type="button" class="btn-close" @click='close' aria-label="Close"></button>
        <div class="modal-status bg-yellow"></div>

        <Alert :title='title' :err='err'/>

        <div class="modal-footer">
            <div class="w-100">
                <div class="row">
                    <div class="col"><a @click='close' class="cursor-pointer btn w-100">OK</a></div>
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
    data: function() {
        return {
            open: false
        }
    },
    methods: {
        close: function() {
            this.$emit('close');
        },
    },
    components: {
        Alert,
        Modal
    }
}
</script>
