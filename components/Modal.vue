<template>
    <teleport to='body'>
        <Transition
            :name='fade ? "modal-fade" : ""'
            :appear='fade'
            :css='fade'
        >
            <div
                ref='modal'
                class='modal modal-blur show'
                :class='{ "fade": fade }'
                tabindex='-1'
                style='display: block;'
                aria-modal='true'
                role='dialog'
            >
                <div
                    class='modal-dialog modal-dialog-centered'
                    role='document'
                    :class='{
                        "modal-sm": size === "sm",
                        "modal-md": size === "md",
                        "modal-lg": size === "lg",
                        "modal-xl": size === "xl",
                    }'
                >
                    <div class='modal-content'>
                        <slot />
                    </div>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

defineProps({
    size: {
        // sm, md, lg, xl
        type: String,
        default: 'sm'
    },
    fade: {
        type: Boolean,
        default: true
    }
})

const modal = ref(null)

onMounted(() => {
    nextTick(() => {
        modal.value.focus()
    })
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 100ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
