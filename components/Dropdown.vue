<template>
    <div class='dropdown'>
        <div
            :id='id'
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
            @click.stop.prevent=''
        >
            <slot>
                <IconSettings
                    :size='32'
                    :stoke='1'
                    class='cursor-pointer'
                />
            </slot>
        </div>
        <ul
            class='dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card show'
            :style='{
                "width": width
            }'
            :aria-labelledby='id'
        >
            <slot name='dropdown'>
                Dropdown Content
            </slot>
        </ul>
    </div>
</template>

<script>
import {
    IconSettings
} from '@tabler/icons-vue';

export default {
    name: 'TablerDropdown',
    components: {
        IconSettings
    },
    props: {
        width: {
            type: Number,
            default: 200
        }
    },
    data: function() {
        return {
            id: 'tabler-dropdown-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36)
        }
    }
}
</script>
