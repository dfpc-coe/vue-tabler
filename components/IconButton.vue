<template>
<component
    :is='IconButton'
    :title='title'
    :size='size'
    :stroke='stroke'
    tabindex='0'
    role='button'
    v-tooltip='title'
    class='cursor-pointer hover-button rounded'
/>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
    name: 'TablerIconButton',
    props: {
        icon: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            default: 32
        },
        stroke: {
            type: Number,
            default: 5
        }
    },
    components: {
        IconButton: defineAsyncComponent(() => import(`@tabler/icons-vue/dist/esm/icons/${this.icon}.mjs`))
    }
}
</script>
