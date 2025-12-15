# Vue Tabler

<p align="center">
  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/vue-3.x-brightgreen.svg" alt="Vue 3">
  </a>
  <a href="https://www.npmjs.com/package/@tak-ps/vue-tabler">
    <img src="https://img.shields.io/npm/v/@tak-ps/vue-tabler.svg" alt="npm version">
  </a>
  <a href="https://github.com/tak-ps/vue-tabler/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@tak-ps/vue-tabler.svg" alt="License">
  </a>
</p>

<p align="center">
  <strong>A comprehensive collection of Vue 3 components based on the Tabler UI kit.</strong>
</p>

---

## 🚀 Introduction

`@tak-ps/vue-tabler` brings the beautiful and responsive [Tabler](https://tabler.io/) UI kit to your Vue 3 applications. It provides a set of reusable, high-quality components designed to speed up your development process while maintaining a clean and professional look.

## 📦 Installation

Install the package using npm:

```bash
npm install @tak-ps/vue-tabler
```

## 💻 Usage

Import the components you need directly into your Vue files. All components are exported with a `Tabler` prefix to avoid conflicts.

```vue
<script setup>
import { TablerButton, TablerAlert } from '@tak-ps/vue-tabler';
</script>

<template>
  <TablerAlert title="Success!" variant="success">
    Your operation was completed successfully.
  </TablerAlert>

  <TablerButton variant="primary" @click="doSomething">
    Click Me
  </TablerButton>
</template>
```

## 🧩 Components

### Core Components
| Component | Description |
|-----------|-------------|
| **TablerAlert** | Display important messages and feedback. |
| **TablerBreadCrumb** | Navigation aid indicating the current page's location. |
| **TablerButton** | Standard action buttons with various styles. |
| **TablerBytes** | Utility to format byte values into human-readable strings. |
| **TablerDelete** | Specialized button/action for delete operations. |
| **TablerDropdown** | Toggleable menus for actions or navigation. |
| **TablerEpoch** | Display formatted dates and times. |
| **TablerEpochRange** | Display a range of dates/times. |
| **TablerError** | Standardized error message display. |
| **TablerHelp** | Tooltips or help text for user guidance. |
| **TablerIconButton** | Buttons designed to contain icons. |
| **TablerInlineAlert** | Contextual alerts for inline feedback. |
| **TablerList** | Display data in list format. |
| **TablerLoading** | Loading indicators and spinners. |
| **TablerMarkdown** | Render markdown content safely. |
| **TablerModal** | Dialog boxes for user interaction. |
| **TablerNone** | Placeholder component for empty states. |
| **TablerPager** | Pagination controls for lists and tables. |
| **TablerProgress** | Progress bars to indicate status. |
| **TablerRefreshButton** | A dedicated button for refresh actions. |
| **TablerSchema** | Visualization for data schemas. |
| **TablerSlidedown** | Expandable/collapsible content areas. |

### Input Components
| Component | Description |
|-----------|-------------|
| **TablerColour** | Color picker input. |
| **TablerEnum** | Selection input for enumerated values. |
| **TablerFileInput** | File upload input. |
| **TablerInput** | Standard text and data input fields. |
| **TablerRange** | Range slider input. |
| **TablerSelect** | Dropdown selection input. |
| **TablerTimeZone** | Timezone selector. |
| **TablerToggle** | Switch/Toggle control. |

## 🛠️ Dependencies

This library relies on the following core dependencies:
- [Vue 3](https://vuejs.org/)
- [@tabler/icons-vue](https://www.npmjs.com/package/@tabler/icons-vue)
- [showdown](https://www.npmjs.com/package/showdown) (for Markdown rendering)

## 📄 License

This project is licensed under the [ISC License](LICENSE).
