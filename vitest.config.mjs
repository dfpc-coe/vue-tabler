import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        include: ['test/**/*.spec.ts'],
        coverage: {
            provider: 'v8',
            include: ['components/**', 'lib.ts'],
            reporter: ['text-summary', 'lcov'],
        },
    },
})
