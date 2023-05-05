<template>
<div :class='{
    "w-full": !inline,
    "d-flex": inline
}'>
    <template v-if='inline'>
        <div class='d-flex'>
            <div class="spinner-border" role="status"></div>
            <div v-if='desc && desc.length' class='mx-3 align-self-center' v-text='desc'></div>
        </div>
    </template>
    <template v-else>
        <div class='d-flex justify-content-center my-4'>
            <div class="spinner-border" role="status"></div>
        </div>

        <template v-if='desc && desc.length'>
            <div class='d-flex justify-content-center my-4'>
                <div class='' v-text='desc'></div>
            </div>
        </template>
    </template>
</div>
</template>

<script>
export default {
    name: 'TablerLoading',
    props: {
        inline: {
            type: Boolean,
            default: false
        },
        desc: {
            type: String,
            default: 'Loading...'
        }
    }
}
</script>
