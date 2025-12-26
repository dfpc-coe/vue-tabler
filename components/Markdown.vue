<template>
    <div
        :style='autowrap ? `white-space: pre-wrap;` : ``'
        v-html='html'
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import showdown from 'showdown'

export interface MarkdownProps {
    markdown: string;
    autowrap?: boolean;
}

const props = withDefaults(defineProps<MarkdownProps>(), {
    autowrap: true
});

const html = computed(() => {
    const converter = new showdown.Converter({
        tables: true,
        tasklists: true,
        emoji: true
    })
    return converter.makeHtml(props.markdown)
})
</script>
