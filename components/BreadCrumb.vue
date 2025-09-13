<template>
    <ol
        class='breadcrumb'
        aria-label='breadcrumbs'
    >
        <li class='breadcrumb-item'>
            <a
                class='cursor-pointer'
                @click='router.push("/")'
            >Home</a>
        </li>
        <li
            v-for='(crumb, crumb_it) in crumbs'
            :key='crumb_it'
            class='breadcrumb-item'
            :class='{
                "active": crumb_it === crumbs.length - 1
            }'
        >
            <a
                v-if='crumb_it === crumbs.length - 1'
                v-text='crumb'
            />
            <a
                v-else-if='normalize'
                class='cursor-pointer'
                @click='router.push("/" + crumbs.splice(0, crumb_it + 1).join("/").toLowerCase())'
                v-text='crumb'
            />
            <a
                v-else
                class='cursor-pointer'
                @click='router.push("/" + crumbs.splice(0, crumb_it + 1).join("/"))'
                v-text='crumb'
            />
        </li>
    </ol>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
    normalize: {
        type: Boolean,
        default: true,
        description: 'Perform Title Casing on URL Components'
    }
})

const router = useRouter()
const route = useRoute()

const crumbs = computed(() => {
    return route.path.split('/').filter((crumb) => {
        return crumb.length
    }).map((crumb) => {
        if (props.normalize) {
            return `${crumb[0].toUpperCase()}${crumb.slice(1, crumb.length)}`
        } else {
            return `${crumb[0]}${crumb.slice(1, crumb.length)}`
        }
    })
})
</script>
