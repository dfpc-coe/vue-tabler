<template>
    <div
        :style='autowrap ? `white-space: pre-wrap;` : ``'
        v-html='html'
    />
</template>

<script>
import showdown from 'showdown';

export default {
    name: 'TablerMarkdown',
    props: {
        markdown: {
            type: String,
            required: true
        },
        autowrap: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        html: function() {
            const converter = new showdown.Converter({
                tables: true,
                tasklists: true,
                emoji: true
            });
            return converter.makeHtml(this.markdown);
        }
    }
}
</script>
