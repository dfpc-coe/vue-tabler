<template>
    <div
        :style='autowrap ? `white-space: pre-wrap;` : ``'
        v-html='html'
    />
</template>

<script setup>
import { computed } from 'vue'
import showdown from 'showdown'

const props = defineProps({
    markdown: {
        type: String,
        required: true
    },
    autowrap: {
        type: Boolean,
        default: true
    }
})

const html = computed(() => {
    const converter = new showdown.Converter({
        tables: true,
        tasklists: true,
        emoji: true
    })
    return converter.makeHtml(props.markdown)
})
</script>
