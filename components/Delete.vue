<template>
    <div>
        <template v-if='displaytype === "button"'>
            <div
                class='btn btn-outline-danger'
                @click.stop.prevent='modal = true'
            >
                <span v-text='label' />
            </div>
        </template>
        <template v-else>
            <TablerIconButton
                title='Delete'
                @click.stop.prevent='modal = true'
            >
                <IconTrash
                    :size='size'
                    :stroke='1'
                />
            </tablericonbutton>
        </template>

        <TablerModal v-if='modal'>
            <button
                type='button'
                class='btn-close'
                aria-label='Close'
                @click='modal = false'
            />
            <div class='modal-status bg-red' />
            <div class='modal-header text-center py-4'>
                Deletion Confirmation
            </div>
            <div class='modal-body text-center py-4'>
                Are you sure you wish to perform this deletion?
            </div>
            <div class='modal-footer'>
                <div
                    class='btn btn-danger'
                    @click='$emit("delete")'
                >
                    <TablerLoading
                        v-if='loading'
                        :inline='true'
                    />
                    <template v-else>
                        <IconTrash
                            :size='32'
                            :stroke='1'
                        /><span
                            class='mx-2'
                            v-text='label'
                        />
                    </template>
                </div>
            </div>
        </TablerModal>
    </div>
</template>

<script>
import TablerModal from './Modal.vue';
import TablerIconButton from './IconButton.vue';
import TablerLoading from './Loading.vue';
import {
    IconTrash
} from '@tabler/icons-vue';

export default {
    name: 'TablerDelete',
    components: {
        IconTrash,
        TablerLoading,
        TablerIconButton,
        TablerModal
    },
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
    emits: [
        'delete'
    ],
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
    }
}
</script>
