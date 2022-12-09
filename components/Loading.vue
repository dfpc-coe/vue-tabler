<template>
<div class='w-full'>
    <div class='d-flex justify-content-center my-4'>
        <div class="spinner-border" role="status"></div>
    </div>

    <template v-if='desc && desc.length'>
        <div class='d-flex justify-content-center my-4'>
            <div class='' v-text='desc'></div>
        </div>
    </template>
</div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        desc: {
            type: String,
            default: 'Loading...'
        }
    }
}
</script>
