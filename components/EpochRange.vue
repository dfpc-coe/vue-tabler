<template>
    <span v-text='display'/>
</template>

<script>
export default {
    name: 'EpochRange',
    props: {
        start: {
            type: Number,
            required: true
        },
        end: {
            type: Number,
            required: true
        },
    },
    computed: {
        display: function() {
            const start = new Date(this.start)
            const end = new Date(this.end)

            const start_dt = start.toISOString().replace(/[A-Z].*/, '');
            const end_dt = end.toISOString().replace(/[A-Z].*/, '');
            if (start_dt === end_dt) {
                return `${start.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')} - ${end.toISOString().replace(/^.*?[A-Z]/, '').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')}`;
            } else {
                return `${start.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')} - ${end.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')}`;
            }
        }
    }
}
</script>
