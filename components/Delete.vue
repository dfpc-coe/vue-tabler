<template>
<div>
    <template v-if='displaytype === "button"'>
        <div @click.stop.prevent='modal = true' class="btn btn-outline-danger">
            <span v-text='label'/>
        </div>
    </template>
    <template v-else>
        <IconTrash @click.stop.prevent='modal = true' :size='size' class='cursor-pointer'/>
    </template>

    <TablerModal v-if='modal'>
        <button type="button" class="btn-close" @click='modal = false' aria-label="Close"></button>
        <div class="modal-status bg-red"></div>
        <div class="modal-header text-center py-4">
            Deletion Confirmation
        </div>
        <div class="modal-body text-center py-4">
            Are you sure you wish to perform this deletion?
        </div>
        <div class="modal-footer">
            <div @click='$emit("delete")' class="btn btn-danger">
                <TablerLoading v-if='loading' :inline='true'/>
                <template v-else>
                    <IconTrash size='32'/><span class='mx-2' v-text='label'/>
                </template>
            </div>
        </div>
    </TablerModal>
</div>
</template>

<script>
import TablerModal from './Modal.vue';
import TablerLoading from './Loading.vue';
import {
    IconTrash
} from '@tabler/icons-vue';

export default {
    name: 'TablerDelete',
    props: {
        label: {
            type: String,
            default: 'Delete'
        },
        size: {
            type: Number,
            default: 32
        },
        displaytype: {
            type: String,
            default: 'button' // Or icon
        }
    },
    data: function() {
        return {
            loading: false,
            modal: false
        }
    },
    methods: {
        deleting: function() {
            this.loading = true;
            this.$emit('delete')
        }
    },
    components: {
        IconTrash,
        TablerLoading,
        TablerModal
    }
}
</script>
