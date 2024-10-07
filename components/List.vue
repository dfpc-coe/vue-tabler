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

<script>
import TablerInput from './input/Input.vue';
import {
    IconSettings
} from '@tabler/icons-vue';

export default {
    name: 'TablerList',
    components: {
        IconSettings,
        TablerInput
    },
    props: {
        url: String,
        listkey: String,
        namekey: String,
        initial: Object,
        label: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 10
        },
    },
    emits: [
        'selected'
    ],
    data: function() {
        return {
            ele: null,
            isMounted: false,
            filter: '',
            list: {}
        }
    },
    computed: {
        buttonHeight() {
            if(!this.isMounted) return 100;
            const buttonDOM = this.$refs.button
            return buttonDOM ? buttonDOM.offsetWidth : 100;
        },
    },
    watch: {
        ele: function() {
            this.filter = '';
        },
        filter: async function() {
            await this.fetchList();
        }
    },
    mounted: async function() {
        if (this.initial && this.initial[this.namekey]) this.ele = this.initial;
        await this.fetchList();
        this.isMounted = true;
    },
    methods: {
        select: function(ele) {
            this.ele = ele;
            this.filter = ele[this.namekey];
            this.$emit("selected", ele)
        },
        fetchList: async function() {
            const url = window.stdurl(this.url);
            url.searchParams.append('filter', this.filter);
            url.searchParams.append('limit', this.limit);
            this.list = await window.std(url);
        }
    }
}
</script>
