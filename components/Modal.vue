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

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

export interface ModalProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fade?: boolean;
}

withDefaults(defineProps<ModalProps>(), {
    size: 'sm',
    fade: true
});

const modal = ref<HTMLElement | null>(null)

onMounted(() => {
    nextTick(() => {
        modal.value?.focus()
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
