<template>
<div class="dropdown">
    <div type="button" ref='button' :id='id' data-bs-toggle="dropdown" aria-expanded="false" class='border rounded' style='height: 36px;'>
            <slot>
                <SettingsIcon style='cursor-pointer'/>
            </slot>
    </div>
    <ul class="dropdown-menu" :aria-labelledby='id'>
        <slot name='dropdown'>
            Dropdown Content
        </slot>
    </ul>
</div>
</template>

<script>
import {
    SettingsIcon
} from 'vue-tabler-icons';

export default {
    name: 'TablerDropdown',
    data: function() {
        return {
            id: 'tabler-dropdown-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36)
        }
    },
    components: {
        SettingsIcon
    }
}
</script>
