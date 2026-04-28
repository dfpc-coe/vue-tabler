import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Markdown from '../components/Markdown.vue'

describe('TablerMarkdown', () => {
    it('renders markdown and basic HTML', () => {
        const wrapper = mount(Markdown, {
            props: {
                markdown: '# Title\n\n<div class="note">Allowed HTML</div>'
            }
        })

        expect(wrapper.html()).toContain('<h1>Title</h1>')
        expect(wrapper.html()).toContain('<div class="note">Allowed HTML</div>')
    })

    it('sanitizes unsafe HTML before rendering', () => {
        const wrapper = mount(Markdown, {
            props: {
                markdown: '<img src="x" onerror="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)">bad</a>'
            }
        })

        expect(wrapper.html()).toContain('<img src="x">')
        expect(wrapper.html()).toContain('<a>bad</a>')
        expect(wrapper.html()).not.toContain('onerror')
        expect(wrapper.html()).not.toContain('<script>')
        expect(wrapper.html()).not.toContain('javascript:')
    })
})
