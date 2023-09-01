<template>
<div class='card-body'>
    <div class='d-flex justify-content-center' :class='{
        "mt-4 mb-2": !compact
    }'>
        <NotesOffIcon v-if='compact' width='32' height='32' />
        <NotesOffIcon v-else width='48' height='48' />
    </div>

    <div class='text-center' :class='{
        "mb-4 mt-2": !compact
    }'>
        <div>No <span v-text='label'/></div>
    </div>

    <div v-if='create' @click='$emit("create")' class='d-flex justify-content-center my-4' :class='{
        "my-4": !compact
    }'>
        <div class='btn btn-primary'><span>Create <span v-text='label'/></span></div>
    </div>
</div>
</template>

<script>
import {
    NotesOffIcon
} from 'vue-tabler-icons'

export default {
    name: 'TablerNone',
    props: {
        label: {
            type: String,
            default: 'Items'
        },
        compact: {
            type: Boolean,
            default: false
        },
        create: {
            type: Boolean,
            default: true
        },
    },
    components: {
        NotesOffIcon
    }
}
</script>
