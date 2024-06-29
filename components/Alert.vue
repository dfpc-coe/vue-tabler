<template>
<div class='card-body'>
    <div class='d-flex justify-content-center' :class='{
        "mt-4 mb-2": !compact
    }'>
        <IconAlertTriangle v-if='compact' :size='32' :stroke='1' />
        <IconAlertTriangle v-else :size='48' :stroke='1'/>
    </div>

    <h3 class='pt-3 text-center' v-text='title'></h3>
    <div class='text-center' :class='{
        "mb-4 mt-2": !compact
    }'>
        <div><span v-text='err.message'/></div>
    </div>

    <template v-if='err.body || err.stack'>
        <div class="py-2 px-3">
            <div @click='open = !open' class='subheader d-flex align-items-center cursor-pointer'>
                <IconChevronRight v-if='!open' :size='24' :stroke='1' class='cursor-pointer'/>
                <IconChevronDown v-else :size='24' :stroke='1' class='cursor-pointer'/>
                <span>Advanced</span>
            </div>
            <pre
                v-if='open'
                v-text='err.body || err.stack'
                class='my-3'
            />
        </div>
    </template>
</div>
</template>

<script>
import {
    IconAlertTriangle,
    IconChevronRight,
    IconChevronDown,
} from '@tabler/icons-vue'

export default {
    name: 'TablerAlert',
    props: {
        title: {
            type: String,
            default: 'Generic Error'
        },
        err: {
            type: Error,
            default: new Error('Something is amiss')
        },
        compact: {
            type: Boolean,
            default: false
        },
    },
    data: function() {
        return {
            open: false
        }
    },
    components: {
        IconAlertTriangle,
        IconChevronRight,
        IconChevronDown,
    }
}
</script>
