<template>
<div>
    <template v-if='displaytype === "button"'>
        <div @click='modal = true' class="btn btn-outline-danger">
            <span v-text='label'/>
        </div>
    </template>
    <template v-else>
        <TrashIcon @click='modal = true' class='cursor-pointer'/>
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
                <TrashIcon/><span class='mx-2' v-text='label'/>
            </div>
        </div>
    </TablerModal>
</div>
</template>

<script>
import TablerModal from './Modal.vue';
import {
    TrashIcon
} from '@tabler/icons-vue';

export default {
    name: 'TablerDelete',
    props: {
        label: {
            type: String,
            default: 'Delete'
        },
        displaytype: {
            type: String,
            default: 'button' // Or icon
        }
    },
    data: function() {
        return {
            modal: false
        }
    },
    components: {
        TrashIcon,
        TablerModal
    }
}
</script>
