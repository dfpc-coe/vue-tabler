<template>
<span v-text='display'/>
</template>

<script>
export default {
    name: 'Epoch',
    props: {
        date: {
            type: Number,
            required: true
        },
        format: {
            type: String,
            default: 'ISO'
        }
    },
    computed: {
        display: function() {
            const date = new Date(this.date)
            if (this.format === 'ISO') {
                return date.toISOString()
                    .replace('T', ' ')
                    .replace(/:[0-9]+\.[0-9]+[A-Z]/, '');
            } else {
                return date.toString();
            }
        }
    }
}
</script>
