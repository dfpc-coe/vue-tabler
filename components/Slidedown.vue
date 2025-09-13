<template>
    <div
        class="hover-expandable rounded position-relative px-2 py-2"
        :class="{ 'is-expanded': isExpanded }"
    >

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

.hover-expandable:not(.is-expanded):hover {
    border: 1px solid color-mix(in srgb, var(--tblr-border-color), white 25%);
}

.hover-expandable:not(.is-expanded):hover .arrow-container {
    border-color: var(--tblr-primary-rgb);
}

.hover-expandable:not(.is-expanded):hover .arrow {
    color: var(--tblr-secondary-color, white);
}

.expandable-content-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.arrow-container {
    border: 1px solid var(--tblr-border-color);
    border-radius: 50%;
    background-color: var(--tblr-border-color);
    color: var(--tblr-body-color);
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.arrow {
    transition: transform 0.3s ease-out, color 0.2s ease;
}

.arrow.expanded {
    transform: rotate(180deg);
}
</style>


