<template>
    <span v-text='display' />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    date: {
        type: [Number, String],
        required: true
    },
    format: {
        type: String,
        default: 'Human'
    }
})

const suffix = {
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
    const date = new Date(props.date)

    if (props.format === 'ISO') {
        return date.toISOString()
            .replace('T', ' ')
            .replace(/:[0-9]+\.[0-9]+[A-Z]/, '')
    } else if (props.format === 'Human') {
        const day = String(date.getDate())
        let suf = suffix[day.slice(day.length - 1)] || 'th'
        if (['11', '12', '13'].includes(day)) suf = 'th'

        let res = `${months[date.getMonth()]} ${date.getDate()}${suf}`
        if (date.getFullYear() !== new Date().getFullYear()) {
            res = res + ` ${date.getFullYear()}`
        }

        res = res + `, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

        return res
    } else {
        return date.toString()
    }
})
</script>
