<template>
<div class="dropdown">
    <label class='form-label' v-text='label'></label>
    <div type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <TablerInput :disabled='disabled' placeholder='Name' v-model='filter'/>
    </div>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <div class='m-1'>
            <div @click='select(ele)' :key='ele.id' v-for='ele in list[listkey]'>
                <div class="d-flex align-items-center my-1 cursor-pointer" v-text='ele[namekey]'></div>
            </div>
        </div>
    </ul>
</div>
</template>

<script>
import TablerInput from './Input.vue';

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
            filter: '',
            list: {}
        }
    },
    watch: {
        filter: async function() {
            await this.fetchList();
        }
    },
    mounted: async function() {
        if (this.initial && this.initial[this.namekey]) this.filter = this.initial[this.namekey];
        await this.fetchList();
    },
    methods: {
        select: function(ele) {
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
        TablerInput
    }
}
</script>
