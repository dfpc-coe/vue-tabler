<template>
    <div class='pagination m-0'>
        <div>
            <template v-if='pageCount <= 1' />
            <template v-else>
                <button
                    type='button'
                    class='btn mx-1'
                    :class='{ "btn-primary": current === 0 }'
                    :disabled='current === 0'
                    aria-label='Go to first page'
                    @click='changePage(0)'
                >
                    <IconHome
                        :size='32'
                        stroke='1'
                        class='icon'
                    />Home
                </button>

                <template v-if='showLeadingEllipsis'>
                    <span class=''> ... </span>
                </template>

                <template v-if='middle.length'>
                    <button
                        v-for='i in middle'
                        :key='i'
                        type='button'
                        class='btn mx-1'
                        :class='{ "btn-primary": current === i }'
                        :disabled='current === i'
                        :aria-current='current === i ? "page" : undefined'
                        @click='changePage(i)'
                        v-text='i + 1'
                    />
                </template>

                <template v-if='showTrailingEllipsis'>
                    <span class=''> ... </span>
                </template>
                <button
                    type='button'
                    class='btn mx-1'
                    :class='{ "btn-primary": current === pageCount - 1 }'
                    :disabled='current === pageCount - 1'
                    :aria-current='current === pageCount - 1 ? "page" : undefined'
                    @click='changePage(pageCount - 1)'
                    v-text='pageCount'
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    IconHome
} from '@tabler/icons-vue';

export interface PagerProps {
    total: number;
    page: number;
    limit: number;
}

const props = defineProps<PagerProps>();

const emit = defineEmits<{
    (e: 'page', page: number): void
}>()

const MAX_MIDDLE_PAGES = 5;

const pageCount = computed(() => {
    if (props.limit <= 0) return 0;
    return Math.ceil(props.total / props.limit);
});

const current = computed(() => {
    if (pageCount.value <= 1) return 0;

    const maxPage = pageCount.value - 1;
    const page = Number.isFinite(props.page) ? props.page : 0;

    return Math.min(Math.max(page, 0), maxPage);
});

const middleWindow = computed(() => {
    if (pageCount.value <= 2) return 0;
    return Math.min(MAX_MIDDLE_PAGES, pageCount.value - 2);
});

const middle = computed(() => {
    if (!middleWindow.value) return [];

    if (pageCount.value <= MAX_MIDDLE_PAGES + 2) {
        return Array.from({ length: middleWindow.value }, (_, index) => index + 1);
    }

    let start = Math.max(1, current.value - 3);
    let end = Math.min(pageCount.value - 2, current.value + 1);

    if (start === 1) {
        end = Math.min(pageCount.value - 2, start + middleWindow.value - 1);
    }

    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
});

const showLeadingEllipsis = computed(() => {
    return middle.value.length > 0 && middle.value[0] > 1;
});

const showTrailingEllipsis = computed(() => {
    return middle.value.length > 0 && middle.value[middle.value.length - 1] < pageCount.value - 2;
});

const changePage = (page: number) => {
    if (page === current.value) return;
    emit('page', page);
}
</script>
