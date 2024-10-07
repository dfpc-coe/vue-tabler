<template>
    <div class='dropdown'>
        <div
            :id='id'
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
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
            class='dropdown-menu w-100'
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
    data: function() {
        return {
            id: 'tabler-dropdown-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36)
        }
    }
}
</script>
