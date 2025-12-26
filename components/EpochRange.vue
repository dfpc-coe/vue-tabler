<template>
    <span v-text='display' />
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface EpochRangeProps {
    format?: string;
    start: number | string;
    end: number | string;
}

const props = withDefaults(defineProps<EpochRangeProps>(), {
    format: 'Human'
});

const suffix: Record<string, string> = {
    1: 'st',
    2: 'nd',
    3: 'rd'
}

const months = [
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

const display = computed(() => {
    if (props.format === 'ISO') {
        const start = new Date(props.start)
        const end = new Date(props.end)

        const start_dt = start.toISOString().replace(/[A-Z].*/, '');
        const end_dt = end.toISOString().replace(/[A-Z].*/, '');
        if (start_dt === end_dt) {
            return `${start.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')} - ${end.toISOString().replace(/^.*?[A-Z]/, '').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')}`;
        } else {
            return `${start.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')} - ${end.toISOString().replace(/[A-Z]/, ' ').replace(/:[0-9]+\.[0-9]+[A-Z]/, '')}`;
        }
    } else if (props.format === 'Human') {
        const start = new Date(props.start)
        const end = new Date(props.end)

        const start_day = String(start.getDate());
        let start_day_suffix = suffix[start_day.slice(start_day.length - 1)] || 'th';
        if (['11', '12', '13'].includes(start_day)) start_day_suffix = 'th';
        const end_day = String(end.getDate());
        let end_day_suffix = suffix[end_day.slice(end_day.length - 1)] || 'th';
        if (['11', '12', '13'].includes(end_day)) end_day_suffix = 'th';

        const start_month = `${months[start.getMonth()]} ${start.getDate()}${start_day_suffix}`;
        const end_month = `${months[end.getMonth()]} ${end.getDate()}${end_day_suffix}`;
        const start_time = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
        const end_time = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

        if (start.getFullYear() === end.getFullYear() && start.getFullYear() === new Date().getFullYear()) {
            if (start.getMonth() === end.getMonth() && start.getDate() === end.getDate()) {
                return `${start_month} ${start_time} - ${end_time}`;
            } else {
                return `${start_month} ${start_time} - ${end_month} ${end_time}`;
            }
        } else if (start.getFullYear() === end.getFullYear()) {
            if (start.getMonth() === end.getMonth() && start.getDate() === end.getDate()) {
                return `${start_month}, ${start.getFullYear()} ${start_time} - ${end_time}`;
            } else {
                return `${start_month}, ${start.getFullYear()} ${start_time} - ${end_month} ${end_time}`;
            }
        } else {
            return `${start_month} ${start.getFullYear()}, ${start_time} - ${end_month} ${end.getFullYear()}, ${end_time}`;
        }
    } else {
        return 'Invalid Format'
    }
})
</script>
