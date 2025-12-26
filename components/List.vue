<template>
    <div class='dropdown'>
        <label
            v-if='label'
            class='form-label'
            :class='{
                "required": required
            }'
            v-text='label'
        />
        <div
            id='list-menu-button'
            ref='button'
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
            class='border rounded'
            style='height: 36px;'
        >
            <div class='d-flex mx-2'>
                <span
                    v-if='ele'
                    style='padding-top: 6px;'
                    v-text='ele[namekey]'
                />
                <span
                    v-else
                    style='padding-top: 6px;'
                >Select <span v-text='label' /></span>

                <div class='ms-auto'>
                    <IconSettings
                        :size='32'
                        :stroke='1'
                        style='margin-top: 4px;'
                    />
                </div>
            </div>
        </div>
        <ul
            class='dropdown-menu'
            aria-labelledby='list-menu-button'
            :style='{
                "width": `${buttonHeight}px`
            }'
        >
            <div class='m-1'>
                <TablerInput
                    v-model='filter'
                    :disabled='disabled'
                    placeholder='Name'
                />
                <div
                    v-for='ele in list[listkey]'
                    :key='ele.id'
                    @click='select(ele)'
                >
                    <div
                        class='d-flex align-items-center my-1 cursor-pointer'
                        v-text='ele[namekey]'
                    />
                </div>
            </div>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import TablerInput from './input/Input.vue';
import {
    IconSettings
} from '@tabler/icons-vue';

export interface ListProps {
    url?: string;
    listkey?: string;
    namekey?: string;
    initial?: Record<string, any>;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    limit?: number;
}

const props = withDefaults(defineProps<ListProps>(), {
    label: '',
    required: false,
    disabled: false,
    limit: 10
});

const emit = defineEmits<{
    (e: 'selected', ele: any): void
}>()

const ele = ref<any>(null)
const isMounted = ref(false)
const filter = ref('')
const list = ref<any>({})
const button = ref<HTMLElement | null>(null)

const buttonHeight = computed(() => {
    if(!isMounted.value) return 100;
    const buttonDOM = button.value
    return buttonDOM ? buttonDOM.offsetWidth : 100;
})

const select = (selectedEle: any) => {
    ele.value = selectedEle;
    if (props.namekey) {
        filter.value = selectedEle[props.namekey];
    }
    emit("selected", selectedEle)
}

const fetchList = async () => {
    if (!props.url) return;
    // @ts-ignore
    const url = window.stdurl(props.url);
    url.searchParams.append('filter', filter.value);
    url.searchParams.append('limit', String(props.limit));
    // @ts-ignore
    list.value = await window.std(url);
}

// Watchers
watch(ele, () => {
    filter.value = '';
})

watch(filter, async () => {
    await fetchList();
})

// Mounted lifecycle
onMounted(async () => {
    if (props.initial && props.namekey && props.initial[props.namekey]) ele.value = props.initial;
    await fetchList();
    isMounted.value = true;
})
</script>
