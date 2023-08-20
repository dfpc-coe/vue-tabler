<template>
    <span v-text='display'/>
</template>

<script>
export default {
    name: 'EpochRange',
    props: {
        format: {
            type: String,
            default: 'Human'
        },
        start: {
            type: Number,
            required: true
        },
        end: {
            type: Number,
            required: true
        },
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
            if (this.format === 'ISO') {
                const start = new Date(this.start)
                const end = new Date(this.end)

                const start_dt = start.toISOString().replace(/[A-Z].*/, '');
                const end_dt = end.toISOString().replace(/[A-Z].*/, '');
                if (start_dt === end_dt) {
                    return `${start.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')} - ${end.toISOString().replace(/^.*?[A-Z]/, '').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')}`;
                } else {
                    return `${start.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')} - ${end.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')}`;
                }
            } else if (this.format === 'Human') {
                const start = new Date(this.start)
                const end = new Date(this.end)

                const start_day = String(start.getUTCDate());
                const start_day_suffix = this.suffix[start_day.slice(start_day.length - 1)] || 'th';
                const end_day = String(end.getUTCDate());
                const end_day_suffix = this.suffix[end_day.slice(end_day.length - 1)] || 'th';

                const start_month = `${this.months[start.getUTCMonth()]} ${start.getUTCDate()}${start_day_suffix}`;
                const end_month = `${this.months[end.getUTCMonth()]} ${end.getUTCDate()}${end_day_suffix}`;
                const start_time = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padEnd(2, '0')}`;
                const end_time = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padEnd(2, '0')}`;

                if (start.getFullYear() === end.getFullYear() && start.getFullYear() === new Date().getFullYear()) {
                    if (start.getUTCMonth() === end.getUTCMonth() && start.getUTCDate() === end.getUTCDate()) {
                        return `${start_month} ${start_time} - ${end_time}`;
                    } else {
                        return `${start_month} ${start_time} - ${end_month} ${end_time}`;
                    }
                } else if (start.getFullYear() === end.getFullYear()) {
                    if (start.getUTCMonth() === end.getUTCMonth() && start.getUTCDate() === end.getUTCDate()) {
                        return `${start_month}, ${start.getFullYear()} ${start_time} - ${end_time}`;
                    } else {
                        return `${start_month}, ${start.getFullYear()} ${start_time} - ${end_month} ${end_time}`;
                    }
                } else {
                    return `${start_month} ${start.getFullYear()}, ${start_time} - ${end_month} ${end.getFullYear()}, ${end_time}`;
                }
            }
        }
    }
}
</script>
