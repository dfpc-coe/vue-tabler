<template>
<div class="modal modal-blur fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
            <div class="modal-content">
                <slot/>
            </div>
      </div>
</div>
</template>

<script>
export default {
    name: 'Modal',
}
</script>
