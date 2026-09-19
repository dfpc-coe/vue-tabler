import type { Extensions, JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Table, TableRow, TableHeader, TableCell, renderTableToMarkdown } from '@tiptap/extension-table'
import { Markdown } from '@tiptap/markdown'

// Private use character standing in for a `|` while a table is serialized
const PIPE = ''

const FENCE = /^\s*(```|~~~)/

function maskPipes(node: JSONContent): JSONContent {
    return {
        ...node,
        text: node.text === undefined ? undefined : node.text.replace(/\|/g, PIPE),
        content: node.content ? node.content.map(maskPipes) : undefined
    }
}

/**
 * The table serializer writes a `|` typed in a cell as is, which splits the cell in two the
 * next time the Markdown is parsed. It can't be escaped up front as the text serializer would
 * escape the backslash, so it is masked while the table renders and written as `\|` after
 */
const PipeSafeTable = Table.extend({
    renderMarkdown: (node, h) => {
        return renderTableToMarkdown(maskPipes(node), h).replaceAll(PIPE, '\\|')
    }
})

export function markdownExtensions(): Extensions {
    return [
        StarterKit.configure({
            // There is no Markdown for an underline - it would be lost on save
            underline: false,
            link: {
                openOnClick: false
            }
        }),
        PipeSafeTable.configure({ resizable: false }),
        TableRow,
        TableHeader,
        TableCell,
        Markdown
    ]
}

/**
 * Undo the parts of Tiptap's Markdown serialization that are only needed for HTML.
 *
 * The Markdown is also read as plain text - CoT remarks on a TAK device for instance - where
 * `Kenny &amp; Nick` or `unit\_one` is noise. An entity or escape is only removed where the
 * bare character can't be parsed as anything else, so the text renders the same either way.
 */
function tidyText(text: string, lineStart: boolean): string {
    return text
        // `&` is only an entity when it is followed by a name or number and a `;`
        .replace(/&amp;(?!#?\w+;)/g, '&')
        // `<` only opens a tag or an autolink when it is followed by one of these
        .replace(/&lt;(?![a-zA-Z/!?])/g, '<')
        // `>` is only a blockquote at the start of a line
        .replace(/&gt;/g, (match, offset: number) => {
            return lineStart && !text.slice(0, offset).trim().length ? match : '>'
        })
        // `_` inside of a word is never emphasis in GFM
        // (no lookbehind - Safari before 16.4 fails to parse the whole chunk)
        .replace(/([a-zA-Z0-9])\\_(?=[a-zA-Z0-9])/g, '$1_')
        // A bare URL is linked by GFM as is - it doesn't need to be written as [url](url)
        .replace(/\[(https?:\/\/[^\]\s]+)\]\(([^)\s]+)\)/g, (match, label: string, href: string) => {
            return label.replace(/\\([\\`*_[\]~])/g, '$1') === href ? href : match
        })
}

export function tidyMarkdown(markdown: string): string {
    const lines: string[] = []
    let fenced = false

    for (const line of markdown.split('\n')) {
        if (FENCE.test(line)) {
            fenced = !fenced
            lines.push(line)
        } else if (fenced) {
            lines.push(line)
        } else if (!line.trim().length) {
            // Blocks are separated by a single blank line
            if (lines.length && lines[lines.length - 1].length) lines.push('')
        } else {
            // Text inside of a code span is already written as is
            lines.push(line
                .split(/(`+[^`]*`+)/)
                .map((part, i) => part.startsWith('`') ? part : tidyText(part, i === 0))
                .join(''))
        }
    }

    return lines.join('\n').trim()
}
