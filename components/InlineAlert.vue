<template>
    <div class='col-lg-12'>
        <div
            class='alert d-flex'
            :class='`alert-${props.severity} ${props.dismissable ? "alert-dismissible" : ""}`'
            role='alert'
        >
            <div class='alert-icon'>
                <IconInfoCircle
                    v-if='props.severity === "info"'
                    :size='24'
                    stroke='1'
                />
                <IconExclamationCircle
                    v-else-if='props.severity === "danger"'
                    :size='24'
                    stroke='1'
                />
                <IconAlertTriangle
                    v-else-if='props.severity === "warning"'
                    :size='24'
                    stroke='1'
                />
                <IconCheck
                    v-else-if='props.severity === "success"'
                    :size='24'
                    stroke='1'
                />
                <IconQuestionMark
                    v-else
                    :size='24'
                    stroke='1'
                />
            </div>

            <div>
                <h4
                    class='alert-heading'
                    v-text='props.title'
                />
                <div
                    v-if='props.description'
                    class='alert-description'
                    v-text='props.description'
                />
            </div>
            <a
                v-if='props.dismissable'
                class='btn-close'
                data-bs-dismiss='alert'
                aria-label='close'
            />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { withDefaults } from 'vue'
import {
    IconQuestionMark,
    IconInfoCircle,
    IconExclamationCircle,
    IconAlertTriangle
} from '@tabler/icons-vue';

const props = withDefaults(defineProps<{
    severity: string // info, danger, warning, success
    title: string
    description?: string
    dismissable: boolean
}>(), {
    severity: 'info',
    dismissable: false,
});
</script>
