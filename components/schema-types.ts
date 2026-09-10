import type { Component } from 'vue';
import {
    IconDecimal,
    IconSort09,
    IconSelector,
    IconListCheck,
    IconToggleLeft,
    IconAlphabetLatin,
} from '@tabler/icons-vue';

export interface SchemaTypeOption {
    /** Human readable name shown in the builder */
    label: string;
    icon: Component;
    /** JSON Schema type the option produces */
    type: string;
    /** Option produces a string constrained to an enum */
    enum?: boolean;
    /** Option produces an array of strings constrained to an enum */
    multiple?: boolean;
}

export const SCHEMA_TYPES: SchemaTypeOption[] = [
    { label: 'Text', icon: IconAlphabetLatin, type: 'string' },
    { label: 'Dropdown', icon: IconSelector, type: 'string', enum: true },
    { label: 'Multiple Choice', icon: IconListCheck, type: 'array', multiple: true },
    { label: 'Toggle', icon: IconToggleLeft, type: 'boolean' },
    { label: 'Number', icon: IconDecimal, type: 'number' },
    { label: 'Whole Number', icon: IconSort09, type: 'integer' },
];

/** A schema element whose value is one of a fixed set of options */
export function isEnum(prop: { enum?: unknown }): boolean {
    return Array.isArray(prop.enum);
}

/** A schema element whose value is any number of a fixed set of options */
export function isMultiEnum(prop: { type?: unknown; items?: unknown }): boolean {
    return prop.type === 'array'
        && typeof prop.items === 'object'
        && prop.items !== null
        && isEnum(prop.items as { enum?: unknown });
}

/**
 * The option values a Dropdown or Multiple Choice element allows - the array
 * is the live one on the element so it can be edited in place
 */
export function enumValues(prop: { type?: unknown; enum?: unknown; items?: unknown }): string[] | undefined {
    if (isEnum(prop)) return prop.enum as string[];
    if (isMultiEnum(prop)) return (prop.items as { enum: string[] }).enum;
    return undefined;
}

/** The JSON Schema element a builder option creates */
export function schemaTemplate(option: SchemaTypeOption): Record<string, unknown> {
    if (option.multiple) {
        return {
            type: 'array',
            uniqueItems: true,
            items: { type: 'string', enum: [] },
        };
    }

    if (option.enum) return { type: option.type, enum: [] };

    return { type: option.type };
}

/**
 * Resolve the builder option a schema element was created from, falling back
 * to a capitalized copy of the raw JSON Schema type for anything unrecognised
 */
export function schemaType(prop: { type: string; enum?: unknown; items?: unknown }): SchemaTypeOption {
    const multiple = isMultiEnum(prop);
    const single = !multiple && isEnum(prop);

    const match = SCHEMA_TYPES.find((option) => {
        return option.type === prop.type
            && Boolean(option.enum) === single
            && Boolean(option.multiple) === multiple;
    });

    if (match) return match;

    return {
        label: prop.type.charAt(0).toUpperCase() + prop.type.slice(1),
        icon: IconAlphabetLatin,
        type: prop.type,
    };
}
