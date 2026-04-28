<template>
    <!-- eslint-disable vue/no-v-html -->
    <div
        :style='autowrap ? `white-space: pre-wrap;` : ``'
        v-html='html'
    />
    <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

export interface MarkdownProps {
    markdown: string;
    autowrap?: boolean;
}

const props = withDefaults(defineProps<MarkdownProps>(), {
    autowrap: true
});

function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        USE_PROFILES: {
            html: true
        }
    })
}

const html = computed(() => {
    const rendered = marked.parse(props.markdown, {
        async: false,
        gfm: true
    })

    return sanitizeHtml(rendered)
})
</script>
