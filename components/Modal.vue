<template>
    <teleport to='body'>
        <Transition
            :name='fade ? "modal-fade" : ""'
            :appear='fade'
            :css='fade'
        >
            <div
                ref='modal'
                class='modal modal-blur show'
                :class='{
                    "fade": fade,
                    "modal-sheet": swipeable,
                    "modal-sheet-partial": swipeable && height < 1
                }'
                tabindex='-1'
                style='display: block;'
                :style='{ opacity }'
                aria-modal='true'
                role='dialog'
                @mousedown='pressed = $event.target'
                @click.self='clickAway'
            >
                <div
                    class='modal-dialog modal-dialog-centered'
                    role='document'
                    :class='{
                        "modal-sm": size === "sm",
                        "modal-md": size === "md",
                        "modal-lg": size === "lg",
                        "modal-xl": size === "xl",
                        "modal-dialog-sheet": swipeable,
                    }'
                >
                    <div
                        ref='content'
                        class='modal-content'
                        :style='swipeable ? { "--tblr-modal-sheet": height } : undefined'
                        @pointerdown='dragStart'
                        @pointermove='dragMove'
                        @pointerup='dragEnd'
                        @pointercancel='dragEnd'
                    >
                        <div
                            v-if='swipeable'
                            class='modal-grabber'
                            data-modal-swipe
                        />
                        <slot />
                    </div>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface ModalProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fade?: boolean;
    dismissable?: boolean;
    /**
     * Let the modal be dragged down by its grabber, or by any slotted element
     * marked `data-modal-swipe`. The height model follows the drag: a slow
     * release leaves the modal where it is, a flick carries it on to
     * `minHeight` or back to full height. Below full height the backdrop
     * blur is dropped and whatever is behind the modal can be interacted
     * with. Below `minHeight` it fades out,
     * and on release slides away before `close` is emitted.
     * Slotted content sizes itself from `--tblr-modal-sheet`
     */
    swipeable?: boolean;
    /** Smallest fraction of the full height the modal can be left at */
    minHeight?: number;
}

const props = withDefaults(defineProps<ModalProps>(), {
    size: 'sm',
    fade: true,
    dismissable: false,
    swipeable: false,
    minHeight: 0.5
});

/** Fraction of the full height a swipeable modal is shown at */
const height = defineModel<number>('height', { default: 1 })

const emit = defineEmits<{
    (e: 'close'): void
}>()

const modal = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const pressed = ref<EventTarget | null>(null)

// Ignore drags that start inside the dialog and end on the backdrop
const clickAway = () => {
    if (props.dismissable && pressed.value === modal.value) emit('close')
}

// Fraction of the full height per second above which a release counts as a flick
const FLICK_VELOCITY = 0.6
const VELOCITY_WINDOW_MS = 100
const SPRING_STIFFNESS = 300
const SPRING_DAMPING = 2 * Math.sqrt(SPRING_STIFFNESS)
// Height below which a closing modal is too faint to see, so the spring's long tail is skipped
const FADED_HEIGHT = 0.03

const opacity = computed(() => {
    if (!props.swipeable || height.value >= props.minHeight) return undefined
    return height.value / props.minHeight
})

type Sample = { time: number, height: number }

let drag: { y: number, height: number, full: number, samples: Sample[] } | undefined
let frame = 0

const dragStart = (event: PointerEvent) => {
    if (!props.swipeable || !content.value || height.value <= 0 || !(event.target instanceof Element)) return
    if (!event.target.closest('[data-modal-swipe]') || event.target.closest('button, a, input, select, textarea')) return

    cancelAnimationFrame(frame)

    drag = {
        y: event.clientY,
        height: height.value,
        full: content.value.offsetHeight / height.value,
        samples: [{ time: performance.now(), height: height.value }]
    }

    content.value.setPointerCapture(event.pointerId)
}

const dragMove = (event: PointerEvent) => {
    if (!drag || !drag.full) return

    height.value = Math.min(1, Math.max(0, drag.height - (event.clientY - drag.y) / drag.full))

    const now = performance.now()
    drag.samples.push({ time: now, height: height.value })
    while (drag.samples.length > 1 && now - drag.samples[0].time > VELOCITY_WINDOW_MS) drag.samples.shift()
}

// Fraction of the full height per second over the end of the drag, negative when moving down
const releaseVelocity = (samples: Sample[]): number => {
    const first = samples[0]
    const last = samples[samples.length - 1]
    const elapsed = performance.now() - first.time

    if (elapsed <= 0 || elapsed > VELOCITY_WINDOW_MS * 2) return 0
    return (last.height - first.height) / (elapsed / 1000)
}

const dragEnd = () => {
    if (!drag) return

    const velocity = releaseVelocity(drag.samples)
    drag = undefined

    if (velocity >= FLICK_VELOCITY) settle(1, velocity)
    else if (height.value < props.minHeight) settle(0, velocity)
    else if (velocity <= -FLICK_VELOCITY) settle(props.minHeight, velocity)
}

// Spring the height to its target, carrying over the velocity of the release
const settle = (target: number, velocity: number) => {
    let last = performance.now()

    const step = (now: number) => {
        const dt = Math.min(0.032, (now - last) / 1000)
        last = now

        velocity += (SPRING_STIFFNESS * (target - height.value) - SPRING_DAMPING * velocity) * dt
        const next = Math.min(1, Math.max(0, height.value + velocity * dt))

        const settled = Math.abs(target - next) < 0.002 && Math.abs(velocity) < 0.02
        const faded = target === 0 && next < FADED_HEIGHT
        if (settled || faded || next === target) {
            height.value = target
            if (target === 0) emit('close')
            return
        }

        height.value = next
        frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
}

onBeforeUnmount(() => cancelAnimationFrame(frame))

onMounted(() => {
    nextTick(() => {
        modal.value?.focus()
    })
})
</script>

<style scoped>
.modal-sheet {
    transition: backdrop-filter 150ms ease;
}

/* Below full height the page behind the modal is shown clearly and takes pointer events */
.modal-sheet-partial {
    -webkit-backdrop-filter: blur(0);
    backdrop-filter: blur(0);
    pointer-events: none;
}

.modal-dialog-sheet {
    align-items: flex-end;
}

.modal-grabber {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    width: 5rem;
    height: 1rem;
    transform: translateX(-50%);
    cursor: grab;
}

.modal-grabber::before {
    content: '';
    position: absolute;
    top: 0.25rem;
    left: 50%;
    width: 2.25rem;
    height: 0.25rem;
    border-radius: 0.25rem;
    background: var(--tblr-secondary-color);
    opacity: 0.5;
    transform: translateX(-50%);
}

.modal-grabber,
.modal-content :deep([data-modal-swipe]) {
    touch-action: none;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 100ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
