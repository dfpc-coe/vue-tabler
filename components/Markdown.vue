<template>
    <!-- eslint-disable vue/no-v-html -->
    <div
        class='tabler-markdown'
        :class='{ "tabler-markdown--breaks": breaks }'
        :style='autowrap && !breaks ? `white-space: pre-wrap;` : ``'
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
    /**
     * Keep single line breaks inside of paragraphs - unlike `autowrap` the newlines Markdown
     * puts between blocks aren't rendered so tables & lists don't gain blank lines
     */
    breaks?: boolean;
}

const props = withDefaults(defineProps<MarkdownProps>(), {
    autowrap: true,
    breaks: false
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

<style src='./internal/markdown.css' />
