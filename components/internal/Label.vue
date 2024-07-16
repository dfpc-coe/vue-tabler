<template>
<div class='col-12 d-flex my-1'>
    <span v-if='description' class='align-self-center'>
        <IconInfoSquare @click='help = true' :size='20' :stroke='1' class='cursor-pointer'/>
        <Help v-if='help' @click='help = false' :label='label || placeholder' :description='description'/>
    </span>
    <div class='align-self-center'>
        <div
            v-if='label'
            class="px-2"
        >
            <span v-text='label'/>
            <span v-if='required' class='text-red mx-1'>*</span>
        </div>
    </div>
    <div class='ms-auto align-self-center'>
        <slot/>
    </div>
</div>
</template>

<script>
import {
    IconInfoSquare
} from '@tabler/icons-vue';
import Help from '../Help.vue';

export default {
    name: 'TablerInternalLabel',
    props: {
        required: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default: '',
        },
        label: String,
    },
    data: function() {
        return {
            help: false,
        }
    },
    components: {
        Help,
        IconInfoSquare
    }
}
</script>
