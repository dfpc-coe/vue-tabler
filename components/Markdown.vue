<template>
<div v-html='html'></div>
</template>

<script>
import showdown from 'showdown';

export default {
    name: 'TablerMarkdown',
    props: {
        markdown: {
            type: String,
            required: true
        }
    },
    computed: {
        html: function() {
            const converter = new showdown.Converter();
            return converter.makeHtml(this.markdown);
        }
    }
}
</script>
