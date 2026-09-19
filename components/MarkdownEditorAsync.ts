import { defineAsyncComponent } from 'vue'

/**
 * The editor pulls in ProseMirror so it is only loaded when it is first rendered,
 * keeping it out of the main bundle of every application that imports this library
 */
export const TablerMarkdownEditor = defineAsyncComponent(() => import('./MarkdownEditor.vue'))
