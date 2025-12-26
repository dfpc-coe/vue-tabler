<template>
    <div
        class='hover-expandable rounded position-relative px-2 py-2'
        :class='{
            "expanded mb-3": isExpanded,
            "cursor-pointer": props.clickAnywhereExpand && !isExpanded
        }'
        @click='(props.clickAnywhereExpand && !isExpanded) ? toggle() : null'
    >
        <div
            :class='{
                "mb-2": props.arrow
            }'
        >
            <slot />
        </div>

        <div
            ref='contentWrapperRef'
            class='expandable-content-wrapper'
        >
            <div class='expandable-content-inner p-3'>
                <slot name='expanded' />
            </div>
        </div>

        <div
            v-if='props.arrow || isExpanded'
            class='arrow-container'
            title='Toggle content'
            @click.stop='toggle'
        >
            <IconChevronDown
                size='24'
                stroke='1.5'
                class='arrow'
                :class='{
                    "expanded": isExpanded
                }'
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IconChevronDown
} from '@tabler/icons-vue';

export interface SlidedownProps {
    arrow?: boolean;
    clickAnywhereExpand?: boolean;
}

const props = withDefaults(defineProps<SlidedownProps>(), {
    arrow: true,
    clickAnywhereExpand: false
});

const isExpanded = ref(false);

const contentWrapperRef = ref<HTMLElement | null>(null);

function toggle() {
    isExpanded.value = !isExpanded.value;

    const el = contentWrapperRef.value;

    if (el) {
        if (isExpanded.value) {
            el.style.maxHeight = el.scrollHeight + 'px';
        } else {
            el.style.maxHeight = null; // Reset to CSS default (0)
        }
    }
};
</script>

<style scoped>
.hover-expandable {
    border: 1px solid var(--tblr-border-color);
    transition: border-color 0.2s ease;
}

.hover-expandable:not(.expanded):hover {
    border: 1px solid color-mix(in srgb, var(--tblr-border-color), white 10%);
}

.hover-expandable:not(.expanded):hover .arrow-container {
    border-color: color-mix(in srgb, var(--tblr-border-color), white 25%);
}

.hover-expandable:not(.expanded):hover .arrow {
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

.arrow-container:hover {
    border-color: var(--tblr-primary-rgb) !important;
}

.arrow {
    transition: transform 0.3s ease-out, color 0.2s ease;
}

.arrow.expanded {
    transform: rotate(180deg);
}
</style>


