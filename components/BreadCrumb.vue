<template>
    <ol
        class='breadcrumb'
        aria-label='breadcrumbs'
    >
        <li class='breadcrumb-item'>
            <a
                class='cursor-pointer'
                @click='navigate("/")'
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
                v-else
                class='cursor-pointer'
                @click='navigate(resolvePath(crumb_it))'
                v-text='crumb'
            />
        </li>
    </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export interface BreadCrumbProps {
    normalize?: boolean;
}

const props = withDefaults(defineProps<BreadCrumbProps>(), {
    normalize: true
});

const router = useRouter()
const route = useRoute()

const navigate = (url: string) => {
    try {
        const resolved = router.resolve(url);
        if (resolved.matched.length > 0) {
            router.push(url);
        } else {
            window.location.href = url;
        }
    } catch (e) {
        window.location.href = url;
    }
}

const resolvePath = (index: number) => {
    const rawCrumbs = route.path.split('/').filter((c) => c.length);
    const subset = rawCrumbs.slice(0, index + 1);
    let path = '/' + subset.join('/');
    if (props.normalize) {
        path = path.toLowerCase();
    }
    return path;
}

const crumbs = computed(() => {
    return route.path.split('/').filter((crumb: string) => {
        return crumb.length
    }).map((crumb: string) => {
        if (props.normalize) {
            return `${crumb[0].toUpperCase()}${crumb.slice(1, crumb.length)}`
        } else {
            return `${crumb[0]}${crumb.slice(1, crumb.length)}`
        }
    })
})
</script>
