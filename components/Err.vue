<template>
    <Modal>
        <button type="button" class="btn-close" @click='close' aria-label="Close"></button>
        <div class="modal-status bg-yellow"></div>
        <div class="modal-body text-center py-4">
            <IconAlertCircle size='40'/>
            <h3>Website Error</h3>
            <div class="text-muted" v-text='err.message'></div>
        </div>

        <template v-if='err.body || err.stack'>
            <div class="py-2 px-3">
                <div @click='open = !open' class='subheader d-flex align-items-center cursor-pointer'>
                    <IconChevronRight v-if='!open' size='24' class='cursor-pointer'/>
                    <IconChevronDown v-else size='24' class='cursor-pointer'/>
                    <span>Advanced</span>
                    </div>
                <pre
                    v-if='open'
                    v-text='err.body || err.stack'
                    class='my-3'
                />
            </div>
        </template>
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
    IconAlertCircle,
    IconChevronRight,
    IconChevronDown
} from '@tabler/icons-vue'

export default {
    name: 'TablerErr',
    props: {
        err: {
            type: Error,
            required: true
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
        Modal,
        IconChevronRight,
        IconChevronDown,
        IconAlertCircle
    }
}
</script>
