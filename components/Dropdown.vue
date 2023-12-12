<template>
<div class="dropdown">
    <div type="button" :id='id' data-bs-toggle="dropdown" aria-expanded="false">
        <slot>
            <IconSettings style='cursor-pointer'/>
        </slot>
    </div>
    <ul class="dropdown-menu w-100" :aria-labelledby='id'>
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
    data: function() {
        return {
            id: 'tabler-dropdown-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36)
        }
    },
    components: {
        IconSettings
    }
}
</script>
