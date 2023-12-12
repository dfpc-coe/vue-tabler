<template>
    <Modal>
        <button type="button" class="btn-close" @click='close' aria-label="Close"></button>
        <div class="modal-status bg-yellow"></div>
        <div class="modal-body text-center py-4">
            <IconAlertCircle/>
            <h3>Website Error</h3>
            <div class="text-muted" v-text='err.message'></div>
            <pre v-if='err.body' v-text='err.body'></pre>
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
import {
    IconAlertCircle
} from '@tabler/icons-vue'

export default {
    name: 'TablerErr',
    props: ['err'],
    methods: {
        close: function() {
            this.$emit('close');
        }
    },
    components: {
        Modal,
        IconAlertCircle
    }
}
</script>
