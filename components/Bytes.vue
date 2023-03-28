<template>
<span v-text='display'/>
</template>

<script>
export default {
    name: 'Bytes',
    props: {
        bytes: {
            type: Number,
            required: true
        }
    },
    computed: {
        display: function() {
             const i = this.bytes == 0 ? 0 : Math.floor(Math.log(this.bytes) / Math.log(1024));
             return (this.bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
         }
    }
}
</script>
