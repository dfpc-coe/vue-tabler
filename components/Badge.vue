<template>
    <span
        class='badge tabler-badge'
        :style='badgeStyle'
    >
        <slot />
    </span>
</template>

<script setup lang='ts'>
import { computed } from 'vue';

export interface BadgeProps {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

const props = withDefaults(defineProps<BadgeProps>(), {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: undefined,
    textColor: '#ffffff',
});

type ParsedColor = {
    red: number;
    green: number;
    blue: number;
    alpha?: number;
};

const HEX_COLOR = /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const RGB_COLOR = /^rgba?\(([^)]+)\)$/i;

function clampChannel(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)));
}

function clampAlpha(value: number): number {
    return Math.max(0, Math.min(1, value));
}

function parseHexColor(value: string): ParsedColor | null {
    const match = value.match(HEX_COLOR);
    if (!match) return null;

    const hex = match[1];

    if (hex.length === 3 || hex.length === 4) {
        const red = Number.parseInt(`${hex[0]}${hex[0]}`, 16);
        const green = Number.parseInt(`${hex[1]}${hex[1]}`, 16);
        const blue = Number.parseInt(`${hex[2]}${hex[2]}`, 16);
        const alpha = hex.length === 4
            ? clampAlpha(Number.parseInt(`${hex[3]}${hex[3]}`, 16) / 255)
            : undefined;

        return { red, green, blue, alpha };
    }

    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);
    const alpha = hex.length === 8
        ? clampAlpha(Number.parseInt(hex.slice(6, 8), 16) / 255)
        : undefined;

    return { red, green, blue, alpha };
}

function parseRgbColor(value: string): ParsedColor | null {
    const match = value.match(RGB_COLOR);
    if (!match) return null;

    const parts = match[1].split(',').map((part) => part.trim());
    if (parts.length < 3 || parts.length > 4) return null;

    const red = Number(parts[0]);
    const green = Number(parts[1]);
    const blue = Number(parts[2]);
    const alpha = parts[3] === undefined ? undefined : Number(parts[3]);

    if ([red, green, blue, alpha].some((part) => part !== undefined && Number.isNaN(part))) {
        return null;
    }

    return {
        red: clampChannel(red),
        green: clampChannel(green),
        blue: clampChannel(blue),
        alpha: alpha === undefined ? undefined : clampAlpha(alpha),
    };
}

function parseColor(value: string): ParsedColor | null {
    return parseHexColor(value) || parseRgbColor(value);
}

function darkenColor(value: string, amount = 0.2): string {
    const parsed = parseColor(value);
    if (!parsed) return value;

    const factor = 1 - amount;
    const next = {
        red: clampChannel(parsed.red * factor),
        green: clampChannel(parsed.green * factor),
        blue: clampChannel(parsed.blue * factor),
        alpha: parsed.alpha,
    };

    if (next.alpha === undefined) {
        return `rgb(${next.red}, ${next.green}, ${next.blue})`;
    }

    return `rgba(${next.red}, ${next.green}, ${next.blue}, ${next.alpha})`;
}

const resolvedBorderColor = computed(() => {
    if (props.borderColor) return props.borderColor;
    return darkenColor(props.backgroundColor, 0.2);
});

const badgeStyle = computed(() => {
    return {
        backgroundColor: props.backgroundColor,
        borderColor: resolvedBorderColor.value,
        color: props.textColor,
    };
});
</script>

<style scoped>
.tabler-badge {
    border-style: solid;
    border-width: 1px;
}
</style>
