<template>
    <div class='col-12 d-flex my-1'>
        <span
            v-if='props.description'
            class='align-self-center'
        >
            <Dropdown>
                <template #default>
                    <IconInfoSquare
                        :size='20'
                        :stroke='1'
                        class='cursor-pointer'
                        @click='help = true'
                    />
                </template>
                <template #dropdown>
                    <div class='card'>
                        <div class='card-header'>
                            <div
                                class='card-title'
                                v-text='props.label'
                            />
                        </div>
                        <div
                            class='card-body'
                            v-text='props.description'
                        />
                    </div>
                </template>
            </dropdown>
        </span>
        <div class='align-self-center'>
            <div
                v-if='label'
                class='px-2'
            >
                <span
                    class='user-select-none'
                    v-text='label'
                />
                <span
                    v-if='props.required'
                    class='text-red mx-1'
                >*</span>
            </div>
        </div>
        <div class='ms-auto align-self-center'>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    IconInfoSquare
} from '@tabler/icons-vue';

import Dropdown from '../Dropdown.vue';

export interface LabelProps {
    required?: boolean;
    description?: string;
    label: string;
}

const props = withDefaults(defineProps<LabelProps>(), {
    required: false,
    description: '',
});
</script>
