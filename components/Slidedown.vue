<template>
    <div class="hover-expandable rounded position-relative px-2 py-2">

    <div class='mb-2'>
        <slot/>
    </div>

    <div class="expandable-content-wrapper" ref="contentWrapperRef">
      <div class="expandable-content-inner p-3">
        <slot name="expanded"></slot>
      </div>
    </div>

    <div class="arrow-container" @click="toggle" title="Toggle content">
        <IconChevronDown
            size="24"
            stroke="1.5"
            :style='{
                color: "var(--tblr-border-color)"
            }'
            class='arrow'
            :class="{ 'expanded': isExpanded }"
        />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    IconChevronDown
} from '@tabler/icons-vue';

const isExpanded = ref(false);

const contentWrapperRef = ref(null);

function toggle() {
  isExpanded.value = !isExpanded.value;
  const el = contentWrapperRef.value;

  if (el) {
    if (isExpanded.value) {
      el.style.maxHeight = el.scrollHeight + 'px';
    } else {
      el.style.maxHeight = null;
    }
  }
};
</script>

<style scoped>
.hover-expandable {
    border: 1px solid var(--tblr-border-color);
    transition: border-color 0.2s ease;
}

.hover-expandable:hover {
    border-color: var(--tblr-primary-rgb);

    .arrow {
        color: var(--tblr-primary-rgb);
    }
}

.expandable-content-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.arrow-container {
    background-color: var(--tblr-primary-rgb);
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.arrow.expanded {
    animation: flip 0.3s linear 1;
}

@keyframes flip {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(180deg);
    }
}
</style>

