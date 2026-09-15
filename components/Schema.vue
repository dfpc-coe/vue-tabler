<template>
    <div class='px-2 py-2'>
        <TablerLoading v-if='loading' />
        <template v-else>
            <div
                v-for='key in visibleKeys'
                :key='key'
                class='py-2 floating-input'
            >
                <template v-if='isMultiEnum(s.properties[key])'>
                    <TablerMultiEnum
                        v-model='data[key]'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :description='s.properties[key].description || ""'
                        :options='s.properties[key].items.enum'
                    />
                </template>
                <template v-else-if='s.properties[key].enum'>
                    <TablerEnum
                        v-model='data[key]'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :description='s.properties[key].description || ""'
                        :options='s.properties[key].enum'
                        :default='s.properties[key].default'
                    />
                </template>
                <template v-else-if='s.properties[key].type === "string"'>
                    <TablerInput
                        v-model='data[key]'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :rows='data[key] ? data[key].split("\n").length : 1'
                        :description='s.properties[key].description || ""'
                    />
                </template>
                <template v-else-if='s.properties[key].type === "number" || s.properties[key].type === "integer"'>
                    <TablerInput
                        v-model='data[key]'
                        :type='s.properties[key].type'
                        :step='s.properties[key].type === "integer" ? 1 : "any"'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :description='s.properties[key].description || ""'
                    />
                </template>
                <template v-else-if='s.properties[key].type === "boolean"'>
                    <TablerToggle
                        v-model='data[key]'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :description='s.properties[key].description || ""'
                    />
                </template>
                <template v-else-if='isObjectTable(s.properties[key])'>
                    <div class='d-flex align-items-center'>
                        <label
                            class='form-label mb-0'
                            v-text='key'
                        />
                        <span
                            v-if='s.properties[key].required'
                            class='text-red mx-1'
                        >*</span>
                        <div
                            v-if='!disabled'
                            class='ms-auto d-flex'
                        >
                            <TablerIconButton
                                title='Clear Table'
                                @click='data[key].splice(0, data[key].length)'
                            >
                                <IconTrash
                                    :size='32'
                                    stroke='1'
                                />
                            </TablerIconButton>
                            <TablerIconButton
                                title='Import CSV'
                                @click='openImport(key)'
                            >
                                <IconDatabaseImport
                                    :size='32'
                                    stroke='1'
                                />
                            </TablerIconButton>
                            <TablerIconButton
                                title='Add Row'
                                @click='openRow(key)'
                            >
                                <IconPlus
                                    :size='32'
                                    stroke='1'
                                />
                            </TablerIconButton>
                        </div>
                    </div>

                    <div
                        v-if='data[key] && data[key].length'
                        class='table-responsive'
                    >
                        <table class='table table-hover card-table table-vcenter border rounded cursor-pointer'>
                            <thead>
                                <tr>
                                    <th
                                        v-for='col in columns(key)'
                                        :key='col'
                                        v-text='col'
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for='(row, i) in data[key]'
                                    :key='i'
                                    @click='openRow(key, Number(i))'
                                >
                                    <td
                                        v-for='col in columns(key)'
                                        :key='col'
                                        v-text='row[col]'
                                    />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <TablerNone
                        v-else
                        :label='key'
                        :create='!disabled'
                        @create='openRow(key)'
                    />
                </template>
                <template v-else-if='isUnion(s.properties[key])'>
                    <TablerEnum
                        :model-value='variantLabels(key)[variant[key] || 0]'
                        :label='key'
                        :disabled='disabled'
                        :required='s.properties[key].required || false'
                        :description='s.properties[key].description || ""'
                        :options='variantLabels(key)'
                        @update:model-value='selectVariant(key, $event)'
                    />

                    <div class='border rounded my-2 py-2 mx-2 px-2'>
                        <TablerSchema
                            :key='variant[key] || 0'
                            v-model='data[key]'
                            :schema='unionVariants(s.properties[key])[variant[key] || 0]'
                            :disabled='disabled'
                        />
                    </div>
                </template>
                <template v-else-if='isObject(s.properties[key])'>
                    <div class='d-flex align-items-center'>
                        <label
                            class='form-label mb-0'
                            v-text='key'
                        />
                        <span
                            v-if='s.properties[key].required'
                            class='text-red mx-1'
                        >*</span>
                    </div>

                    <div class='border rounded my-2 py-2 mx-2 px-2'>
                        <TablerSchema
                            v-model='data[key]'
                            :schema='s.properties[key]'
                            :disabled='disabled'
                        />
                    </div>
                </template>
                <template v-else-if='s.properties[key].type === "array"'>
                    <div class='d-flex'>
                        <label
                            class='form-label'
                            v-text='key'
                        />
                        <div class='ms-auto'>
                            <IconPlus
                                v-if='!disabled'
                                :size='32'
                                stroke='1'
                                class='cursor-pointer'
                                @click='push(key)'
                            />
                        </div>
                    </div>

                    <div
                        v-for='(arr, i) of data[key]'
                        :key='i'
                        class='border rounded my-2 py-2 mx-2 px-2'
                    >
                        <div class='d-flex'>
                            <div class='mx-2 my-2'>
                                Entry <span v-text='Number(i) + 1' />
                            </div>
                            <div class='ms-auto mx-2 my-2'>
                                <IconTrash
                                    v-if='!disabled'
                                    :size='32'
                                    stroke='1'
                                    class='cursor-pointer'
                                    @click='data[key].splice(i, 1)'
                                />
                            </div>
                        </div>

                        <TablerSchema
                            v-model='data[key][i]'
                            :schema='s.properties[key].items'
                            :disabled='disabled'
                        />
                    </div>
                </template>
                <template v-else>
                    <div class='row'>
                        <TablerInput
                            v-model='data[key]'
                            :label='key'
                            :rows='3'
                            :disabled='disabled'
                        />
                    </div>
                </template>
            </div>
        </template>

        <TablerModal v-if='edit.shown'>
            <button
                type='button'
                class='btn-close'
                aria-label='Close'
                @click='edit.shown = false'
            />
            <div class='modal-status bg-yellow' />
            <div class='modal-header'>
                <span class='modal-title'>Row Editor</span>
                <div class='ms-auto'>
                    <TablerDelete
                        v-if='!disabled && edit.index !== null'
                        displaytype='icon'
                        @delete='removeRow'
                    />
                </div>
            </div>
            <div class='modal-body py-4'>
                <TablerSchema
                    v-model='edit.row'
                    :schema='s.properties[edit.key].items'
                    :disabled='disabled'
                />

                <button
                    v-if='!disabled'
                    class='btn btn-primary w-100 mt-4'
                    @click='saveRow'
                >
                    Done
                </button>
            </div>
        </TablerModal>

        <TablerModal v-if='csv.shown'>
            <button
                type='button'
                class='btn-close'
                aria-label='Close'
                @click='csv.shown = false'
            />
            <div class='modal-status bg-yellow' />
            <div class='modal-header'>
                <span class='modal-title'>Import CSV</span>
            </div>
            <div class='modal-body py-4'>
                <TablerInput
                    v-model='csv.text'
                    label='CSV'
                    :rows='10'
                    :description='"Rows of " + columns(csv.key).join(", ") + " separated by commas or tabs"'
                />

                <button
                    class='btn btn-primary w-100 mt-4'
                    @click='importCSV'
                >
                    Import
                </button>
            </div>
        </TablerModal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import TablerInput from './input/Input.vue';
import TablerToggle from './input/Toggle.vue';
import TablerEnum from './input/Enum.vue';
import TablerMultiEnum from './input/MultiEnum.vue';
import TablerLoading from './Loading.vue';
import TablerModal from './Modal.vue';
import TablerDelete from './Delete.vue';
import TablerNone from './None.vue';
import TablerIconButton from './IconButton.vue';
import { isMultiEnum } from './schema-types';
import {
    IconPlus,
    IconTrash,
    IconDatabaseImport,
} from '@tabler/icons-vue';

defineOptions({ name: 'TablerSchema' });

export interface SchemaProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any;
    disabled?: boolean;
}

const props = withDefaults(defineProps<SchemaProps>(), {
    disabled: false
});

const emit = defineEmits<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: 'update:modelValue', value: any): void;
}>();

const loading = ref(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const s = ref<any>({});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = ref<any>({});

const edit = reactive<{
    shown: boolean;
    key: string;
    index: number | null;
    row: Record<string, unknown>;
}>({
    shown: false,
    key: '',
    index: null,
    row: {}
});

const csv = reactive({
    shown: false,
    key: '',
    text: ''
});

/** Selected union variant index per property key */
const variant = reactive<Record<string, number>>({});

/** Properties with a fixed const value are seeded but never rendered */
const visibleKeys = computed<string[]>(() => {
    if (!s.value.properties) return [];
    return Object.keys(s.value.properties).filter((key) => s.value.properties[key].const === undefined);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (prop: any): boolean => {
    return prop.type === 'object' && !!prop.properties;
}

/** The object members of an anyOf/oneOf, ignoring a null member used to mark a nullable value */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unionVariants = (prop: any): any[] => {
    const members = prop.oneOf || prop.anyOf;
    if (!Array.isArray(members)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return members.filter((m: any) => m && m.type !== 'null');
}

/** A choice between two or more object shapes, rendered with a variant picker */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUnion = (prop: any): boolean => {
    const variants = unionVariants(prop);
    return variants.length >= 2 && variants.every((v) => isObject(v));
}

const variantLabels = (key: string): string[] => {
    const labels: string[] = [];

    unionVariants(s.value.properties[key]).forEach((v, i) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const discriminator = Object.values(v.properties as Record<string, any>).find((p) => p.const !== undefined);
        let label = v.title || (discriminator ? String(discriminator.const) : `Option ${i + 1}`);
        if (labels.includes(label)) label = `${label} (${i + 1})`;
        labels.push(label);
    });

    return labels;
}

/** Pick the variant a stored value belongs to by discriminator, then by required keys */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const detectVariant = (prop: any, value: any): number => {
    const variants = unionVariants(prop);
    if (!value || typeof value !== 'object') return 0;

    for (let i = 0; i < variants.length; i++) {
        for (const [k, p] of Object.entries(variants[i].properties)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((p as any).const !== undefined && value[k] === (p as any).const) return i;
        }
    }

    for (let i = 0; i < variants.length; i++) {
        const required: string[] = variants[i].required || [];
        if (required.length && required.every((k) => value[k] !== undefined)) return i;
    }

    return 0;
}

/** A fresh value for a variant holding only its const properties, the nested form seeds the rest */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const seedVariant = (prop: any, index: number): Record<string, unknown> => {
    const seed: Record<string, unknown> = {};
    const v = unionVariants(prop)[index];
    if (!v) return seed;

    for (const [k, p] of Object.entries(v.properties)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((p as any).const !== undefined) seed[k] = (p as any).const;
    }

    return seed;
}

const selectVariant = (key: string, label: string) => {
    const index = variantLabels(key).indexOf(label);
    if (index === -1 || index === variant[key]) return;

    variant[key] = index;
    data.value[key] = seedVariant(s.value.properties[key], index);
}

const resolveVariants = () => {
    if (!s.value.properties) return;

    for (const key in s.value.properties) {
        const prop = s.value.properties[key];
        if (isUnion(prop)) variant[key] = detectVariant(prop, data.value[key]);
    }
}

/** An array of objects with known properties is rendered as a table with a row editor */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObjectTable = (prop: any): boolean => {
    return prop.type === 'array'
        && prop.items
        && prop.items.type === 'object'
        && !!prop.items.properties;
}

const columns = (key: string): string[] => {
    const prop = s.value.properties[key];
    if (!prop || !isObjectTable(prop)) return [];
    return Object.keys(prop.items.properties);
}

const push = (key: string) => {
    const items = props.schema.properties[key].items;

    if (!items || items.type === 'string') {
        data.value[key].push('');
    } else if (items.type === 'object') {
        data.value[key].push({});
    } else if (items.type === 'array') {
        data.value[key].push([]);
    } else if (items.type === 'boolean') {
        data.value[key].push(false);
    } else {
        data.value[key].push('');
    }
}

const openRow = (key: string, index?: number) => {
    edit.key = key;
    edit.index = index ?? null;
    edit.row = index === undefined ? {} : JSON.parse(JSON.stringify(data.value[key][index]));
    edit.shown = true;
}

const saveRow = () => {
    const row = JSON.parse(JSON.stringify(edit.row));

    if (edit.index === null) {
        data.value[edit.key].push(row);
    } else {
        data.value[edit.key][edit.index] = row;
    }

    edit.shown = false;
}

const removeRow = () => {
    if (edit.index !== null) {
        data.value[edit.key].splice(edit.index, 1);
    }

    edit.shown = false;
}

const openImport = (key: string) => {
    csv.key = key;
    csv.text = '';
    csv.shown = true;
}

const importCSV = () => {
    const headers = columns(csv.key);
    const lines = csv.text.split('\n').filter((line) => line.trim().length);
    const delimiter = lines.length && lines[0].includes(',') ? ',' : '\t';

    for (const line of lines) {
        const cells = line.split(delimiter);
        const row: Record<string, string> = {};
        for (let i = 0; i < headers.length; i++) {
            row[headers[i]] = (cells[i] ?? '').trim();
        }
        data.value[csv.key].push(row);
    }

    csv.shown = false;
}

// Watch for data changes
watch(data, () => {
    emit('update:modelValue', data.value);
}, { deep: true })

const updateSchema = () => {
    s.value = JSON.parse(JSON.stringify(props.schema));
    if (s.value.type === 'object' && s.value.properties) {
        for (const req of (s.value.required || [])) {
            if (s.value.properties[req]) s.value.properties[req].required = true;
        }
    }
}

/** Seed missing keys from the schema default, falling back to an empty value of the right shape */
const updateDataDefaults = () => {
    if (s.value.type === 'object' && s.value.properties) {
        for (const key in s.value.properties) {
            if (data.value[key] !== undefined) continue;

            const prop = s.value.properties[key];

            if (prop.const !== undefined) {
                data.value[key] = JSON.parse(JSON.stringify(prop.const));
            } else if (prop.default !== undefined) {
                data.value[key] = JSON.parse(JSON.stringify(prop.default));
            } else if (isUnion(prop)) {
                data.value[key] = seedVariant(prop, 0);
            } else if (prop.type === 'array') {
                data.value[key] = [];
            } else if (prop.type === 'boolean') {
                data.value[key] = false;
            } else if (prop.type === 'object') {
                data.value[key] = {};
            } else if (prop.type === 'number' || prop.type === 'integer') {
                continue;
            } else {
                data.value[key] = '';
            }
        }
    }
}

watch(() => props.schema, () => {
    updateSchema();
    updateDataDefaults();
    resolveVariants();
}, { deep: true });

watch(() => props.modelValue, () => {
    if (JSON.stringify(props.modelValue) !== JSON.stringify(data.value)) {
        data.value = JSON.parse(JSON.stringify(props.modelValue));
        updateDataDefaults();
        resolveVariants();
    }
}, { deep: true });

// Mounted lifecycle
onMounted(async () => {
    loading.value = true;
    data.value = JSON.parse(JSON.stringify(props.modelValue));
    updateSchema();
    updateDataDefaults();
    resolveVariants();

    loading.value = false;
})
</script>
