# Bits UI

Flexible, unstyled, and accessible primitives that provide the foundation for building your own high-quality Svelte component library.

Bits UI is a collection of headless component primitives for Svelte that prioritizes developer experience, accessibility, and flexibility. The goal is to empower developers to build high-quality, accessible user interfaces without sacrificing creative control or performance.

<Image src={banner} alt="Bits UI Banner" class="rounded-container shadow-xl" />

<figure class="linker bg-noise bg-[#cae2f7]!">
  <a class="btn preset-filled" href="https://www.bits-ui.com/" target="_blank">
    View Bits UI Docs
  </a>
</figure>

At minimum, we recommend you read the following documentation before you start this integration guide.

* [Getting Started](https://www.bits-ui.com/docs/getting-started)
* [Styling](https://www.bits-ui.com/docs/styling)

## Requirements

\| Tooling                              | Minimum Supported |
\| ------------------------------------ | ----------------- |
\| [Svelte](https://svelte.dev/)        | 5                 |
\| [Skeleton](https://skeleton.dev)     | 3                 |
\| [Tailwind](https://tailwindcss.com/) | 4                 |
\| [Bits UI](https://www.bits-ui.com/)  | 1                 |

## Introduction

In this guide we'll implement the following Bits UI `<Calendar>` component. This will showcase the bare minimum requirements for integrating Skeleton with Bits UI.

<Image src={datePicker} alt="Bits UI Date Picker Component" class="rounded-container shadow-xl" />

<figure class="linker bg-noise bg-[#cae2f7]!">
  <a class="btn preset-filled" href="https://www.bits-ui.com/docs/components/calendar" target="_blank">
    Calendar Documentation
  </a>
</figure>

## Get Started

<Process>
  <ProcessStep step="1">
    ### Create a SvelteKit Project

    To begin, we'll setup a new SvelteKit project, including Skeleton v3 and Tailwind v4.

    <a class="btn preset-filled mt-4" href={resolvePath(props.Astro, '/docs/[framework]/get-started/installation/sveltekit')} target="_blank">Setup SvelteKit App</a>
  </ProcessStep>

  <ProcessStep step="2">
    ### Install Bits UI

    Install the Bits UI package via your package manager of choice.

    ```bash
    npm install bits-ui
    ```

    We'll also include the [Adobe International Date](https://react-spectrum.adobe.com/internationalized/date/index.html) package to assist with date/time formatting.

    ```bash
    npm i -D @internationalized/date
    ```
  </ProcessStep>

  <ProcessStep step="3">
    ### Component Boilerplate

    Create a new component in `/lib/components/Calendar/Calendar.svelte` and insert the following markup. This will generate an unstyled version of the component.

    ```svelte
    <script lang="ts">
    	import { Calendar } from 'bits-ui';
    	import { getLocalTimeZone, today } from '@internationalized/date';

    	const isDateUnavailable: Calendar.RootProps['isDateUnavailable'] = (date) => {
    		return date.day === 17 || date.day === 18;
    	};

    	let value = $state(today(getLocalTimeZone()));
    </script>

    <Calendar.Root {isDateUnavailable} weekdayFormat="short" fixedWeeks={true} type="single" bind:value>
    	{#snippet children({ months, weekdays })}
    		<Calendar.Header>
    			<Calendar.PrevButton>
    				<span>&larr;</span>
    			</Calendar.PrevButton>
    			<Calendar.Heading />
    			<Calendar.NextButton>
    				<span>&rarr;</span>
    			</Calendar.NextButton>
    		</Calendar.Header>

    		{#each months as month}
    			<Calendar.Grid>
    				<Calendar.GridHead>
    					<Calendar.GridRow>
    						{#each weekdays as day}
    							<Calendar.HeadCell>
    								{day}
    							</Calendar.HeadCell>
    						{/each}
    					</Calendar.GridRow>
    				</Calendar.GridHead>
    				<Calendar.GridBody>
    					{#each month.weeks as weekDates}
    						<Calendar.GridRow>
    							{#each weekDates as date}
    								<Calendar.Cell {date} month={month.value}>
    									<Calendar.Day />
    								</Calendar.Cell>
    							{/each}
    						</Calendar.GridRow>
    					{/each}
    				</Calendar.GridBody>
    			</Calendar.Grid>
    		{/each}
    	{/snippet}
    </Calendar.Root>
    ```
  </ProcessStep>

  <ProcessStep step="check">
    ### Add the Component

    Finally, let's add our new component to the root `+page.svelte` so that we may preview it.

    ```svelte
    <script lang="ts">
    	import Calendar from '$lib/components/Calendar/Calendar.svelte';
    </script>

    <main class="p-10">
    	<Calendar />
    </main>
    ```
  </ProcessStep>
</Process>

## Styling

Each Bits UI component accepts a `class` attribute. Use this to provide Tailwind and Skeleton utility classes.

### Basic Styles

Styling the `<Calendar.Root>` parent component.

```svelte
<Calendar.Root class="card inline-block border border-surface-200-800 bg-surface-50-950 shadow-xl mt-6 p-4">
	<!-- ... -->
</Calendar.Root>
```

Styling the `<Calendar.PrevButton>` sub-component. You can clone these to `<Calendar.NextButton>` too.

```svelte
<Calendar.PrevButton class="btn-icon preset-filled-primary-500" title="Previous month" aria-label="Previous month">
	<span>&larr;</span>
</Calendar.PrevButton>
```

Styling the `<Calendar.Day>` sub-component.

```svelte
<Calendar.Day
	class="rounded hover:border-surface-200-800 data-selected:bg-foreground data-disabled:text-surface-600-400 data-selected:preset-filled data-unavailable:text-surface-600-400 data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
>
	<div class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"></div>
	{date.day}
</Calendar.Day>
```

For the sake of time we won't cover every sub-component.

### Complete Example

Below is a complete example showing the entire component with all styles and basic configuration.

```svelte
<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from 'bits-ui';

	const isDateUnavailable: Calendar.RootProps['isDateUnavailable'] = (date) => {
		return date.day === 17 || date.day === 18;
	};

	let value = $state(today(getLocalTimeZone()));
</script>

<Calendar.Root
	class="card inline-block border border-surface-200-800 bg-surface-50-950 shadow-xl mt-6 p-4"
	{isDateUnavailable}
	weekdayFormat="short"
	fixedWeeks={true}
	type="single"
	bind:value
>
	{#snippet children({ months, weekdays })}
		<Calendar.Header class="flex items-center justify-between">
			<Calendar.PrevButton class="btn-icon preset-filled-primary-500" title="Previous month" aria-label="Previous month">
				<span>&larr;</span>
			</Calendar.PrevButton>
			<Calendar.Heading class="text-lg font-bold" />
			<Calendar.NextButton class="btn-icon preset-filled-primary-500" title="Next month" aria-label="Next month">
				<span>&rarr;</span>
			</Calendar.NextButton>
		</Calendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
			{#each months as month, i (i)}
				<Calendar.Grid class="w-full border-collapse select-none space-y-1">
					<Calendar.GridHead>
						<Calendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day}
								<Calendar.HeadCell class="text-surface-600-400 font-normal! w-10 rounded-md text-xs">
									<div>{day.slice(0, 2)}</div>
								</Calendar.HeadCell>
							{/each}
						</Calendar.GridRow>
					</Calendar.GridHead>
					<Calendar.GridBody>
						{#each month.weeks as weekDates}
							<Calendar.GridRow class="flex w-full">
								{#each weekDates as date}
									<Calendar.Cell {date} month={month.value} class="p-0! relative size-10 text-center text-sm">
										<Calendar.Day
											class="rounded hover:border-surface-200-800 data-selected:bg-foreground data-disabled:text-surface-600-400 data-selected:preset-filled data-unavailable:text-surface-600-400 data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
										>
											<div
												class="bg-foreground group-data-selected:bg-surface-50-950 group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
											></div>
											{date.day}
										</Calendar.Day>
									</Calendar.Cell>
								{/each}
							</Calendar.GridRow>
						{/each}
					</Calendar.GridBody>
				</Calendar.Grid>
			{/each}
		</div>
	{/snippet}
</Calendar.Root>
```

## Going Further

If you wish to match Skeleton component conventions, view our [contributor component guidelines](/docs/\[framework]/resources/contribute/components).

## Attribution

Bits UI is created and maintained by [Huntabyte](https://github.com/huntabyte). Consider [sponsoring him](https://github.com/sponsors/huntabyte) to support this open source project.

# Melt UI

An open-source Svelte library for building high-quality, accessible design systems and web apps.

Melt UI empowers developers to create accessible UIs that embody their unique style. With a strong focus on accessibility, limitless customization options, and an overall delightful developer experience, Melt UI strives to be the de-facto headless UI library for Svelte.

<Image src={banner} alt="Melt UI Banner" class="rounded-container shadow-xl" />

<figure class="linker bg-noise bg-[#d59f6a]!">
  <a class="btn preset-filled" href="https://next.melt-ui.com/" target="_blank">
    View Melt UI Docs
  </a>
</figure>

At minimum, we recommend you read the following documentation before you start this integration guide.

* [Styling](https://next.melt-ui.com/guides/styling)
* [How to Use](https://next.melt-ui.com/guides/how-to-use)

## Requirements

\| Tooling                              | Minimum Supported  |
\| ------------------------------------ | ------------------ |
\| [Svelte](https://svelte.dev/)        | 5                  |
\| [Skeleton](https://skeleton.dev)     | 3                  |
\| [Tailwind](https://tailwindcss.com/) | 4                  |
\| [Melt UI](https://next.melt-ui.com/) | (Svelte 5 version) |

## Introduction

In this guide we'll implement the following Melt UI `<Accordion>` component. This will showcase the bare minimum requirements for integrating Skeleton with Melt UI.

<Image src={accordion} alt="Melt UI Accordion Component" class="rounded-container shadow-xl" />

<figure class="linker bg-noise bg-[#d59f6a]!">
  <a class="btn preset-filled" href="https://next.melt-ui.com/components/accordion/" target="_blank">
    Accordion Documentation
  </a>
</figure>

## Get Started

<Process>
  <ProcessStep step="1">
    ### Create a SvelteKit Project

    To begin, we'll setup a new SvelteKit project, including Skeleton v3 and Tailwind v4.

    <a class="btn preset-filled mt-4" href={resolvePath(props.Astro, '/docs/[framework]/get-started/installation/sveltekit')} target="_blank">Setup SvelteKit App</a>
  </ProcessStep>

  <ProcessStep step="2">
    ### Install Melt UI

    Install the Melt UI package via your package manager of choice.

    ```bash
    npm install melt
    ```
  </ProcessStep>

  <ProcessStep step="3">
    ### Component Boilerplate

    Create a new component in `/lib/components/Accordion/Accordion.svelte` and insert the following markup. This will generate an unstyled version of the component.

    ```svelte
    <script lang="ts">
    	import { Accordion, type AccordionItem } from "melt/builders";

    	type Item = AccordionItem<{
    		title: string;
    		description: string;
    	}>;

    	const items: Item[] = [
    		{ id: "item-1", title: "What is it?", description: "..."},
    		{ id: "item-2", title: "Can I customize it?", description: "..."},
    	];

    	const accordion = new Accordion();
    </script>

    <div {...accordion.root}>
    	{#each items as i}
    		{@const item = accordion.getItem(i)}
    		<h2 {...item.heading}>
    			<button {...item.trigger}>
    				{item.item.title}
    			</button>
    		</h2>
    		<div {...item.content}>
    			{item.item.description}
    		</div>
    	{/each}
    </div>
    ```
  </ProcessStep>

  <ProcessStep step="check">
    ### Add the Component

    Finally, let's add our new component to the root `+page.svelte` so that we may preview it.

    ```svelte
    <script lang="ts">
    	import Accordion from '$lib/components/Accordion/Accordion.svelte';
    </script>

    <main class="p-10">
    	<Accordion />
    </main>
    ```
  </ProcessStep>
</Process>

## Styling

Melt UI builders are made up of native HTML elements, meaning you can implement classes directly. Use this to provide Tailwind and Skeleton utility classes.

### Basic Styles

Styling the root element.

```svelte
<div {...accordion.root} class="card overflow-hidden">
	<!-- ... -->
</div>
```

Styling the trigger button element.

```svelte
<button {...item.trigger} class="preset-filled-surface-200-800 hover:preset-filled-primary-500 w-full cursor-pointer p-4 text-left">
	<!-- ... -->
</button>
```

Styling content element, including animations based on the `data-state` value.

```svelte
<div
	{...item.content}
	class="preset-filled-surface-100-900 cursor-pointer p-4 transition-all duration-200 data-[state=closed]:h-0 data-[state=closed]:py-0"
>
	<!-- ... -->
</div>
```

Before the close of the `#each` block, insert the follow to insert a `<hr />` divider.

```svelte
{#if index < items.length - 1}<hr class="hr border-surface-50-950" />{/if}
```

### Complete Example

Below is a complete example showing the entire component with styles, transitions, and some basic configuration.

```svelte
<script lang="ts">
	import { Accordion, type AccordionItem } from 'melt/builders';
	import { slide } from 'svelte/transition';

	type Item = AccordionItem<{
		title: string;
		description: string;
	}>;

	const items: Item[] = [
		{
			id: 'item-1',
			title: 'Bulbasaur',
			description: 'For some time after its birth, it uses the nutrients that are packed into the seed on its back in order to grow.',
		},
		{
			id: 'item-2',
			title: 'Charmander',
			description: 'The flame on its tail shows the strength of its life-force. If Charmander is weak, the flame also burns weakly.',
		},
		{
			id: 'item-3',
			title: 'Squirtle',
			description: 'After birth, its back swells and hardens into a shell. It sprays a potent foam from its mouth.',
		},
	];

	const accordion = new Accordion({ multiple: true });
</script>

<div {...accordion.root} class="card w-full max-w-xl overflow-hidden">
	{#each items as i, index}
		{@const item = accordion.getItem(i)}
		<h2 {...item.heading}>
			<button {...item.trigger} class="preset-filled-surface-200-800 hover:preset-filled-primary-500 w-full cursor-pointer p-4 text-left">
				{item.item.title}
			</button>
		</h2>
		{#if item.isExpanded}
			<div {...item.content} class="preset-filled-surface-100-900 cursor-pointer p-4" transition:slide={{ duration: 100 }}>
				{item.item.description}
			</div>
		{/if}
		{#if index < items.length - 1}<hr class="hr border-surface-50-950" />{/if}
	{/each}
</div>
```

## Going Further

If you wish to match Skeleton component conventions, view our [contributor component guidelines](/docs/\[framework]/resources/contribute/components).

## Attribution

Melt UI is created and maintained by [TGlide](https://github.com/TGlide). Consider [sponsoring him](https://github.com/sponsors/TGlide) to support this open source project.

# Radix UI

Unstyled, accessible, open source React primitives for high-quality web apps and design systems.

Radix Primitives is a low-level UI component library with a focus on accessibility, customization and developer experience. You can use these components either as the base layer of your design system, or adopt them incrementally.

<Image src={banner} alt="Radix UI Banner" class="rounded-container shadow-xl" />

<figure class="linker bg-noise bg-[#3a2036]!">
  <a class="btn preset-filled" href="https://www.radix-ui.com/" target="_blank">
    View Radix UI Docs
  </a>
</figure>

At minimum, we recommend you read the following documentation before you start this integration guide.

* [Introduction](https://www.radix-ui.com/primitives/docs/overview/introduction)
* [Getting Started](https://www.radix-ui.com/primitives/docs/overview/getting-started)
* [Styling](https://www.radix-ui.com/primitives/docs/guides/styling)

## Requirements

\| Tooling                               | Minimum Supported |
\| ------------------------------------- | ----------------- |
\| [React](https://react.dev/)           | 18                |
\| [Skeleton](https://skeleton.dev)      | 3                 |
\| [Radix UI](https://www.radix-ui.com/) | 1                 |
\| [Tailwind](https://tailwindcss.com/)  | 4                 |

## Introduction

In this guide we'll implement the following Radix UI `<ToggleGroup>` component. This will showcase the bare minimum requirements for integrating Skeleton with Radix UI.

<Image src={toggleGroup} alt="Radix UI Toggle Group Component" class="rounded-container shadow-xl" />

<figure class="linker bg-noise bg-[#3a2036]!">
  <a class="btn preset-filled" href="https://www.radix-ui.com/primitives/docs/components/toggle-group" target="_blank">
    Toggle Group Documentation
  </a>
</figure>

## Get Started

<Process>
  <ProcessStep step="1">
    ### Create a Project

    To begin, we'll setup a new Vite project with React v19, Skeleton v3, and Tailwind v4.

    <a class="btn preset-filled mt-4" href={resolvePath(props.Astro, '/docs/[framework]/get-started/installation/vite-react')} target="_blank">Setup Vite/React App</a>
  </ProcessStep>

  <ProcessStep step="2">
    ### Install Radix Component

    Install the Radix UI component package via your package manager of choice.

    ```bash
    npm install @radix-ui/react-toggle-group
    ```
  </ProcessStep>

  <ProcessStep step="3">
    ### Component Boilerplate

    Create a new component in `/src/components/ToggleGroup/ToggleGroup.tsx` and insert the following markup. This will generate an unstyled version of the component. Note that we have renamed the Radix component to `RadixToggleGroup` to remain semantic and avoid conflict with our own component name.

    ```tsx
    import { type FC } from "react";
    import * as RadixToggleGroup from "@radix-ui/react-toggle-group";

    interface ToggleGroupProps { /* ... */ }

    export const ToggleGroup: FC<ToggleGroupProps> = () => {
    	return (
    		<RadixToggleGroup.Root
    			className="ToggleGroup"
    			type="single"
    			defaultValue="center"
    			aria-label="Text alignment"
    		>
    			<RadixToggleGroup.Item
    				className="ToggleGroupItem"
    				value="left"
    				aria-label="Left aligned"
    			>
    				Left
    			</RadixToggleGroup.Item>
    			<RadixToggleGroup.Item
    				className="ToggleGroupItem"
    				value="center"
    				aria-label="Center aligned"
    			>
    				Center
    			</RadixToggleGroup.Item>
    			<RadixToggleGroup.Item
    				className="ToggleGroupItem"
    				value="right"
    				aria-label="Right aligned"
    			>
    				Right
    			</RadixToggleGroup.Item>
    		</RadixToggleGroup.Root>
    	);
    };

    ```
  </ProcessStep>

  <ProcessStep step="check">
    ### Add the Component

    Finally, let's add our new component to the app in `/src/App.tsx`.

    ```tsx
    import "./App.css";
    import { ToggleGroup } from "./components/ToggleGroup/ToggleGroup";

    function App() {
    	return (
    		<main className="p-10">
    			<ToggleGroup />
    		</main>
    	);
    }

    export default App;
    ```
  </ProcessStep>
</Process>

## Styling

Each Radix UI component accepts a `className` prop. Use this to provide Tailwind and Skeleton utility classes.

### Basic Styles

Styling the `<RadixToggleGroup.Root>` component.

```tsx
<RadixToggleGroup.Root
	className="btn-group preset-outlined-surface-200-800 flex-col p-2 md:flex-row"
	type="single"
	defaultValue="center"
	aria-label="Text alignment"
>
	{/* ... */}
</RadixToggleGroup.Root>
```

Styling each item component. Apply these styles to each button.

```tsx
<RadixToggleGroup.Item className="btn hover:preset-tonal data-[state=on]:preset-filled" value="..." aria-label="...">
	{/* ... */}
</RadixToggleGroup.Item>
```

### Complete Example

Below is a complete example showing the entire component with all styles and basic configuration.

```tsx
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import { useState, type FC } from 'react';

interface ToggleGroupProps {
	/* ... */
}

export const ToggleGroup: FC<ToggleGroupProps> = () => {
	const [value, setValue] = useState('left');

	return (
		<RadixToggleGroup.Root
			className="btn-group preset-outlined-surface-200-800 flex-col p-2 md:flex-row"
			type="single"
			value={value}
			onValueChange={(value) => {
				if (value) setValue(value);
			}}
			aria-label="Text alignment"
		>
			<RadixToggleGroup.Item className="btn hover:preset-tonal data-[state=on]:preset-filled" value="left" aria-label="Left aligned">
				Left
			</RadixToggleGroup.Item>
			<RadixToggleGroup.Item className="btn hover:preset-tonal data-[state=on]:preset-filled" value="center" aria-label="Center aligned">
				Center
			</RadixToggleGroup.Item>
			<RadixToggleGroup.Item className="btn hover:preset-tonal data-[state=on]:preset-filled" value="right" aria-label="Right aligned">
				Right
			</RadixToggleGroup.Item>
		</RadixToggleGroup.Root>
	);
};
```

## Going Further

If you wish to match Skeleton component conventions, view our [contributor component guidelines](/docs/\[framework]/resources/contribute/components).

## Attribution

Radix UI is created and maintained by [WorkOS](https://workos.com/).

## Resources


---

