# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

## Version History

### v3.75.0

- :tada: Teleport `TablerModal` to body by default

### v3.74.0

- :tada: Introduce TS Linting

### v3.73.0

- :tada: Add `InlineAlert` component

### v3.72.1

- :bug: User error not committing the file

### v3.72.0

- :rocket: Add seperate File Input

### v3.71.0

- :rocket: Map Accept Value

### v3.70.0

- :rocket: Add Menu DisplayType option to TablerDelete

### v3.69.0

- :rocket: Move to dropdown for label descriptions

### v3.68.5

- :bug: Migrate to Setup for `Dropdown`

### v3.68.4

- :bug: Fix autoclose case

### v3.68.3

- :rocket: Add Bootstrap Dropdown Data

### v3.68.2

- :bug: Remove Nav Link

### v3.68.1

- :bug: Return to div

### v3.68.0

- :bug: Version Mismatch

### v3.67.1

- :bug: Disable Show by default

### v3.67.0

- :tada: Dropdown Card

### v3.66.5

- :tada: Make size configurable

### v3.66.4

- :bug: Vertical Alignment

### v3.66.3

- :rocket: Update Alignment

### v3.66.2

- :bug: Refresh Icon

### v3.66.1

- :bug: Fix props check

### v3.66.0

- :rocket: Add `ButtonIcon` component

### v3.65.0

- :rocket: Remove `ms-auto` from TablerPager top level

### v3.64.0

- :tada: Map TablerIconButton Enter actions to Click

### v3.63.0

- :rocket: Include Icon Slot

### v3.62.1

- :rocket: Update text selection on loading

### v3.62.0

- :tada: Allow custom sizes of dropdown

### v3.61.1

- :bug: Ensure Data Key exists in Schema

### v3.61.0

- :rocket: Automatically Expand TablerInput on newlines

### v3.60.2

- :rocket: Add `AutoWrap` option to Markdown

### v3.60.1

- :rocket: Manually call focus

### v3.60.0

- :rocket: Bubble up Blur Event

### v3.59.0

- :rocket: Pass `autofocus` through on input components

### v3.58.0

- :rocket: Call focus on Modal when created to allow immediate keyup intercepts

### v3.57.1

- :bug: Ensure parent click is ignored on Dropdown

### v3.57.0

- :tada: Add `TablerButton` with accessibility tags

### v3.56.2

- :bug: Pass Icon Size through in TablerDelete

### v3.56.1

- :rocket: Remove Hover On TablerIconButton

### v3.56.0

- :rocket: Add ability to hide advanced

### v3.55.3

- :bug: Dynamic loading causes vite to load all in production mode

### v3.55.2

- :bug: Switch to `setup` for IconButton

### v3.55.1

- :bug: Fix async import dep

### v3.55.0

- :rocket: Dynamic Icon Resolution

### v3.54.1

- :rocket: Use props instead for IconButton

### v3.54.0

- :tada: Sketch out new `IconButton` component

### v3.53.1

- :bug: Fix error status on Input component

### v3.53.0

- :rocket: Passthrough Autocomplete on input

### v3.52.0

- :rocket: Allow string dates in Epoch components

### v3.51.4

- :rocket: Avoid adding div when label isn't set in Enum

### v3.51.3

- :bug: Avoid overwriting `0` values

### v3.51.2

- :bug: Fix fallback order of placeholder text in textarea

### v3.51.1

- :rocket: Add `lock` and `user` icons to TablerInput

### v3.51.0

- :bug: Fix broken required (`*`) on input forms  ow that we don't use `form-label` due to it's margins

### v3.50.0

- :rocket: Show label conditionally to avoid 4px margin on top of input

### v3.49.0

- :rocket: Add ability to specify a search icon for TablerInput

### v3.48.0

- :rocket: Setup default stroke state

### v3.47.0

- :rocket: Use data function to setup Enum current state

### v3.46.0

- :rocket: Add `size` prop for delete icon size

### v3.45.1

- :bug: Placeholder should be first option on input if present

### v3.45.0

- :rocket: Add loading to delete button

### v3.44.1

- :bug: Allow alert to open

### v3.44.0

- :tada: Add `Alert` Component and update `Err` to use `Alert` internally

### v3.43.0

- :rocket: Reduce number of updates in `Input` and also declare all emits

### v3.42.0

- :bug: Use intermediary value so v-model can be used on text input

### v3.41.0

- :arrow_up: TablerInput `submit` event on `enter`

### v3.30.0

- :arrow_up: Update Latest Deps

### v3.29.4

- :rocket: Update Lint Rules

### v3.29.3

- :bug: Remove Style

### v3.29.2

- :bug: Fix Commat

### v3.29.1

- :bug: Add `soft` to wrap default

### v3.29.0

- :tada: Add `wrap` prop for input

### v3.28.0

- :tada: Only `label` is used for label

### v3.27.0

- :tada: Add stack trace to error modal

### v3.26.0

- :bug: Icon sizes became variable, explicitly fix all icon sizes

### v3.25.0

- :bug: Add `.stop.prevent` on button & icon click

### v3.24.0

- :bug: Update how `TablerRange` `update:modelValue` event is computed
- :arrow_up: Update all deps

### v3.23.1

- :bug: Fix offset from `form-label`

### v3.23.0

- :rocket: Add table, emoji, and tasklist support to Markdown Component

### v3.22.2

- :bug: Use new internal obj to avoid mutating schema

### v3.22.1

- :bug: White border on colours

### v3.22.0

- :bug: resect `required` fields in schema component

### v3.21.1

- :bug: Icon is now prefixed

### v3.21.0

- :rocket: Move to `@tabler/icons-vue` for most up-to-date icons
- :bug: Fix some small papercut warnings in `Pager` component

### v3.20.1

- :bug: `Pager` Initially set current from page

### v3.20.0

- :rocket: `Pager` Allow dynamic updates of page prop

### v3.19.0

- :bug: `Range` Fix initial state

### v3.18.0

- :rocket: `Dropdown` Take 100% of width of parent

### v3.17.8

- :bug: `TimeZone` Properly set label from value on init

### v3.17.7

- :rocket: `TimeZone` Default to No Timezone if a falsy model value is set

### v3.17.6

- :rocket: `TimeZone` Avoid external deps

### v3.17.5

- :rocket: `TimeZone` Add `No TimeZone` option

### v3.17.4

- :rocket: `TimeZone` Add disabled support

### v3.17.3

- :rocket: `TimeZone` Simpler TimeZone List

### v3.17.2

- :rocket: `TimeZone` Include desc and req. props

### v3.17.1

- :bug: `TimeZone` Export in default

### v3.17.0

- :tada: `TimeZone` Component

### v3.16.1

- :bug: `Epoch`: Fix assignmnet to constant

### v3.16.0

- :rocket: `Epoch`: Put time last in Human date format

### v3.15.0

- :rocket: Allow changing size of TablerModal

### v3.14.0

- :rocket: Use internal errorstr for handling numeric parsing

### v3.13.3

- :bug: Dynamic Type Resolution

### v3.13.2

- :arrow_up: Update Core Deps

### v3.13.1

- :bug: Fix Syntax

### v3.13.0

- :tada: Add support for `integer` type in JSON Schema

### v3.12.0

- :tada: Add support for `number` type in JSON Schema

### v3.11.2

- :bug: Syntax

### v3.11.1

- :bug: Fix component name

### v3.11.0

- :tada: Add `TablerColour` Component

### v3.10.0

- :tada: Use uniform `TablerLabel` internal class for inputs & allow slot use to the right of label

### v3.9.0

- :tada: Add `TablerRange`

### v3.8.4

- :bug: Be consistent with using UTC Hours for now

### v3.8.3

- :bug: Fix suffixes on `11th`, `12th`, `13th` because english is lawless

### v3.8.2

- :rocket: Minimize default Dropdown styling

### v3.8.1

- :bug: Fix Tabler Icon import

### v3.8.0

- :tada: Add Preliminary `Dropdown` component for modular Dropdowns

### v3.7.1

- :bug: Include missing components in `Enum` & `Toggle` comps
- :rocket: `TablerSchema`: Default to empty string for description prop
- :rocket: `TablerSchema`: Default to false for required prop

### v3.7.0

- :rocket: Include `description` and `required` to `TablerSchema` and sub components

### v3.6.0

- :rocket: Add `TablerPager` component for iterating over a list

### v3.5.0

- :rocket: Add `TablerNone` component for use when a list or property is empty

### v3.4.0

- :rocket: Add `TablerSchema` component for creating forms from basic JSON Schemas

### v3.3.0

- :rocket: Add `Human` mode (and make it the default) to `Epoch` and `EpochRange`

### v3.2.0

- :rocket: Add `required` Property to labelled components

### v3.1.3

- :bug: `Toggle`: Fix modelValue watch state
- :bug: `Enum`: Fix modelValue watch state

### v3.1.2

- :rocket: `Toggle`: Increase padding between label and toggle

### v3.1.1

- :bug: Fix display type display

### v3.1.0

- :rocket: Add display type to Delete

### v3.0.1

- :bug: Fix initial value

### v3.0.0

- :rocket: Standardize Enum Component

### v2.12.0

- :tada: Add `TablerDelete` component

### v2.11.0

- :tada: Add `TablerMarkdown` component

### v2.10.0

- :tada: Add Normalize Option to BreadCrumb component
- :bug: Move `whitespace: pre;` to text area to avoid breaking date inputs

### v2.9.0

- :bug: Add `white-space: pre;` to text area to retain newline characters

### v2.8.0

- :tada: Add Enum Component

### v2.7.0

- :tada: Add Bytes Component

### v2.6.0

- :tada: Add Epoch Component
- :tada: Add EpochRange Component

### v2.5.0

- :tada: Add BreadCrumb Component

### v2.4.0

- :bug: Numeric input should output numerics in TablerInput

### v2.3.1

- :rocket: Remove Debug Code

### v2.3.0

- :rocket: Improved List Component

### v2.2.9

- :rocket: Toggle: Centre Label

### v2.2.8

- :bug: Toggle: Set initial value

### v2.2.7

- :bug: Toggle: Should expect boolean value for modelValue

### v2.2.6

- :tada: Bump GH Actions

### v2.2.5

- :tada: Add GH AutoReleaser

### v2.2.4

- :bug: TablerList: Async Call

### v2.2.3

- :bug: TablerList: Prepopulate list

### v2.2.2

- :bug: TablerList: Only update filter if namekey is present

### v2.2.1

- :tada: Add initial value for TablerList

### v2.2.0

- :tada: Add toggle & list components

### v2.1.2

- :bug: Remove href in TablerSelect

### v2.1.1

- :bug: Fix directive name

### v2.1.0

- :rocket: Add `inline` prop to loading mode

### v2.0.0

- :rocket: Prefix all components with `Tabler` to pass Vue ESLint
- :tada: Allow user defined `type` prop in Input Component

### v1.4.0

- :tada: `Loading` component

### v1.3.0

- :rocket: `Input#disabled` prop

### v1.2.0

- :tada: `Input` Component

### v1.1.0

- :rocket: Add new components & linting

### v1.0.1

- :bug: package.json fixes for exporting as module

### v1.0.0

- Initial Release
- `Select` Component
