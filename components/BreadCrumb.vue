<template>
<ol class="breadcrumb" aria-label="breadcrumbs">
    <li class="breadcrumb-item"><a @click='$router.push("/")' class='cursor-pointer'>Home</a></li>
    <li
        :key='crumb_it'
        v-for='(crumb, crumb_it) in crumbs'
        class="breadcrumb-item"
        :class='{
            "active": crumb_it === crumbs.length - 1
        }'
    >
        <a v-if='crumb_it === crumbs.length - 1' v-text='crumb'></a>
        <a v-else @click='$router.push("/" + crumbs.splice(0, crumb_it + 1).join("/").toLowerCase())' class='cursor-pointer' v-text='crumb'></a>
    </li>
</ol>
</template>

<script>
export default {
    name: 'BreadCrumb',
    data: function() {
        return {
            crumbs: this.$route.path.split('/').filter((crumb) => {
                return crumb.length;
            }).map((crumb) => {
                return `${crumb[0].toUpperCase()}${crumb.slice(1, crumb.length)}`;
            })
        }
    },
}
</script>
