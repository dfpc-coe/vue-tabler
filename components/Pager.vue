<template>
    <div class='pagination m-0'>
        <div>
            <template v-if='parseInt(total) <= parseInt(limit)'>
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

                <template v-if='parseInt(total) / parseInt(limit) > 2'>
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

<script>
import {
    IconHome
} from '@tabler/icons-vue';

export default {
    name: 'TablerPager',
    components: {
        IconHome
    },
    props: {
        total: {
            type: Number
        },
        page: {
            type: Number
        },
        limit: {
            type: Number
        }
    },
    emits: [
        'page'
    ],
    data: function() {
        return this.create();
    },
    watch: {
        page: function() {
            this.current = this.page;
        },
        total: function() {
            const set = this.create();

            this.spread = set.spread;
            this.middle = set.middle;
            this.current = set.current;
            this.end = set.end;
        },
        limit: function() {
            const set = this.create();

            this.spread = set.spread;
            this.middle = set.middle;
            this.current = set.current;
            this.end = set.end;
        },
        current: function() {
            if (this.end < 5) return; // All buttons are shown already

            let start;
            if (this.current <= 3) {
                start = 0;
            } else if (this.current >= this.end - 4) {
                start = this.end - this.spread - 2;
            } else {
                start = this.current - 3;
            }

            this.middle = this.middle.map((ele, i) => {
                return start + i + 1;
            });
        }
    },
    methods: {
        create: function() {
            const end = Math.ceil(parseInt(this.total) / parseInt(this.limit));
            let spread; //Number of pages in between home button and last page
            if (end <= 2) {
                spread = 0;
            } else if (end >= 7) {
                spread = 5;
            } else {
                spread = end - 2;
            }

            // Array containing middle page number
            let middleAr = new Array(spread).fill(1, 0, spread).map((ele, i) => {
                return 1 + i;
            });

            return {
                spread: spread,
                middle: middleAr,
                current: this.page || 0,
                end: end
            };
        },
        changePage: function(page) {
            this.current = page;
            this.$emit('page', this.current);
        }
    }
}
</script>
