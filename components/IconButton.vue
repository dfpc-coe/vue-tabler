<template>
<div
    :title='title'
    tabindex='0'
    role='button'
    v-tooltip='title'
    class='cursor-pointer hover-button rounded'
>
    <slot
        :size='size'
        :stroke='stroke'
    />
</div>
</template>

<script>
export default {
    name: 'TablerIconButton',
    props: {
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
