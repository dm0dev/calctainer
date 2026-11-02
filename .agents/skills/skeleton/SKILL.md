---
name: skeleton
description: >-
  Expert guide and component reference for Skeleton UI (v5+) and its Tailwind CSS design system.
  Activate this skill whenever the user asks to build, style, migrate, or debug UI components
  using Skeleton, @skeletonlabs/skeleton, @skeletonlabs/skeleton-svelte, or @skeletonlabs/skeleton-react.
  Covers Tailwind v4 @theme tokens, color pairings with light-dark(), presets (filled, tonal, outlined),
  element sizing scales (elem-xs to elem-9xl), Tailwind CSS components (buttons, badges, cards, forms,
  tables, placeholders, disclosures), interactive Zag.js components (Accordion, Combobox, Date Picker,
  Dialog, File Upload, Menu, Navigation, Popover, Tabs, Toast, Tooltip, Tree View, etc.), preset/custom
  theming, dynamic theme switching, and migration from Skeleton v4.
---

# Skeleton UI (v5+) Skill Guide

Skeleton is an opinionated design system and component library built for **Tailwind CSS (v4)** and modern frontend frameworks (**Svelte 5** and **React**). It couples framework-agnostic CSS design tokens with interactive, accessible UI primitives powered by **Zag.js**.

---

## 1. Quick Start & Setup

### Packages
```bash
# Core design system & utilities (framework agnostic)
npm i -D @skeletonlabs/skeleton

# Framework components (choose your framework)
npm i -D @skeletonlabs/skeleton-svelte   # Svelte 5 (requires svelte >= 5.40.0)
npm i -D @skeletonlabs/skeleton-react    # React
```

### Global Stylesheet Setup (`app.css` / `global.css`)
Skeleton v5 natively integrates with Tailwind CSS v4 using CSS `@import`:
```css
/* Import Tailwind CSS */
@import 'tailwindcss';

/* Register Preset Theme(s) */
@import '@skeletonlabs/skeleton/themes/cerberus';
/* Additional optional themes: */
/* @import '@skeletonlabs/skeleton/themes/mona'; */
/* @import '@skeletonlabs/skeleton/themes/vox'; */
/* @import '@skeletonlabs/skeleton/themes/dracula'; */
/* @import '@skeletonlabs/skeleton/themes/rosepine'; */
```

### Activate Active Theme
Set `data-theme` on your root HTML element:
```html
<html lang="en" data-theme="cerberus">
  <body class="bg-surface-50-950 text-surface-950-50">
    <slot />
  </body>
</html>
```

---

## 2. Design System Architecture & Tokens

### The 7 Semantic Palettes
Every Skeleton theme provides 7 color roles with shades from `50` to `950`:
- `primary`: Main brand accent
- `secondary`: Supporting accent
- `tertiary`: Tertiary accent
- `success`: Positive feedback / confirm
- `warning`: Cautionary feedback
- `error`: Destructive / failure feedback
- `surface`: Backgrounds, cards, borders, text

### Color Pairings (`light-dark()`)
Skeleton pairs light and dark shades into single utility classes:
`[property]-[color]-[lightShade]-[darkShade]`
```html
<!-- Automatically white/light in light mode, dark in dark mode -->
<div class="bg-surface-50-950 text-surface-950-50 border border-surface-200-800">
  <p class="text-primary-600-400">Adaptive primary text</p>
</div>
```
*(Note: Shade 500 is the center pivot and does not have an automated pairing).*

### Presets
Presets bundle background, text, border, and hover styles:
- **Filled**: `preset-filled`, `preset-filled-primary-500`, `preset-filled-secondary-500`, etc.
- **Tonal**: `preset-tonal`, `preset-tonal-primary`, `preset-tonal-surface`
- **Outlined**: `preset-outlined`, `preset-outlined-surface-200-800`

### Element Sizes (`elem-*`)
Skeleton standardizes element sizing matching the `--type-*` scale:
`elem-xs`, `elem-sm`, `elem-base`, `elem-lg`, `elem-xl`, `elem-2xl` through `elem-9xl`.
- Used for width/height/size: `size-elem-base`, `w-elem-lg`, `h-elem-sm`
- Used for component sizing: `btn-sm`, `btn-base`, `btn-lg`, `badge-sm`, `badge-base`

### Corner Shapes & Radii
- Radii: `rounded-base`, `rounded-container`
- Modern corner shapes: `corner-shape-base`, `corner-shape-container`, `corner-shape-squircle`

### Typography Utilities
- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Base text styles: `font-typo-base`, `text-typo-base`, `leading-typo-base`, `tracking-typo-base`
- Heading styles: `font-typo-heading`, `tracking-typo-heading`
- Anchors: `font-typo-anchor`, `anchor`

---

## 3. Tailwind Components (Pure HTML / Utilities)

Skeleton provides classes for semantic HTML without requiring JavaScript:

### Buttons (`btn`)
```html
<!-- Base button with preset -->
<button type="button" class="btn preset-filled">Click Me</button>

<!-- Sized & themed button -->
<button type="button" class="btn btn-sm preset-filled-primary-500">Small Primary</button>
<button type="button" class="btn btn-lg preset-outlined-surface-200-800">Large Outline</button>

<!-- Button group -->
<div class="btn-group">
  <button type="button" class="btn preset-tonal">Left</button>
  <button type="button" class="btn preset-tonal">Middle</button>
  <button type="button" class="btn preset-tonal">Right</button>
</div>
```

### Badges (`badge`)
```html
<span class="badge preset-filled-success-500">Active</span>
<span class="badge badge-sm preset-tonal-error">Error</span>
```

### Cards (`card`)
```html
<div class="card preset-outlined-surface-200-800 bg-surface-50-950 p-6 space-y-4">
  <h3 class="h3">Card Title</h3>
  <p class="text-surface-700-300">Card content goes here.</p>
</div>
```

### Forms & Inputs
```html
<!-- Text input -->
<input type="text" class="input" placeholder="Standard input..." />

<!-- Select -->
<select class="select">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>

<!-- Field group with prefix/suffix icons/buttons -->
<div class="input-group grid-cols-[auto_1fr_auto]">
  <div class="input-group-cell">@</div>
  <input type="text" placeholder="Username" />
  <button class="btn preset-filled">Check</button>
</div>

<!-- Checkbox & Radio -->
<label class="flex items-center space-x-2">
  <input type="checkbox" class="checkbox" checked />
  <span>Subscribe</span>
</label>
```

### Tables (`table`)
```html
<table class="table table-hover">
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>Developer</td>
    </tr>
  </tbody>
</table>
```

### Placeholders (Skeleton Loaders)
```html
<div class="space-y-2">
  <div class="placeholder h-4 w-3/4 animate-pulse"></div>
  <div class="placeholder h-4 w-1/2 animate-pulse"></div>
</div>
```

---

## 4. Framework Components (Zag.js Powered)

Skeleton offers 30+ turnkey accessible components for Svelte (`@skeletonlabs/skeleton-svelte`) and React (`@skeletonlabs/skeleton-react`).

### Core Component Principles

1. **Composed Pattern**: Granular children components matching DOM semantics.
2. **Styling Convention**: Pass standard Tailwind utility classes directly to `class`.
3. **Data Model Pattern**: Explicit Zag convention: value passed via prop (`value`, `checked`, `open`), mutations captured via event callback (`onValueChange`, `onCheckedChange`, `onOpenChange`).
4. **Extensible Markup**: Override internal markup using snippet/render props:
   ```svelte
   {#snippet element(attributes)}
     <button {...attributes}>Custom</button>
   {/snippet}
   ```
5. **Provider Pattern**: Replace component root with `*.Provider` + hook (`useTooltip()`, `useDialog()`) for programmatic control.

### Common Component Examples (Svelte 5)

#### Accordion
```svelte
<script lang="ts">
  import { Accordion } from '@skeletonlabs/skeleton-svelte';
  let value = $state(['item-1']);
</script>

<Accordion {value} onValueChange={(e) => (value = e.value)}>
  <Accordion.Item value="item-1">
    <h3>
      <Accordion.ItemTrigger>Section 1</Accordion.ItemTrigger>
    </h3>
    <Accordion.ItemContent>Content for section 1</Accordion.ItemContent>
  </Accordion.Item>
</Accordion>
```

#### Avatar
```svelte
<script lang="ts">
  import { Avatar } from '@skeletonlabs/skeleton-svelte';
</script>

<Avatar class="size-elem-lg">
  <Avatar.Image src="https://i.pravatar.cc/150?img=48" alt="User avatar" />
  <Avatar.Fallback class="preset-filled-primary-500">JD</Avatar.Fallback>
</Avatar>
```

#### Switch
```svelte
<script lang="ts">
  import { Switch } from '@skeletonlabs/skeleton-svelte';
  let checked = $state(false);
</script>

<Switch {checked} onCheckedChange={(e) => (checked = e.checked)}>
  <Switch.Control>
    <Switch.Thumb />
  </Switch.Control>
  <Switch.Label>Enable notifications</Switch.Label>
  <Switch.HiddenInput />
</Switch>
```

#### Tabs
```svelte
<script lang="ts">
  import { Tabs } from '@skeletonlabs/skeleton-svelte';
  let group = $state('tab-1');
</script>

<Tabs value={group} onValueChange={(e) => (group = e.value)}>
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Account</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Settings</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="tab-1">Account settings content</Tabs.Content>
  <Tabs.Content value="tab-2">Preferences content</Tabs.Content>
</Tabs>
```

#### Dialog (Modal)
```svelte
<script lang="ts">
  import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
  let open = $state(false);
</script>

<Dialog {open} onOpenChange={(e) => (open = e.open)}>
  <Dialog.Trigger class="btn preset-filled">Open Dialog</Dialog.Trigger>
  <Portal>
    <Dialog.Backdrop class="fixed inset-0 bg-black/50" />
    <Dialog.Positioner class="fixed inset-0 grid place-items-center p-4">
      <Dialog.Content class="card bg-surface-50-950 p-6 space-y-4 max-w-lg w-full">
        <Dialog.Title class="h3">Confirm Action</Dialog.Title>
        <Dialog.Description>Are you sure you want to proceed?</Dialog.Description>
        <div class="flex justify-end gap-2">
          <Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
          <button class="btn preset-filled-primary-500" onclick={() => open = false}>Confirm</button>
        </div>
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog>
```

---

## 5. Theming & Dark Mode

### Dynamic Theme Switching
To support runtime theme switching, register all needed themes in your CSS:
```css
@import '@skeletonlabs/skeleton/themes/cerberus';
@import '@skeletonlabs/skeleton/themes/mona';
@import '@skeletonlabs/skeleton/themes/vox';
```
Then update the `data-theme` attribute on `document.documentElement`:
```ts
function setTheme(themeName: string) {
  document.documentElement.setAttribute('data-theme', themeName);
}
```

### Overriding Theme Properties
You can override specific theme tokens directly in CSS:
```css
[data-theme='cerberus'] {
  --color-primary-500: #0ea5e9;
  --radius-base: 0.5rem;
}
```

---

## 6. Migration from v4 to v5

If upgrading a project from Skeleton v4:
1. **Automated Migration CLI**:
   ```bash
   npx skeleton@latest migrate skeleton-5
   ```
2. **Key Token Changes**:
   - `--base-font-family` $\rightarrow$ `--typo-base--font-family`
   - `--base-font-color` $\rightarrow$ `--typo-base--color-light` / `--typo-base--color-dark`
   - `--heading-font-family` $\rightarrow$ `--typo-heading--font-family`
   - `--anchor-font-family` $\rightarrow$ `--typo-anchor--font-family`
3. **Peer Dependencies**:
   - `svelte` bumped to `^5.40.0` or later.
4. **Field Groups**: Replaced old `input-group` markup with new `field-group` classes.

---

## 7. Detailed Documentation References

For exhaustive API tables, full prop schemas, and advanced patterns, refer to the topic-specific documentation:

- [Core API & Design Tokens](./references/core-api-and-tokens.md) — Base styles, `@theme` variables, typography math, color palette tables, spacing scales, and corner shapes.
- [Theming & Colors Guide](./references/theming-and-colors.md) — Theme anatomy, custom generator import, light-dark() pairings, typography scaling, and preset definitions.
- [Tailwind Components](./references/tailwind-components.md) — Complete markup specifications for Buttons, Badges, Cards, Chips, HTML Dialogs, Disclosures, Dividers, Forms, Placeholders, and Tables.
- [Framework Components](./references/framework-components.md) — Full API reference and examples for all 30+ Svelte/React Zag.js components (Combobox, Date Picker, File Upload, Navigation, Popover, Toast, Tree View, etc.).
- [Integrations](./references/integrations.md) — Using Skeleton's Tailwind utilities with headless libraries (Bits UI, Melt UI, Radix UI).
- [Migration Guide (v4 $\rightarrow$ v5)](./references/migration-v4-to-v5.md) — Comprehensive migration instructions and token rename mapping.
- [Full Verbatim Documentation](./references/full-docs.txt) — Raw unedited documentation dump from skeleton.dev for deep lookups.
