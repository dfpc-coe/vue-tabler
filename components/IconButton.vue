<template>
    <component
        :is='icon'
        :title='title'
        :size='size'
        :stroke='stroke'
        tabindex='0'
        v-tooltip='title'
        class='cursor-pointer hover-button rounded'
    />
</template>

<script>
export default {
    name: 'TablerIconButton',
    props: {
        icon: {
            type: Object,
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
}
</script>
