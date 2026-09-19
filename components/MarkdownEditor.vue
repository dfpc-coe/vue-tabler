<template>
    <div
        class='tabler-markdown-editor rounded'
        :class='{
            "tabler-markdown-editor--focused": focused,
            "tabler-markdown-editor--disabled": props.disabled
        }'
    >
        <div
            v-if='props.toolbar && editor'
            class='tabler-markdown-editor__toolbar d-flex flex-wrap align-items-center px-1 py-1'
            role='toolbar'
            aria-label='Formatting'
        >
            <template
                v-for='(group, index) in groups'
                :key='index'
            >
                <span
                    v-if='index > 0'
                    class='tabler-markdown-editor__divider mx-1'
                />
                <button
                    v-for='action in group'
                    :key='action.title'
                    type='button'
                    class='tabler-markdown-editor__action rounded'
                    :class='{ "tabler-markdown-editor__action--active": action.active }'
                    :title='action.title'
                    :aria-label='action.title'
                    :aria-pressed='action.active'
                    :disabled='props.disabled || action.disabled'
                    @mousedown.prevent
                    @click='action.run()'
                >
                    <component
                        :is='action.icon'
                        :size='18'
                        stroke='1.5'
                    />
                </button>
            </template>
        </div>

        <EditorContent
            :editor='editor'
            class='tabler-markdown-editor__body px-2 py-2'
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import {
    IconBold,
    IconItalic,
    IconStrikethrough,
    IconCode,
    IconH2,
    IconList,
    IconListNumbers,
    IconBlockquote,
    IconTablePlus,
    IconRowInsertBottom,
    IconColumnInsertRight,
    IconRowRemove,
    IconColumnRemove,
    IconTableMinus,
    IconArrowBackUp,
    IconArrowForwardUp
} from '@tabler/icons-vue'
import { markdownExtensions, tidyMarkdown } from './internal/markdown-editor'

export interface MarkdownEditorProps {
    modelValue: string;
    label?: string;
    toolbar?: boolean;
    autofocus?: boolean;
    disabled?: boolean;
}

interface Action {
    title: string;
    icon: Component;
    run: () => void;
    active?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<MarkdownEditorProps>(), {
    label: 'Markdown Editor',
    toolbar: true,
    autofocus: false,
    disabled: false
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'submit', value: string): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
}>();

const focused = ref(false);

// The Markdown the document was loaded from & what it serializes back to. Serializing
// normalises Markdown - table padding, escapes, list markers - so a document that is
// unchanged, or has been edited back to where it started, is reported as the Markdown
// it was given. Opening the editor must never be a change on its own.
//
// Serialized Markdown is compared and not the document as the editor makes changes of
// its own that aren't content, such as keeping an empty paragraph after a closing table
let loaded = props.modelValue;
let pristine = '';
let current = props.modelValue;

const editor = useEditor({
    extensions: markdownExtensions(),
    content: props.modelValue,
    contentType: 'markdown',
    editable: !props.disabled,
    autofocus: props.autofocus ? 'end' : false,
    editorProps: {
        attributes: {
            class: 'tabler-markdown tabler-markdown--breaks',
            role: 'textbox',
            'aria-multiline': 'true',
            'aria-label': props.label
        },
        handleKeyDown: (view, event) => {
            if (event.key !== 'Enter' || !(event.metaKey || event.ctrlKey)) return false;

            emit('submit', current);
            return true;
        }
    },
    onUpdate: ({ editor }) => {
        const markdown = tidyMarkdown(editor.getMarkdown());
        current = markdown === pristine ? loaded : markdown;

        emit('update:modelValue', current);
    },
    onFocus: () => {
        focused.value = true;
        emit('focus');
    },
    onBlur: () => {
        focused.value = false;
        emit('blur');
    }
});

// Not taken in `onCreate` - it is emitted on a timer which an early edit can beat
watch(editor, (created) => {
    if (created) pristine = tidyMarkdown(created.getMarkdown());
}, { immediate: true });

watch(() => props.modelValue, (value) => {
    // The echo of a value this editor emitted
    if (!editor.value || value === current) return;

    loaded = value;
    current = value;

    editor.value.commands.setContent(value, { contentType: 'markdown', emitUpdate: false });
    pristine = tidyMarkdown(editor.value.getMarkdown());
});

watch(() => props.disabled, (disabled) => {
    editor.value?.setEditable(!disabled);
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});

const groups = computed<Action[][]>(() => {
    const e = editor.value;
    if (!e) return [];

    const chain = () => e.chain().focus();

    const res: Action[][] = [[
        { title: 'Bold', icon: IconBold, active: e.isActive('bold'), run: () => chain().toggleBold().run() },
        { title: 'Italic', icon: IconItalic, active: e.isActive('italic'), run: () => chain().toggleItalic().run() },
        { title: 'Strikethrough', icon: IconStrikethrough, active: e.isActive('strike'), run: () => chain().toggleStrike().run() },
        { title: 'Code', icon: IconCode, active: e.isActive('code'), run: () => chain().toggleCode().run() }
    ], [
        { title: 'Heading', icon: IconH2, active: e.isActive('heading', { level: 2 }), run: () => chain().toggleHeading({ level: 2 }).run() },
        { title: 'Bullet List', icon: IconList, active: e.isActive('bulletList'), run: () => chain().toggleBulletList().run() },
        { title: 'Numbered List', icon: IconListNumbers, active: e.isActive('orderedList'), run: () => chain().toggleOrderedList().run() },
        { title: 'Quote', icon: IconBlockquote, active: e.isActive('blockquote'), run: () => chain().toggleBlockquote().run() }
    ]];

    if (e.isActive('table')) {
        res.push([
            { title: 'Add Row', icon: IconRowInsertBottom, run: () => chain().addRowAfter().run() },
            { title: 'Add Column', icon: IconColumnInsertRight, run: () => chain().addColumnAfter().run() },
            { title: 'Delete Row', icon: IconRowRemove, run: () => chain().deleteRow().run() },
            { title: 'Delete Column', icon: IconColumnRemove, run: () => chain().deleteColumn().run() },
            { title: 'Delete Table', icon: IconTableMinus, run: () => chain().deleteTable().run() }
        ]);
    } else {
        res.push([
            { title: 'Insert Table', icon: IconTablePlus, run: () => chain().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run() }
        ]);
    }

    res.push([
        { title: 'Undo', icon: IconArrowBackUp, disabled: !e.can().undo(), run: () => chain().undo().run() },
        { title: 'Redo', icon: IconArrowForwardUp, disabled: !e.can().redo(), run: () => chain().redo().run() }
    ]);

    return res;
});

defineExpose({
    focus: () => editor.value?.commands.focus('end')
});
</script>

<style src='./internal/markdown.css' />

<style>
.tabler-markdown-editor {
    border: 1px solid var(--tblr-border-color);
    background-color: var(--tblr-bg-forms, transparent);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.tabler-markdown-editor--focused {
    border-color: rgba(var(--tblr-primary-rgb), 0.6);
    box-shadow: 0 0 0 0.25rem rgba(var(--tblr-primary-rgb), 0.25);
}

.tabler-markdown-editor--disabled {
    opacity: 0.65;
}

.tabler-markdown-editor__toolbar {
    gap: 2px;
    border-bottom: 1px solid var(--tblr-border-color);
}

.tabler-markdown-editor__divider {
    width: 1px;
    height: 18px;
    background-color: var(--tblr-border-color);
}

.tabler-markdown-editor__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 1px solid transparent;
    background: transparent;
    color: inherit;
    cursor: pointer;
}

.tabler-markdown-editor__action:hover:not(:disabled),
.tabler-markdown-editor__action:focus-visible {
    background-color: rgba(var(--tblr-primary-rgb), 0.12);
}

.tabler-markdown-editor__action--active {
    color: var(--tblr-primary);
    background-color: rgba(var(--tblr-primary-rgb), 0.16);
}

.tabler-markdown-editor__action:disabled {
    opacity: 0.4;
    cursor: default;
}

.tabler-markdown-editor__body .ProseMirror {
    min-height: 6rem;
    outline: none;
}

.tabler-markdown-editor__body .ProseMirror .selectedCell {
    background-color: rgba(var(--tblr-primary-rgb), 0.16);
}
</style>
