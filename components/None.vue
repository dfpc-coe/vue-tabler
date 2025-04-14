<template>
    <div class='card-body'>
        <div
            class='d-flex justify-content-center'
            :class='{
                "mt-4 mb-2": !compact
            }'
        >
            <IconNotesOff
                v-if='compact'
                :size='32'
                :stroke='1'
            />
            <IconNotesOff
                v-else
                :size='48'
                :stroke='1'
            />
        </div>

        <div
            class='text-center'
            :class='{
                "mb-4 mt-2": !compact
            }'
        >
            <div class='user-select-none'>
                No <span v-text='label' />
            </div>
        </div>

        <div
            v-if='create'
            class='d-flex justify-content-center my-4'
            :class='{
                "my-4": !compact
            }'
            @click='$emit("create")'
        >
            <div class='btn btn-primary'>
                <span>Create <span v-text='label' /></span>
            </div>
        </div>
    </div>
</template>

<script>
import {
    IconNotesOff
} from '@tabler/icons-vue'

export default {
    name: 'TablerNone',
    components: {
        IconNotesOff
    },
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
    emits: [
        'create'
    ]
}
</script>
