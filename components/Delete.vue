<template>
    <div>
        <template v-if='props.displaytype === "button"'>
            <button
                class='btn btn-outline-danger'
                :disabled='props.disabled'
                @click.stop.prevent='openModal'
            >
                <span v-text='props.label' />
            </button>
        </template>
        <template v-else-if='props.displaytype === "menu"'>
            <div
                class='col-12 d-flex align-items-center px-2 py-2'
                :class='{
                    "cursor-pointer": !props.disabled,
                }'
                @click.stop.prevent='openModal'
            >
                <IconTrash
                    :size='32'
                    stroke='1'
                />
                <span
                    class='mx-2'
                    v-text='props.label'
                />
            </div>
        </template>
        <template v-else-if='props.displaytype === "icon"'>
            <TablerIconButton
                :title='props.title'
                :disabled='props.disabled'
                @click.stop.prevent='openModal'
            >
                <IconTrash
                    :size='props.size'
                    stroke='1'
                />
            </TablerIconButton>
        </template>

        <TablerModal v-if='open'>
            <button
                type='button'
                class='btn-close'
                aria-label='Close'
                @click='open = false'
            />
            <div class='modal-status bg-red' />
            <div class='modal-header text-center py-4'>
                Deletion Confirmation
            </div>
            <div class='modal-body text-center py-4'>
                <div>Are you sure you wish to perform this deletion?</div>
                <div
                    v-if='props.match'
                    class='mt-3'
                >
                    <div class='mb-2'>
                        Type <span class='fw-bold'>{{ props.match }}</span> to confirm
                    </div>
                    <TablerInput
                        v-model='matchInput'
                        :placeholder='props.match'
                    />
                </div>
            </div>
            <div class='modal-footer'>
                <div
                    class='btn btn-danger'
                    :class='{ "disabled": props.match && matchInput !== props.match }'
                    @click='(props.match && matchInput !== props.match) ? undefined : deleting()'
                >
                    <TablerLoading
                        v-if='loading'
                        :inline='true'
                    />
                    <template v-else>
                        <IconTrash
                            :size='props.size'
                            stroke='1'
                        /><span
                            class='mx-2'
                            v-text='props.label'
                        />
                    </template>
                </div>
            </div>
        </TablerModal>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TablerModal from './Modal.vue';
import TablerIconButton from './IconButton.vue';
import TablerLoading from './Loading.vue';
import TablerInput from './input/Input.vue';
import {
    IconTrash
} from '@tabler/icons-vue';

export interface DeleteProps {
    label?: string;
    title?: string;
    size?: number;
    disabled?: boolean;
    displaytype?: 'button' | 'icon' | 'menu' | 'none';
    match?: string;
}

const props = withDefaults(defineProps<DeleteProps>(), {
    label: 'Delete',
    title: 'Delete',
    size: 32,
    disabled: false,
    displaytype: 'button'
});

const emit = defineEmits<{
    (e: 'delete'): void
}>()

const open = defineModel<boolean>('open', { default: false })

const loading = ref(false)
const matchInput = ref('')

watch(open, () => {
    loading.value = false;
    matchInput.value = '';
})

const openModal = () => {
    if (props.disabled) return;
    open.value = true;
}

const deleting = () => {
    loading.value = true;
    emit('delete')
}
</script>
