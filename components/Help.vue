<template>
    <Modal>
        <button type="button" class="btn-close" @click='close' aria-label="Close"></button>
        <div class="modal-status bg-yellow"></div>
        <div class="modal-header d-flex">
            <span class='modal-title' v-text='label'></span>
        </div>
        <div class="modal-body text-center py-4">
            <div class="text-muted" v-text='description'></div>
        </div>
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

export default {
    name: 'TablerHelp',
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
    methods: {
        close: function() {
            this.$emit('close');
        }
    },
    components: {
        Modal,
    }
}
</script>
