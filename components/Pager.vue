<template>
    <div class='pagination m-0'>
        <div>
            <template v-if='total <= limit'>
                <button
                    class='btn mx-1'
                    @click='changePage(0)'
                >
                    <IconHome
                        :size='32'
                        :stroke='1'
                        class='icon'
                    />Home
                </button>
            </template>
            <template v-else>
                <button
                    class='btn mx-1'
                    :class='{ "btn-primary": current === 0 }'
                    @click='changePage(0)'
                >
                    <IconHome
                        :size='32'
                        :stroke='1'
                        class='icon'
                    />Home
                </button>

                <template v-if='end > 5 && current > 3'>
                    <span class=''> ... </span>
                </template>

                <template v-if='total / limit > 2'>
                    <button
                        v-for='i in middle'
                        :key='i'
                        class='btn mx-1'
                        :class='{ "btn-primary": current === i }'
                        @click='changePage(i)'
                        v-text='i + 1'
                    />
                </template>

                <template v-if='end > 5 && current < end - spread'>
                    <span class=''> ... </span>
                </template>
                <button
                    class='btn mx-1'
                    :class='{ "btn-primary": current === end - 1 }'
                    @click='changePage(end - 1)'
                    v-text='end'
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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

const spread = ref(0)
const middle = ref<number[]>([])
const current = ref(0)
const end = ref(0)

const create = () => {
    const endValue = Math.ceil(props.total / props.limit);
    let spreadValue; //Number of pages in between home button and last page
    if (endValue <= 2) {
        spreadValue = 0;
    } else if (endValue >= 7) {
        spreadValue = 5;
    } else {
        spreadValue = endValue - 2;
    }

    // Array containing middle page number
    let middleAr = new Array(spreadValue).fill(1, 0, spreadValue).map((ele, i) => {
        return 1 + i;
    });

    return {
        spread: spreadValue,
        middle: middleAr,
        current: props.page || 0,
        end: endValue
    };
}

const changePage = (page: number) => {
    current.value = page;
    emit('page', current.value);
}

// Initialize values
const initialValues = create();
spread.value = initialValues.spread;
middle.value = initialValues.middle;
current.value = initialValues.current;
end.value = initialValues.end;

// Watch for page changes
watch(() => props.page, () => {
    current.value = props.page;
})

// Watch for total changes
watch(() => props.total, () => {
    const set = create();
    spread.value = set.spread;
    middle.value = set.middle;
    current.value = set.current;
    end.value = set.end;
})

// Watch for limit changes
watch(() => props.limit, () => {
    const set = create();
    spread.value = set.spread;
    middle.value = set.middle;
    current.value = set.current;
    end.value = set.end;
})

// Watch for current changes
watch(current, () => {
    if (end.value < 5) return; // All buttons are shown already

    let start: number;
    if (current.value <= 3) {
        start = 0;
    } else if (current.value >= end.value - 4) {
        start = end.value - spread.value - 2;
    } else {
        start = current.value - 3;
    }

    middle.value = middle.value.map((ele, i) => {
        return start + i + 1;
    });
})
</script>
