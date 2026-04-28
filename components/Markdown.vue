<template>
    <div
        :style='autowrap ? `white-space: pre-wrap;` : ``'
        v-html='html'
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

export interface MarkdownProps {
    markdown: string;
    autowrap?: boolean;
}

const props = withDefaults(defineProps<MarkdownProps>(), {
    autowrap: true
});

const html = computed(() => {
    return marked.parse(props.markdown, {
        async: false,
        gfm: true
    })
})
</script>
