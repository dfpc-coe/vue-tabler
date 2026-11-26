import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UploadLogo from '../components/TablerUploadLogo.vue'

function pick(wrapper: ReturnType<typeof mount>, files: File[]) {
    const input = wrapper.find('input').element as HTMLInputElement
    Object.defineProperty(input, 'files', { value: files, configurable: true })
    return wrapper.find('input').trigger('change')
}

async function loaded(wrapper: ReturnType<typeof mount>) {
    for (let i = 0; i < 50 && !wrapper.emitted('update:modelValue'); i++) {
        await new Promise((resolve) => setTimeout(resolve, 10))
    }

    await flushPromises()
}

describe('TablerUploadLogo', () => {
    it('limits the picker to PNG and SVG on the file input itself', () => {
        const wrapper = mount(UploadLogo)
        const input = wrapper.find('input')

        expect(input.attributes('type')).toBe('file')
        expect(input.attributes('accept')).toBe('image/png, image/svg+xml')
        expect(wrapper.text()).toContain('Upload PNG/SVG Logo')
        expect(wrapper.find('img').exists()).toBe(false)
    })

    it('previews the model value and follows it', async () => {
        const wrapper = mount(UploadLogo, { props: { modelValue: 'data:image/png;base64,AAAA' } })

        expect(wrapper.find('img').attributes('src')).toBe('data:image/png;base64,AAAA')

        await wrapper.setProps({ modelValue: '' })
        expect(wrapper.find('img').exists()).toBe(false)
    })

    it('emits the file name and the file as a data URL', async () => {
        const wrapper = mount(UploadLogo)

        await pick(wrapper, [new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' })])
        await loaded(wrapper)

        expect(wrapper.emitted('file-name')).toEqual([['logo.svg']])
        expect(String(wrapper.emitted('update:modelValue')!.at(-1)![0])).toMatch(/^data:image\/svg\+xml;base64,/)
        expect(wrapper.find('img').exists()).toBe(true)
    })

    it('rejects other file types with an error', async () => {
        const wrapper = mount(UploadLogo, { props: { modelValue: 'data:image/png;base64,AAAA' } })

        await pick(wrapper, [new File(['x'], 'notes.txt', { type: 'text/plain' })])
        await flushPromises()

        expect(wrapper.find('.invalid-feedback').text()).toBe('Please upload a PNG or SVG file.')
        expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    })

    it('ignores a cancelled picker', async () => {
        const wrapper = mount(UploadLogo)

        await pick(wrapper, [])
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.emitted('file-name')).toBeUndefined()
    })
})
