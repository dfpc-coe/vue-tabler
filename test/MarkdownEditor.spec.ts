import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Editor } from '@tiptap/core'
import MarkdownEditor from '../components/MarkdownEditor.vue'
import Markdown from '../components/Markdown.vue'
import { markdownExtensions, tidyMarkdown } from '../components/internal/markdown-editor'

// jsdom has no layout - ProseMirror measures the selection to scroll it into view on focus
const rects = () => [] as unknown as DOMRectList
Range.prototype.getClientRects = rects
Range.prototype.getBoundingClientRect = () => new DOMRect()
Element.prototype.getClientRects = rects
Element.prototype.scrollIntoView = () => undefined

const TABLE = [
    '**Groups:** EN31',
    '',
    '| Time | Author | Note |',
    '| --- | --- | --- |',
    '| 13:21:10 | jdoe | GATE CODE 12\\|34 |',
    '| 13:21:23 | jdoe | NOT FEELING SICK |'
].join('\n')

function roundtrip(markdown: string): string {
    const editor = new Editor({ extensions: markdownExtensions(), content: markdown, contentType: 'markdown' })
    const out = tidyMarkdown(editor.getMarkdown())
    editor.destroy()
    return out
}

function cells(markdown: string): string[] {
    const wrapper = mount(Markdown, { props: { markdown } })
    return wrapper.findAll('th, td').map((cell) => cell.text())
}

describe('Markdown serialization', () => {
    it('leaves plain text as it was written', () => {
        const text = 'Missing Hunter Love Mesa\n\n1049  Kenny & Nick responding, BP > 140 & HR < 50\nsecond line for unit_one'

        expect(roundtrip(text)).toBe(text)
    })

    it('keeps a bare URL bare', () => {
        expect(roundtrip('see https://example.com/a_b?c=1&d=2 now')).toBe('see https://example.com/a_b?c=1&d=2 now')
    })

    it('keeps escapes & entities that change how the text is parsed', () => {
        expect(roundtrip('a \\*literal\\* star')).toBe('a \\*literal\\* star')
        expect(roundtrip('a &lt;b&gt; tag')).toBe('a &lt;b> tag')
        expect(roundtrip('an &amp;amp; entity')).toBe('an &amp;amp; entity')
        expect(roundtrip('&gt; not a quote')).toBe('&gt; not a quote')
    })

    it('renders a table the same after a round trip', () => {
        const out = roundtrip(TABLE)

        expect(out).not.toMatch(/\n{3,}/)
        expect(cells(out)).toEqual(cells(TABLE))
        expect(cells(out)).toContain('GATE CODE 12|34')
    })

    it('does not touch the contents of code', () => {
        const text = 'inline `a &amp; b\\_c`\n\n```\nfenced &amp; code\n\n\n\nkept\n```'

        expect(roundtrip(text)).toBe(text)
    })
})

// Tiptap debounces the reactive editor state that the toolbar renders from over two frames
async function frames(): Promise<void> {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    await flushPromises()
}

describe('TablerMarkdownEditor', () => {
    async function mountEditor(modelValue: string) {
        const wrapper = mount(MarkdownEditor, { props: { modelValue }, attachTo: document.body })
        await flushPromises()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const editor = (wrapper.vm as any).editor as Editor
        return { wrapper, editor }
    }

    it('renders the Markdown with the classes of the viewer', async () => {
        const { wrapper } = await mountEditor(TABLE)

        const content = wrapper.find('.ProseMirror')
        expect(content.classes()).toContain('tabler-markdown')
        expect(content.classes()).toContain('tabler-markdown--breaks')
        expect(content.findAll('th').map((th) => th.text())).toEqual(['Time', 'Author', 'Note'])

        wrapper.unmount()
    })

    it('does not emit when it is opened', async () => {
        const { wrapper } = await mountEditor(TABLE)

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        wrapper.unmount()
    })

    it('emits tidy Markdown on an edit & the original Markdown when the edit is undone', async () => {
        const { wrapper, editor } = await mountEditor(TABLE)

        let cell = 0
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'tableCell') cell = pos
        })

        // The end of the text in the last cell
        editor.chain().focus(cell + editor.state.doc.nodeAt(cell)!.nodeSize - 2).insertContent(' & MORE').run()

        const edits = wrapper.emitted('update:modelValue') as string[][]
        expect(edits).toHaveLength(1)
        expect(edits[0][0]).toContain('NOT FEELING SICK & MORE')
        expect(edits[0][0]).toContain('GATE CODE 12\\|34')

        editor.commands.undo()

        expect(edits).toHaveLength(2)
        expect(edits[1][0]).toBe(TABLE)

        wrapper.unmount()
    })

    it('loads a new value without emitting it back', async () => {
        const { wrapper, editor } = await mountEditor('first')

        await wrapper.setProps({ modelValue: 'second **value**' })

        expect(editor.getText()).toBe('second value')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        wrapper.unmount()
    })

    it('shows table actions only inside of a table', async () => {
        const { wrapper, editor } = await mountEditor('text\n\n| A | B |\n| --- | --- |\n| 1 | 2 |')

        editor.commands.focus('start')
        await frames()
        expect(wrapper.find('[title="Insert Table"]').exists()).toBe(true)
        expect(wrapper.find('[title="Add Row"]').exists()).toBe(false)

        let cell = 0
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'tableCell') cell = pos
        })

        editor.commands.focus(cell + 2)
        await frames()
        expect(wrapper.find('[title="Add Row"]').exists()).toBe(true)

        await wrapper.find('[title="Add Row"]').trigger('click')
        expect(editor.getHTML().match(/<tr>/g)).toHaveLength(3)

        wrapper.unmount()
    })

    it('submits the current Markdown with Ctrl+Enter', async () => {
        const { wrapper, editor } = await mountEditor('first')

        editor.chain().focus('end').insertContent(' note').run()
        editor.view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }))

        expect(wrapper.emitted('submit')).toEqual([['first note']])

        wrapper.unmount()
    })
})
