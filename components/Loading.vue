<template>
    <div
        :class='{
            "w-full": !inline,
            "d-flex": inline
        }'
    >
        <template v-if='inline'>
            <div class='d-flex'>
                <div
                    class='spinner-border'
                    role='status'
                />
                <div
                    v-if='desc && desc.length'
                    class='mx-3 align-self-center user-select-none'
                    v-text='desc'
                />
            </div>
        </template>
        <template v-else>
            <div class='d-flex justify-content-center my-4'>
                <div
                    class='spinner-border'
                    role='status'
                />
            </div>

            <template v-if='desc && desc.length'>
                <div class='d-flex justify-content-center my-4'>
                    <div
                        class='user-select-none'
                        v-text='desc'
                    />
                </div>
            </template>
        </template>
    </div>
</template>

<script setup>
defineProps({
    inline: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        default: 'Loading...'
    }
})
</script>
