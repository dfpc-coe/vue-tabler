<template>
    <div>
        <template v-if='props.displaytype === "button"'>
            <button
                class='btn btn-outline-primary'
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
                <IconCheck
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
                <IconCheck
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
            <div class='modal-status bg-primary' />
            <div
                class='modal-header text-center py-4'
                v-text='props.heading'
            />
            <div class='modal-body text-center py-4'>
                <slot>
                    <div v-text='props.description' />
                </slot>
            </div>
            <div class='modal-footer'>
                <div
                    class='btn btn-primary'
                    @click='confirming'
                >
                    <TablerLoading
                        v-if='loading'
                        :inline='true'
                    />
                    <template v-else>
                        <IconCheck
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
import {
    IconCheck
} from '@tabler/icons-vue';

export interface ConfirmProps {
    label?: string;
    title?: string;
    heading?: string;
    description?: string;
    size?: number;
    disabled?: boolean;
    displaytype?: 'button' | 'icon' | 'menu' | 'none';
}

const props = withDefaults(defineProps<ConfirmProps>(), {
    label: 'Confirm',
    title: 'Confirm',
    heading: 'Confirmation',
    description: 'Are you sure you wish to perform this action?',
    size: 32,
    disabled: false,
    displaytype: 'button'
});

const emit = defineEmits<{
    (e: 'confirm'): void
}>()

const open = defineModel<boolean>('open', { default: false })

const loading = ref(false)

watch(open, () => {
    loading.value = false;
})

const openModal = () => {
    if (props.disabled) return;
    open.value = true;
}

const confirming = () => {
    if (loading.value) return;
    loading.value = true;
    emit('confirm')
}
</script>
