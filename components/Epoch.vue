<template>
<span v-text='display'/>
</template>

<script>
export default {
    name: 'TablerEpoch',
    props: {
        date: {
            type: [Number, String],
            required: true
        },
        format: {
            type: String,
            default: 'Human'
        }
    },
    data: function() {
        return {
            suffix: {
                1: 'st',
                2: 'nd',
                3: 'rd'
            },
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
        }
    },
    computed: {
        display: function() {
            const date = new Date(this.date)

            if (this.format === 'ISO') {
                return date.toISOString()
                    .replace('T', ' ')
                    .replace(/:[0-9]+\.[0-9]+[A-Z]/, '');
            } else if (this.format === 'Human') {
                const day = String(date.getUTCDate());
                let suffix = this.suffix[day.slice(day.length - 1)] || 'th';
                if (['11', '12', '13'].includes(day)) suffix = 'th';

                let res = `${this.months[date.getUTCMonth()]} ${date.getUTCDate()}${suffix}`;
                if (date.getFullYear() !== new Date().getFullYear()) {
                    res + ` ${date.getFullYear()}`;
                }

                res = res + `, ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getMinutes()).padEnd(2, '0')}`;

                return res;
            } else {
                return date.toString();
            }
        }
    }
}
</script>
