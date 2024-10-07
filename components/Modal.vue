<template>
    <div
        class='modal modal-blur fade show'
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
</template>

<script>
export default {
    name: 'TablerModal',
    props: {
        size: {
            // sm, md, lg, xl
            type: String,
            default: 'sm'
        }
    }
}
</script>
