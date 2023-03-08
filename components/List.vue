<template>
<div class="dropdown">
    <label class='form-label' v-text='label'></label>
    <div type="button" ref='button' id="list-menu-button" data-bs-toggle="dropdown" aria-expanded="false" class='border rounded' style='height: 36px;'>
        <div class='d-flex mx-2'>
            <span v-if='ele' style='padding-top: 6px;' v-text='ele[namekey]'/>
            <span v-else style='padding-top: 6px;'>Select <span v-text='label'/></span>

            <div class='ms-auto'>
                <SettingsIcon style='margin-top: 4px;'/>
            </div>
        </div>
    </div>
    <ul class="dropdown-menu" aria-labelledby="list-menu-button" :style='{
            "width": `${buttonHeight}px`
        }'>
        <div class='m-1'>
            <TablerInput :disabled='disabled' placeholder='Name' v-model='filter'/>
            <div @click='select(ele)' :key='ele.id' v-for='ele in list[listkey]'>
                <div class="d-flex align-items-center my-1 cursor-pointer" v-text='ele[namekey]'></div>
            </div>
        </div>
    </ul>
</div>
</template>

<script>
import TablerInput from './Input.vue';
import {
    SettingsIcon
} from 'vue-tabler-icons';

export default {
    name: 'TablerList',
    props: {
        url: String,
        listkey: String,
        namekey: String,
        initial: Object,
        label: {
            type: String,
            default: ''
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
    data: function() {
        return {
            ele: null,
            isMounted: false,
            filter: '',
            list: {}
        }
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
    computed: {
        buttonHeight() {
            if(!this.isMounted) return 100;
            const buttonDOM = this.$refs.button
            console.error(buttonDOM);
            return buttonDOM ? buttonDOM.offsetWidth : 100;
        },
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
    },
    components: {
        SettingsIcon,
        TablerInput
    }
}
</script>
