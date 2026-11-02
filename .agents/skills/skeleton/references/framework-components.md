# Accordion

Divide content into collapsible sections.

```svelte
<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { slide } from 'svelte/transition';

	/**
	 * Attribution
	 * @see https://www.healthline.com/health/fun-facts-about-the-skeletal-system#8-More-than-half-your-bones-are-in-your-hands-and-feet
	 */
	const items = [
		{
			id: '1',
			title: 'Your skeleton is made of more than 200 bones',
			description:
				'Inside your body are 206 bones. Each bone plays a very important role in making all the mechanics of your body function properly. If a bone is broken, all the bones around it can’t perform their duty properly.',
		},
		{
			id: '2',
			title: 'The smallest bone in the body is in your ear',
			description:
				'The stapes, a bone in your inner ear, is the smallest of all your bones. This bone is also sometimes called the stirrup because of its Y shape. Together with the anvil and hammer bones, the stapes helps translate sounds you hear into waves your brain can understand.',
		},
		{
			id: '3',
			title: 'One bone isn’t connected to any other bones',
			description:
				'The hyoid bone, which is in your throat, is the only bone that doesn’t connect to a joint. The hyoid is responsible for holding your tongue in place.',
		},
	];
</script>

<Accordion>
	{#each items as item, i (item)}
		{#if i !== 0}
			<hr class="hr" />
		{/if}
		<Accordion.Item value={item.id}>
			<h3>
				<Accordion.ItemTrigger class="font-bold flex items-center justify-between gap-2">
					{item.title}
					<Accordion.ItemIndicator class="group">
						<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
					</Accordion.ItemIndicator>
				</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent>
				{#snippet element(attributes)}
					{#if !attributes.hidden}
						<div {...attributes} transition:slide={{ duration: 150 }}>
							{item.description}
						</div>
					{/if}
				{/snippet}
			</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>

```

## Controlled

Use the `open` and `onOpenChange` props to control the state.

```svelte
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	let value = $state(['1']);
</script>

<Accordion {value} onValueChange={(details) => (value = details.value)}>
	{#each ['1', '2', '3'] as item (item)}
		<Accordion.Item value={item}>
			<h3>
				<Accordion.ItemTrigger>Item {item}</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent>Content for item {item}</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>

```

## Multiple

Allow multiple accordion items to stay open at once using the `multiple` prop.

```svelte
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
</script>

<Accordion multiple>
	{#each ['1', '2', '3'] as item (item)}
		<Accordion.Item value={item}>
			<h3>
				<Accordion.ItemTrigger>Item {item}</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent>Content for item {item}</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>

```

## Collapsible

Allow closing all items when one is open using the `collapsible` prop.

```svelte
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
</script>

<Accordion collapsible>
	{#each ['1', '2', '3'] as item (item)}
		<Accordion.Item value={item}>
			<h3>
				<Accordion.ItemTrigger>Item {item}</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent>Content for item {item}</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>

```

## Indicator

Add a custom indicator to accordion triggers.

```svelte
<script lang="ts">
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
</script>

<Accordion>
	{#each ['1', '2', '3'] as item (item)}
		<Accordion.Item value={item}>
			<h3>
				<Accordion.ItemTrigger class="flex justify-between items-center">
					Item {item}
					<Accordion.ItemIndicator class="group">
						<MinusIcon class="size-4 group-data-[state=open]:block hidden" />
						<PlusIcon class="size-4 group-data-[state=open]:hidden block" />
					</Accordion.ItemIndicator>
				</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent>Content for item {item}</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>

```

## Orientation

Render the accordion vertically or horizontally using the `orientation` prop.

```svelte
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
</script>

<Accordion orientation="horizontal">
	{#each ['1', '2', '3'] as item (item)}
		<Accordion.Item value={item} class="data-[state=open]:flex-1">
			<h3>
				<Accordion.ItemTrigger>Item {item}</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent>Content for item {item}</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>

```

## Dir

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
</script>

<Accordion dir="rtl">
	{#each ['1', '2', '3'] as item (item)}
		<Accordion.Item value={item}>
			<h3>
				<Accordion.ItemTrigger>Item {item}</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent>Content for item {item}</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>

```

## Anatomy

Here's an overview of how the Accordion component is structured in code:

```svelte
<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
</script>

<Accordion>
	<Accordion.Item>
		<Accordion.ItemTrigger />
		<Accordion.ItemIndicator />
		<Accordion.ItemContent />
	</Accordion.Item>
</Accordion>
```

## API Reference

### Root

| Prop          | Description                                                                                                           | Type                                                                                                                                                       | Default    |
| ------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| ids           | The ids of the elements in the accordion. Useful for composition.                                                     | Partial\<\{ root: string; item: (value: string) => string; itemContent: (value: string) => string; itemTrigger: (value: string) => string; }> \| undefined | -          |
| multiple      | Whether multiple accordion items can be expanded at the same time.                                                    | boolean \| undefined                                                                                                                                       | false      |
| collapsible   | Whether an accordion item can be closed after it has been expanded.                                                   | boolean \| undefined                                                                                                                                       | false      |
| value         | The controlled value of the expanded accordion items.                                                                 | string\[] \| undefined                                                                                                                                     | -          |
| defaultValue  | The initial value of the expanded accordion items.&#xA;Use when you don't need to control the value of the accordion. | string\[] \| undefined                                                                                                                                     | -          |
| disabled      | Whether the accordion items are disabled                                                                              | boolean \| undefined                                                                                                                                       | -          |
| onValueChange | The callback fired when the state of expanded/collapsed accordion items changes.                                      | ((details: ValueChangeDetails) => void) \| undefined                                                                                                       | -          |
| onFocusChange | The callback fired when the focused accordion item changes.                                                           | ((details: FocusChangeDetails) => void) \| undefined                                                                                                       | -          |
| orientation   | The orientation of the accordion items.                                                                               | "horizontal" \| "vertical" \| undefined                                                                                                                    | "vertical" |
| dir           | The document's text/writing direction.                                                                                | "ltr" \| "rtl" \| undefined                                                                                                                                | "ltr"      |
| getRootNode   | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                            | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                        | -          |
| element       | Render the element yourself                                                                                           | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                           | -          |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => AccordionApi\<PropTypes>                   | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                        | Default |
| -------- | ----------- | ------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => AccordionApi\<PropTypes>]> | -       |

### Item

| Prop     | Description                             | Type                                             | Default |
| -------- | --------------------------------------- | ------------------------------------------------ | ------- |
| value    | The value of the accordion item.        | string                                           | -       |
| disabled | Whether the accordion item is disabled. | boolean \| undefined                             | -       |
| element  | Render the element yourself             | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### ItemIndicator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemContent

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# App Bar

A header element for the top of your page layout.

```svelte
<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CircleUserIcon from '@lucide/svelte/icons/circle-user';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Lead>
			<button type="button" class="btn-icon btn-icon-lg hover:preset-tonal"><MenuIcon /></button>
		</AppBar.Lead>
		<AppBar.Headline>
			<p class="text-2xl">Skeleton</p>
		</AppBar.Headline>
		<AppBar.Trail>
			<button type="button" class="btn-icon hover:preset-tonal"><SearchIcon class="size-6" /></button>
			<button type="button" class="btn-icon hover:preset-tonal"><CalendarIcon class="size-6" /></button>
			<button type="button" class="btn-icon hover:preset-tonal"><CircleUserIcon class="size-6" /></button>
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>

```

## Centered

Control the layout using a [grid-cols-\*](https://tailwindcss.com/docs/grid-column) utility class.

```svelte
<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CircleUserIcon from '@lucide/svelte/icons/circle-user';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar>
	<AppBar.Toolbar class="grid-cols-[1fr_2fr_1fr]">
		<AppBar.Lead>
			<button type="button" class="btn-icon btn-icon-lg hover:preset-tonal"><MenuIcon /></button>
		</AppBar.Lead>
		<AppBar.Headline class="flex justify-center">
			<p>Headline</p>
		</AppBar.Headline>
		<AppBar.Trail class="justify-end">
			<button type="button" class="btn-icon hover:preset-tonal"><SearchIcon class="size-6" /></button>
			<button type="button" class="btn-icon hover:preset-tonal"><CalendarIcon class="size-6" /></button>
			<button type="button" class="btn-icon hover:preset-tonal"><CircleUserIcon class="size-6" /></button>
		</AppBar.Trail>
	</AppBar.Toolbar>
</AppBar>

```

## Extended

Move the `<AppBar.Headline>` to a new row within the root.

```svelte
<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CircleUserIcon from '@lucide/svelte/icons/circle-user';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_auto]">
		<AppBar.Lead>
			<button type="button" class="btn-icon btn-icon-lg hover:preset-tonal"><MenuIcon /></button>
		</AppBar.Lead>
		<AppBar.Trail>
			<button type="button" class="btn-icon hover:preset-tonal"><SearchIcon class="size-6" /></button>
			<button type="button" class="btn-icon hover:preset-tonal"><CalendarIcon class="size-6" /></button>
			<button type="button" class="btn-icon hover:preset-tonal"><CircleUserIcon class="size-6" /></button>
		</AppBar.Trail>
	</AppBar.Toolbar>
	<AppBar.Headline>
		<h2 class="h2">Headline</h2>
	</AppBar.Headline>
</AppBar>

```

## Responsive

Modify the layout based on responsive breakpoints.

```svelte
<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CircleUserIcon from '@lucide/svelte/icons/circle-user';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar>
	<!-- 1. Set dynamic layout columns -->
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto] md:grid-cols-[auto_auto]">
		<AppBar.Lead>
			<button type="button" class="btn-icon btn-icon-lg hover:preset-tonal"><MenuIcon /></button>
		</AppBar.Lead>

		<!-- 2. Set Mobile display -->
		<AppBar.Headline class="md:hidden">
			<p class="text-2xl">Headline</p>
		</AppBar.Headline>

		<AppBar.Trail>
			<button type="button" class="btn-icon hover:preset-tonal"><SearchIcon class="size-6" /></button>
			<button type="button" class="btn-icon hover:preset-tonal"><CalendarIcon class="size-6" /></button>
			<button type="button" class="btn-icon hover:preset-tonal"><CircleUserIcon class="size-6" /></button>
		</AppBar.Trail>
	</AppBar.Toolbar>

	<!-- 3 Set Desktop display -->
	<AppBar.Headline class="hidden md:block">
		<p class="text-2xl">Headline</p>
	</AppBar.Headline>
</AppBar>

```

## Anatomy

Here's an overview of how the AppBar component is structured in code:

```svelte
<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar>
	<AppBar.Toolbar>
		<AppBar.Lead />
		<AppBar.Headline />
		<AppBar.Trail />
	</AppBar.Toolbar>
</AppBar>
```

## API Reference

### Root

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"header">]> \| undefined | -       |

### Toolbar

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Lead

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"nav">]> \| undefined | -       |

### Headline

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Trail

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"nav">]> \| undefined | -       |

# Avatar

An image with a fallback for representing the user.

```svelte
<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="flex items-center gap-8">
	<!-- Small -->
	<Avatar class="size-10">
		<Avatar.Image src="https://i.pravatar.cc/40?img=48" alt="small" />
		<Avatar.Fallback>SK</Avatar.Fallback>
	</Avatar>
	<!-- Base -->
	<Avatar>
		<Avatar.Image src="https://i.pravatar.cc/60?img=48" alt="base" />
		<Avatar.Fallback>SK</Avatar.Fallback>
	</Avatar>
	<!-- Large -->
	<Avatar class="size-20">
		<Avatar.Image src="https://i.pravatar.cc/80?img=48" alt="large" />
		<Avatar.Fallback>SK</Avatar.Fallback>
	</Avatar>
</div>

```

## Fallback

Use a fallback when an image fails to load or is unavailable.

```svelte
<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
</script>

<Avatar>
	<Avatar.Fallback>SK</Avatar.Fallback>
</Avatar>

```

## Filter

Apply [SVG Filters](/docs/\[framework]/guides/cookbook/svg-filters) to avatar images.

```svelte
<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
</script>

<Avatar>
	<Avatar.Image src="https://i.pravatar.cc/150?img=48" class="filter-[url(#apollo)]" alt="filtered" />
	<Avatar.Fallback>SK</Avatar.Fallback>
</Avatar>

<svg class="absolute -left-full w-0 h-0">
	<filter id="apollo" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
		<feColorMatrix
			values="0.8 0.6 -0.4 0.1 0,
    0 1.2 0.05 0 0,
    0 -1 3 0.02 0,
    0 0 0 50 0"
			result="final"
			in="SourceGraphic"
		></feColorMatrix>
	</filter>
</svg>

```

## Anatomy

Here's an overview of how the Avatar component is structured in code:

```svelte
<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
</script>

<Avatar>
	<Avatar.Image />
	<Avatar.Fallback />
</Avatar>
```

## API Reference

### Root

| Prop           | Description                                                                                | Type                                                                       | Default |
| -------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------- |
| onStatusChange | Functional called when the image loading status changes.                                   | ((details: StatusChangeDetails) => void) \| undefined                      | -       |
| ids            | The ids of the elements in the avatar. Useful for composition.                             | Partial\<\{ root: string; image: string; fallback: string; }> \| undefined | -       |
| getRootNode    | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron. | (() => ShadowRoot \| Node \| Document) \| undefined                        | -       |
| dir            | The document's text/writing direction.                                                     | "ltr" \| "rtl" \| undefined                                                | "ltr"   |
| element        | Render the element yourself                                                                | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                           | -       |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => AvatarApi\<PropTypes>                      | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                     | Default |
| -------- | ----------- | ---------------------------------------- | ------- |
| children | -           | Snippet\<\[() => AvatarApi\<PropTypes>]> | -       |

### Image

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"img">]> \| undefined | -       |

### Fallback

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

# Carousel

Navigate through a collection of slides with controls and indicators.

```svelte
<script lang="ts">
	import { Carousel } from '@skeletonlabs/skeleton-svelte';

	const slides = [
		{ title: 'Slide 1' },
		{ title: 'Slide 2' },
		{ title: 'Slide 3' },
		{ title: 'Slide 4' },
		{ title: 'Slide 5' },
		{ title: 'Slide 6' },
		{ title: 'Slide 7' },
		{ title: 'Slide 8' },
		{ title: 'Slide 9' },
		{ title: 'Slide 10' },
	];
</script>

<Carousel slideCount={slides.length} slidesPerPage={3} spacing="16px" loop>
	<Carousel.Control class="flex justify-between mb-4">
		<Carousel.PrevTrigger class="btn preset-filled">
			<span>&larr;</span>
			<span>Back</span>
		</Carousel.PrevTrigger>
		<Carousel.AutoplayTrigger class="btn preset-tonal">Toggle Autoplay</Carousel.AutoplayTrigger>
		<Carousel.NextTrigger class="btn preset-filled">
			<span>Next</span>
			<span>&rarr;</span>
		</Carousel.NextTrigger>
	</Carousel.Control>
	<Carousel.ItemGroup>
		{#each slides as slide, i}
			<Carousel.Item index={i} class="card bg-surface-100-900 h-50 p-4 flex justify-center items-center">
				{slide.title}
			</Carousel.Item>
		{/each}
	</Carousel.ItemGroup>
	<Carousel.IndicatorGroup>
		<Carousel.Context>
			{#snippet children(carousel)}
				{#each carousel().pageSnapPoints as _, index}
					<Carousel.Indicator {index} />
				{/each}
			{/snippet}
		</Carousel.Context>
	</Carousel.IndicatorGroup>
</Carousel>

```

Breaking convention in Skeleton, some portions of this component are provided “headless”. Meaning no default styles are applied out of the box. This ensures you retain full control of styling for maximum flexibility.

## Overlapping Controls

Introduce supporting elements and styles to implement this variation.

```svelte
<script lang="ts">
	import { Carousel } from '@skeletonlabs/skeleton-svelte';

	const slides = [
		{ title: 'Slide 1' },
		{ title: 'Slide 2' },
		{ title: 'Slide 3' },
		{ title: 'Slide 4' },
		{ title: 'Slide 5' },
		{ title: 'Slide 6' },
		{ title: 'Slide 7' },
		{ title: 'Slide 8' },
		{ title: 'Slide 9' },
		{ title: 'Slide 10' },
	];
</script>

<Carousel slideCount={slides.length} slidesPerPage={4} spacing="16px" padding="48px" autoSize loop>
	<div class="relative">
		<Carousel.Control>
			<Carousel.PrevTrigger class="btn-icon preset-filled rounded-full absolute top-[50%] left-0 translate-y-[-50%]">
				<span>&larr;</span>
			</Carousel.PrevTrigger>
			<Carousel.NextTrigger class="btn-icon preset-filled rounded-full absolute top-[50%] right-0 translate-y-[-50%]">
				<span>&rarr;</span>
			</Carousel.NextTrigger>
		</Carousel.Control>
		<Carousel.ItemGroup>
			{#each slides as slide, i}
				<Carousel.Item index={i} class="card bg-surface-100-900 h-50 aspect-square p-4 flex justify-center items-center">
					{slide.title}
				</Carousel.Item>
			{/each}
		</Carousel.ItemGroup>
	</div>
	<Carousel.IndicatorGroup>
		<Carousel.Context>
			{#snippet children(carousel)}
				{#each carousel().pageSnapPoints as _, index}
					<Carousel.Indicator {index} />
				{/each}
			{/snippet}
		</Carousel.Context>
	</Carousel.IndicatorGroup>
</Carousel>

```

## Orientation

Apply `orientation="vertical"` on the root, and apply a set height on the `<Carousel.ItemGroup>`.

```svelte
<script lang="ts">
	import { Carousel } from '@skeletonlabs/skeleton-svelte';

	const slides = [
		{ title: 'Slide 1' },
		{ title: 'Slide 2' },
		{ title: 'Slide 3' },
		{ title: 'Slide 4' },
		{ title: 'Slide 5' },
		{ title: 'Slide 6' },
		{ title: 'Slide 7' },
		{ title: 'Slide 8' },
		{ title: 'Slide 9' },
		{ title: 'Slide 10' },
	];
</script>

<Carousel slideCount={slides.length} slidesPerPage={3} spacing="16px" loop orientation="vertical" autoSize>
	<Carousel.Control class="flex justify-between mb-4">
		<Carousel.PrevTrigger class="btn preset-filled">
			<span>&larr;</span>
			<span>Back</span>
		</Carousel.PrevTrigger>
		<Carousel.AutoplayTrigger class="btn preset-tonal">Toggle Autoplay</Carousel.AutoplayTrigger>
		<Carousel.NextTrigger class="btn preset-filled">
			<span>Next</span>
			<span>&rarr;</span>
		</Carousel.NextTrigger>
	</Carousel.Control>
	<Carousel.ItemGroup class="h-80">
		{#each slides as slide, i}
			<Carousel.Item index={i} class="card bg-surface-100-900/90 h-32 p-4 flex justify-center items-center">
				{slide.title}
			</Carousel.Item>
		{/each}
	</Carousel.ItemGroup>
	<Carousel.IndicatorGroup>
		<Carousel.Context>
			{#snippet children(carousel)}
				{#each carousel().pageSnapPoints as _, index}
					<Carousel.Indicator {index} />
				{/each}
			{/snippet}
		</Carousel.Context>
	</Carousel.IndicatorGroup>
</Carousel>

```

## Text

Display a text display of the carousel state.

```svelte
<script lang="ts">
	import { Carousel } from '@skeletonlabs/skeleton-svelte';

	const slides = [
		{ title: 'Slide 1' },
		{ title: 'Slide 2' },
		{ title: 'Slide 3' },
		{ title: 'Slide 4' },
		{ title: 'Slide 5' },
		{ title: 'Slide 6' },
		{ title: 'Slide 7' },
		{ title: 'Slide 8' },
		{ title: 'Slide 9' },
		{ title: 'Slide 10' },
	];
</script>

<Carousel slideCount={slides.length} slidesPerPage={3} spacing="16px" loop>
	<Carousel.Control class="flex justify-between mb-4">
		<Carousel.PrevTrigger class="btn preset-filled">
			<span>&larr;</span>
			<span>Back</span>
		</Carousel.PrevTrigger>
		<Carousel.AutoplayTrigger class="btn preset-tonal">Toggle Autoplay</Carousel.AutoplayTrigger>
		<Carousel.NextTrigger class="btn preset-filled">
			<span>Next</span>
			<span>&rarr;</span>
		</Carousel.NextTrigger>
	</Carousel.Control>
	<Carousel.ItemGroup>
		{#each slides as slide, i}
			<Carousel.Item index={i} class="card bg-surface-100-900 h-50 p-4 flex justify-center items-center">
				{slide.title}
			</Carousel.Item>
		{/each}
	</Carousel.ItemGroup>
	<Carousel.ProgressText class="mt-4 text-center font-bold">
		<Carousel.Context>
			{#snippet children(carousel)}
				<p>Showing {carousel().page + 1} of {carousel().pageSnapPoints.length}</p>
			{/snippet}
		</Carousel.Context>
	</Carousel.ProgressText>
</Carousel>

```

## Anatomy

Here's an overview of how the Carousel component is structured in code:

```svelte
<script lang="ts">
	import { Carousel } from '@skeletonlabs/skeleton-svelte';
</script>

<Carousel>
	<Carousel.Control>
		<Carousel.PrevTrigger />
		<Carousel.AutoplayTrigger />
		<Carousel.NextTrigger />
	</Carousel.Control>
	<Carousel.ItemGroup>
		<Carousel.Item />
	</Carousel.ItemGroup>
	<Carousel.IndicatorGroup>
		<Carousel.Indicator />
	</Carousel.IndicatorGroup>
	<Carousel.ProgressText />
</Carousel>
```

## API Reference

### Root

| Prop                   | Description                                                                                                                                                  | Type                                                                                                                                                                                                  | Default      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| ids                    | The ids of the elements in the carousel. Useful for composition.                                                                                             | Partial\<\{ root: string; item: (index: number) => string; itemGroup: string; nextTrigger: string; prevTrigger: string; indicatorGroup: string; indicator: (index: number) => string; }> \| undefined | -            |
| translations           | The localized messages to use.                                                                                                                               | IntlTranslations \| undefined                                                                                                                                                                         | -            |
| slidesPerPage          | The number of slides to show at a time.                                                                                                                      | number \| undefined                                                                                                                                                                                   | 1            |
| autoSize               | Whether to enable variable width slides.                                                                                                                     | boolean \| undefined                                                                                                                                                                                  | false        |
| slidesPerMove          | The number of slides to scroll at a time.&#xA;&#xA;When set to \`auto\`, the number of slides to scroll is determined by the&#xA;\`slidesPerPage\` property. | number \| "auto" \| undefined                                                                                                                                                                         | "auto"       |
| autoplay               | Whether to scroll automatically. The default delay is 4000ms.                                                                                                | boolean \| \{ delay: number; } \| undefined                                                                                                                                                           | false        |
| allowMouseDrag         | Whether to allow scrolling via dragging with mouse                                                                                                           | boolean \| undefined                                                                                                                                                                                  | false        |
| loop                   | Whether the carousel should loop around.                                                                                                                     | boolean \| undefined                                                                                                                                                                                  | false        |
| page                   | The controlled page of the carousel.                                                                                                                         | number \| undefined                                                                                                                                                                                   | -            |
| defaultPage            | The initial page to scroll to when rendered.&#xA;Use when you don't need to control the page of the carousel.                                                | number \| undefined                                                                                                                                                                                   | 0            |
| spacing                | The amount of space between items.                                                                                                                           | string \| undefined                                                                                                                                                                                   | "0px"        |
| padding                | Defines the extra space added around the scrollable area,&#xA;enabling nearby items to remain partially in view.                                             | string \| undefined                                                                                                                                                                                   | -            |
| onPageChange           | Function called when the page changes.                                                                                                                       | ((details: PageChangeDetails) => void) \| undefined                                                                                                                                                   | -            |
| inViewThreshold        | The threshold for determining if an item is in view.                                                                                                         | number \| number\[] \| undefined                                                                                                                                                                      | 0.6          |
| snapType               | The snap type of the item.                                                                                                                                   | "proximity" \| "mandatory" \| undefined                                                                                                                                                               | "mandatory"  |
| slideCount             | The total number of slides.&#xA;Useful for SSR to render the initial ating the snap points.                                                                  | number                                                                                                                                                                                                | -            |
| onDragStatusChange     | Function called when the drag status changes.                                                                                                                | ((details: DragStatusDetails) => void) \| undefined                                                                                                                                                   | -            |
| onAutoplayStatusChange | Function called when the autoplay status changes.                                                                                                            | ((details: AutoplayStatusDetails) => void) \| undefined                                                                                                                                               | -            |
| dir                    | The document's text/writing direction.                                                                                                                       | "ltr" \| "rtl" \| undefined                                                                                                                                                                           | "ltr"        |
| getRootNode            | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                                   | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                   | -            |
| orientation            | The orientation of the element.                                                                                                                              | "horizontal" \| "vertical" \| undefined                                                                                                                                                               | "horizontal" |
| element                | Render the element yourself                                                                                                                                  | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                      | -            |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => CarouselApi\<PropTypes>                    | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                       | Default |
| -------- | ----------- | ------------------------------------------ | ------- |
| children | -           | Snippet\<\[() => CarouselApi\<PropTypes>]> | -       |

### Control

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemGroup

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop      | Description                     | Type                                             | Default |
| --------- | ------------------------------- | ------------------------------------------------ | ------- |
| index     | The index of the item.          | number                                           | -       |
| snapAlign | The snap alignment of the item. | "start" \| "end" \| "center" \| undefined        | "start" |
| element   | Render the element yourself     | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### PrevTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### NextTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### AutoplayTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### IndicatorGroup

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Indicator

| Prop     | Description                         | Type                                                | Default |
| -------- | ----------------------------------- | --------------------------------------------------- | ------- |
| index    | The index of the indicator.         | number                                              | -       |
| readOnly | Whether the indicator is read only. | boolean \| undefined                                | false   |
| element  | Render the element yourself         | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### ProgressText

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Collapsible

A container that can be expanded or collapsed to show or hide content.

```svelte
<script lang="ts">
	import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
</script>

<Collapsible class="items-start card preset-filled-surface-100-900 p-4 w-56 mx-auto">
	<div class="w-full flex justify-between items-center">
		<p class="font-bold">Design System</p>
		<Collapsible.Trigger class="btn-icon hover:preset-tonal">
			<ArrowUpDownIcon class="size-4" />
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content class="flex flex-col gap-2">
		<nav class="contents">
			<a class="anchor" href="/docs/design/themes">Themes</a>
			<a class="anchor" href="/docs/design/colors">Colors</a>
			<a class="anchor" href="/docs/tailwind-utilities/presets">Presets</a>
			<a class="anchor" href="/docs/design/typography">Typography</a>
			<a class="anchor" href="/docs/design/spacing">Spacing</a>
			<a class="anchor" href="/docs/design/iconography">Iconography</a>
		</nav>
	</Collapsible.Content>
</Collapsible>

```

## Controlled

Control the active state of the component.

```svelte
<script lang="ts">
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';

	let open = $state(false);
</script>

<Collapsible {open} onOpenChange={(details) => (open = details.open)}>
	<Collapsible.Content>
		The world dies over and over again, but the skeleton always gets up and walks. Every heart has its own skeletons. The bones of the
		skeleton which support the body can become the bars of the cage which imprison the spirit.
	</Collapsible.Content>
	<Collapsible.Trigger class="btn preset-filled">Show {open ? 'Less' : 'More'}</Collapsible.Trigger>
</Collapsible>

```

## Indicator

Add a visual indicator to the toggle button.

```svelte
<script lang="ts">
	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
</script>

<Collapsible>
	<Collapsible.Content>
		The world dies over and over again, but the skeleton always gets up and walks. Every heart has its own skeletons. The bones of the
		skeleton which support the body can become the bars of the cage which imprison the spirit.
	</Collapsible.Content>
	<Collapsible.Trigger class="btn preset-filled">
		<span>Toggle</span>
		<Collapsible.Indicator class="group">
			<MinusIcon class="size-4 group-data-[state=open]:block hidden" />
			<PlusIcon class="size-4 group-data-[state=open]:hidden block" />
		</Collapsible.Indicator>
	</Collapsible.Trigger>
</Collapsible>

```

## Disabled

Set the disabled state for the component.

```svelte
<script lang="ts">
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
</script>

<Collapsible disabled>
	<Collapsible.Content>Hidden!</Collapsible.Content>
	<Collapsible.Trigger class="btn preset-filled">Toggle</Collapsible.Trigger>
</Collapsible>

```

## Alignment

Control the position and alignment of the trigger and content using flexbox `items-*`.

```svelte
<script lang="ts">
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
</script>

<Collapsible class="items-start">
	<Collapsible.Trigger class="btn preset-filled">Toggle</Collapsible.Trigger>
	<Collapsible.Content>
		The world dies over and over again, but the skeleton always gets up and walks. Every heart has its own skeletons. The bones of the
		skeleton which support the body can become the bars of the cage which imprison the spirit.
	</Collapsible.Content>
</Collapsible>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
</script>

<Collapsible dir="rtl">
	<Collapsible.Content>
		The world dies over and over again, but the skeleton always gets up and walks. Every heart has its own skeletons. The bones of the
		skeleton which support the body can become the bars of the cage which imprison the spirit.
	</Collapsible.Content>
	<Collapsible.Trigger class="btn preset-filled">Toggle</Collapsible.Trigger>
</Collapsible>

```

## Anatomy

Here's an overview of how the Collapsible component is structured in code:

```svelte
<script lang="ts">
	import { Collapsible } from '@skeletonlabs/skeleton-svelte';
</script>

<Collapsible>
	<Collapsible.Trigger />
	<Collapsible.Content />
</Collapsible>
```

## API Reference

### Root

| Prop            | Description                                                                                                                        | Type                                                                        | Default |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------- |
| ids             | The ids of the elements in the collapsible. Useful for composition.                                                                | Partial\<\{ root: string; content: string; trigger: string; }> \| undefined | -       |
| open            | The controlled open state of the collapsible.                                                                                      | boolean \| undefined                                                        | -       |
| defaultOpen     | The initial open state of the collapsible when rendered.&#xA;Use when you don't need to control the open state of the collapsible. | boolean \| undefined                                                        | -       |
| onOpenChange    | The callback invoked when the open state changes.                                                                                  | ((details: OpenChangeDetails) => void) \| undefined                         | -       |
| onExitComplete  | The callback invoked when the exit animation completes.                                                                            | VoidFunction \| undefined                                                   | -       |
| disabled        | Whether the collapsible is disabled.                                                                                               | boolean \| undefined                                                        | -       |
| collapsedHeight | The height of the content when collapsed.                                                                                          | string \| number \| undefined                                               | -       |
| collapsedWidth  | The width of the content when collapsed.                                                                                           | string \| number \| undefined                                               | -       |
| getRootNode     | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                         | (() => ShadowRoot \| Node \| Document) \| undefined                         | -       |
| dir             | The document's text/writing direction.                                                                                             | "ltr" \| "rtl" \| undefined                                                 | "ltr"   |
| element         | Render the element yourself                                                                                                        | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                            | -       |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => CollapsibleApi\<PropTypes>                 | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                          | Default |
| -------- | ----------- | --------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => CollapsibleApi\<PropTypes>]> | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Indicator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Combobox

A combobox is an input widget with an associated popup that enables users to select a value from a collection of possible values.

```svelte
<script lang="ts">
	import { Combobox, Portal, type ComboboxRootProps, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	let items = $state(data);

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	);

	const onOpenChange = () => {
		items = data;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = data.filter((item) => item.value.toLowerCase().includes(event.inputValue.toLowerCase()));
		if (filtered.length > 0) {
			items = filtered;
		} else {
			items = data;
		}
	};
</script>

<Combobox class="max-w-md" placeholder="Search..." {collection} {onOpenChange} {onInputValueChange}>
	<Combobox.Label>Label</Combobox.Label>
	<Combobox.Control>
		<Combobox.Input />
		<Combobox.Trigger />
	</Combobox.Control>
	<Combobox.ClearTrigger>Clear All</Combobox.ClearTrigger>
	<Portal>
		<Combobox.Positioner>
			<Combobox.Content>
				{#each items as item (item.value)}
					<Combobox.Item {item}>
						<Combobox.ItemText>{item.label}</Combobox.ItemText>
						<Combobox.ItemIndicator />
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>

```

## Groups

Organize items into categorized groups.

```svelte
<script lang="ts">
	import { Combobox, Portal, type ComboboxRootProps, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple', type: 'Fruits' },
		{ label: 'Banana', value: 'banana', type: 'Fruits' },
		{ label: 'Orange', value: 'orange', type: 'Fruits' },
		{ label: 'Carrot', value: 'carrot', type: 'Vegetables' },
		{ label: 'Broccoli', value: 'broccoli', type: 'Vegetables' },
		{ label: 'Spinach', value: 'spinach', type: 'Vegetables' },
	];

	let items = $state(data);

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
			groupBy: (item) => item.type,
		}),
	);

	const onOpenChange = () => {
		items = data;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = data.filter((item) => item.value.toLowerCase().includes(event.inputValue.toLowerCase()));
		if (filtered.length > 0) {
			items = filtered;
		} else {
			items = data;
		}
	};
</script>

<Combobox class="max-w-md" placeholder="Search..." {collection} {onOpenChange} {onInputValueChange}>
	<Combobox.Control>
		<Combobox.Input />
		<Combobox.Trigger />
	</Combobox.Control>
	<Portal>
		<Combobox.Positioner>
			<Combobox.Content>
				{#each collection.group() as [type, items] (type)}
					<Combobox.ItemGroup>
						<Combobox.ItemGroupLabel>{type}</Combobox.ItemGroupLabel>
						{#each items as item (item.value)}
							<Combobox.Item {item}>
								<Combobox.ItemText>{item.label}</Combobox.ItemText>
								<Combobox.ItemIndicator />
							</Combobox.Item>
						{/each}
					</Combobox.ItemGroup>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>

```

## Auto Highlight

Search for any option, then tap `Enter` on your keyboard to automatically select it.

```svelte
<script lang="ts">
	import { Combobox, Portal, type ComboboxRootProps, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	let items = $state(data);

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	);

	const onOpenChange = () => {
		items = data;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = data.filter((item) => item.value.toLowerCase().includes(event.inputValue.toLowerCase()));
		if (filtered.length > 0) {
			items = filtered;
		} else {
			items = data;
		}
	};
</script>

<Combobox class="max-w-md" placeholder="Search..." {collection} {onOpenChange} {onInputValueChange} inputBehavior="autohighlight">
	<Combobox.Control>
		<Combobox.Input />
		<Combobox.Trigger />
	</Combobox.Control>
	<Portal>
		<Combobox.Positioner>
			<Combobox.Content>
				{#each items as item (item.value)}
					<Combobox.Item {item}>
						<Combobox.ItemText>{item.label}</Combobox.ItemText>
						<Combobox.ItemIndicator />
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>

```

## Multiple

To maintain filtering functionality and improve clarity for users, we recommend displaying each selected value outside the perimeter of the Combobox component.

```svelte
<script lang="ts">
	import { Combobox, Portal, type ComboboxRootProps, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	let value: string[] = $state([]);
	let items = $state(data);

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	);

	const onOpenChange = () => {
		items = data;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = data.filter((item) => item.value.toLowerCase().includes(event.inputValue.toLowerCase()));
		if (filtered.length > 0) {
			items = filtered;
		} else {
			items = data;
		}
	};

	const onValueChange: ComboboxRootProps['onValueChange'] = (event) => {
		value = event.value;
	};
</script>

<div class="grid gap-2 w-full max-w-md">
	<Combobox placeholder="Search..." {collection} {onOpenChange} {onInputValueChange} {value} {onValueChange} multiple>
		<Combobox.Control>
			<Combobox.Input />
			<Combobox.Trigger />
		</Combobox.Control>
		<Portal>
			<Combobox.Positioner>
				<Combobox.Content>
					{#each items as item (item.value)}
						<Combobox.Item {item}>
							<Combobox.ItemText>{item.label}</Combobox.ItemText>
							<Combobox.ItemIndicator />
						</Combobox.Item>
					{/each}
				</Combobox.Content>
			</Combobox.Positioner>
		</Portal>
	</Combobox>
	<div class="flex flex-wrap gap-2">
		{#each value as item (item)}
			<span class="badge preset-filled">
				{item}
			</span>
		{/each}
	</div>
</div>

```

## Disabled Item

```svelte
<script lang="ts">
	import { Combobox, Portal, type ComboboxRootProps, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	let items = $state(data);

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
			isItemDisabled: (item) => item.value === 'banana',
		}),
	);

	const onOpenChange = () => {
		items = data;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = data.filter((item) => item.value.toLowerCase().includes(event.inputValue.toLowerCase()));
		if (filtered.length > 0) {
			items = filtered;
		} else {
			items = data;
		}
	};
</script>

<Combobox class="max-w-md" placeholder="Search..." {collection} {onOpenChange} {onInputValueChange}>
	<Combobox.Control>
		<Combobox.Input />
		<Combobox.Trigger />
	</Combobox.Control>
	<Portal>
		<Combobox.Positioner>
			<Combobox.Content>
				{#each items as item (item.value)}
					<Combobox.Item {item}>
						<Combobox.ItemText>{item.label}</Combobox.ItemText>
						<Combobox.ItemIndicator />
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>

```

## Custom Filter

Try mistyping `apple` or `banana` to see the custom filter using the fuzzy search from [Fuse.js](https://fusejs.io/) in action.

```svelte
<script lang="ts">
	import { Combobox, Portal, type ComboboxRootProps, useListCollection } from '@skeletonlabs/skeleton-svelte';
	import Fuse from 'fuse.js';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	const fuse = new Fuse(data, {
		keys: ['label', 'value'],
		threshold: 0.3,
	});

	let items = $state(data);

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	);

	const onOpenChange = () => {
		items = data;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const results = fuse.search(event.inputValue);
		if (results.length > 0) {
			items = results.map((result) => result.item);
		} else {
			items = data;
		}
	};
</script>

<Combobox class="max-w-md" placeholder="Search..." {collection} {onOpenChange} {onInputValueChange}>
	<Combobox.Control>
		<Combobox.Input />
		<Combobox.Trigger />
	</Combobox.Control>
	<Portal>
		<Combobox.Positioner>
			<Combobox.Content>
				{#each items as item (item.value)}
					<Combobox.Item {item}>
						<Combobox.ItemText>{item.label}</Combobox.ItemText>
						<Combobox.ItemIndicator />
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Combobox, Portal, type ComboboxRootProps, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	let items = $state(data);

	const collection = $derived(
		useListCollection({
			items: items,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	);

	const onOpenChange = () => {
		items = data;
	};

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		const filtered = data.filter((item) => item.value.toLowerCase().includes(event.inputValue.toLowerCase()));
		if (filtered.length > 0) {
			items = filtered;
		} else {
			items = data;
		}
	};
</script>

<Combobox class="max-w-md" placeholder="Search..." {collection} {onOpenChange} {onInputValueChange} dir="rtl">
	<Combobox.Label>Label</Combobox.Label>
	<Combobox.Control>
		<Combobox.Input />
		<Combobox.Trigger />
	</Combobox.Control>
	<Portal>
		<Combobox.Positioner>
			<Combobox.Content>
				{#each items as item (item.value)}
					<Combobox.Item {item}>
						<Combobox.ItemText>{item.label}</Combobox.ItemText>
						<Combobox.ItemIndicator />
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>

```

## Guidelines

### Z-Index

By default we do not take an opinionated stance regarding z-index stacking. The result is the component can sometimes be occluded beneath other elements with a higher index. The Z-Index can controlled by applying a utility class to the Content component part.

```svelte
<Combobox.Content class="z-50" />
```

### Max Items

We recommend no more than 500 items max. For normal usage, a few dozen will provide the best performance.

## Anatomy

Here's an overview of how the Combobox component is structured in code:

```svelte
<script lang="ts">
	import { Combobox, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Combobox>
	<Combobox.Label />
	<Combobox.Control>
		<Combobox.Input />
		<Combobox.Trigger />
		<Combobox.ClearTrigger />
	</Combobox.Control>
	<Portal>
		<Combobox.Positioner>
			<Combobox.Content>
				<Combobox.ItemGroup>
					<Combobox.ItemGroupLabel />
					<Combobox.Item>
						<Combobox.ItemText />
						<Combobox.ItemIndicator />
					</Combobox.Item>
				</Combobox.ItemGroup>
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>
```

## API Reference

### Root

| Prop                    | Description                                                                                                                                                                                                                                              | Type                                                                                                                                                                                                                                                                                                                           | Default                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| open                    | The controlled open state of the combobox                                                                                                                                                                                                                | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| defaultOpen             | The initial open state of the combobox when rendered.&#xA;Use when you don't need to control the open state of the combobox.                                                                                                                             | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| ids                     | The ids of the elements in the combobox. Useful for composition.                                                                                                                                                                                         | Partial\<\{ root: string; label: string; control: string; input: string; content: string; trigger: string; clearTrigger: string; item: (id: string, index?: number \| undefined) => string; positioner: string; itemGroup: (id: string \| number) => string; itemGroupLabel: (id: string \| number) => string; }> \| undefined | -                              |
| inputValue              | The controlled value of the combobox's input                                                                                                                                                                                                             | string \| undefined                                                                                                                                                                                                                                                                                                            | -                              |
| defaultInputValue       | The initial value of the combobox's input when rendered.&#xA;Use when you don't need to control the value of the combobox's input.                                                                                                                       | string \| undefined                                                                                                                                                                                                                                                                                                            | ""                             |
| name                    | The \`name\` attribute of the combobox's input. Useful for form submission                                                                                                                                                                               | string \| undefined                                                                                                                                                                                                                                                                                                            | -                              |
| form                    | The associate form of the combobox.                                                                                                                                                                                                                      | string \| undefined                                                                                                                                                                                                                                                                                                            | -                              |
| disabled                | Whether the combobox is disabled                                                                                                                                                                                                                         | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| readOnly                | Whether the combobox is readonly. This puts the combobox in a "non-editable" mode&#xA;but the user can still interact with it                                                                                                                            | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| invalid                 | Whether the combobox is invalid                                                                                                                                                                                                                          | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| required                | Whether the combobox is required                                                                                                                                                                                                                         | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| placeholder             | The placeholder text of the combobox's input                                                                                                                                                                                                             | string \| undefined                                                                                                                                                                                                                                                                                                            | -                              |
| defaultHighlightedValue | The initial highlighted value of the combobox when rendered.&#xA;Use when you don't need to control the highlighted value of the combobox.                                                                                                               | string \| null \| undefined                                                                                                                                                                                                                                                                                                    | -                              |
| highlightedValue        | The controlled highlighted value of the combobox                                                                                                                                                                                                         | string \| null \| undefined                                                                                                                                                                                                                                                                                                    | -                              |
| value                   | The controlled value of the combobox's selected items                                                                                                                                                                                                    | string\[] \| undefined                                                                                                                                                                                                                                                                                                         | -                              |
| defaultValue            | The initial value of the combobox's selected items when rendered.&#xA;Use when you don't need to control the value of the combobox's selected items.                                                                                                     | string\[] \| undefined                                                                                                                                                                                                                                                                                                         | \[]                            |
| inputBehavior           | Defines the auto-completion behavior of the combobox.&#xA;&#xA;- \`autohighlight\`: The first focused item is highlighted as the user types&#xA;- \`autocomplete\`: Navigating the listbox with the arrow keys selects the item and the input is updated | "autohighlight" \| "autocomplete" \| "none" \| undefined                                                                                                                                                                                                                                                                       | "none"                         |
| selectionBehavior       | The behavior of the combobox input when an item is selected&#xA;&#xA;- \`replace\`: The selected item string is set as the input value&#xA;- \`clear\`: The input value is cleared&#xA;- \`preserve\`: The input value is preserved                      | "clear" \| "replace" \| "preserve" \| undefined                                                                                                                                                                                                                                                                                | "replace"                      |
| autoFocus               | Whether to autofocus the input on mount                                                                                                                                                                                                                  | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| openOnClick             | Whether to open the combobox popup on initial click on the input                                                                                                                                                                                         | boolean \| undefined                                                                                                                                                                                                                                                                                                           | false                          |
| openOnChange            | Whether to show the combobox when the input value changes                                                                                                                                                                                                | boolean \| ((details: InputValueChangeDetails) => boolean) \| undefined                                                                                                                                                                                                                                                        | true                           |
| allowCustomValue        | Whether to allow typing custom values in the input                                                                                                                                                                                                       | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| alwaysSubmitOnEnter     | Whether to always submit on Enter key press, even if popup is open.&#xA;Useful for single-field autocomplete forms where Enter should submit the form.                                                                                                   | boolean \| undefined                                                                                                                                                                                                                                                                                                           | false                          |
| loopFocus               | Whether to loop the keyboard navigation through the items                                                                                                                                                                                                | boolean \| undefined                                                                                                                                                                                                                                                                                                           | true                           |
| positioning             | The positioning options to dynamically position the menu                                                                                                                                                                                                 | PositioningOptions \| undefined                                                                                                                                                                                                                                                                                                | \{ placement: "bottom-start" } |
| onInputValueChange      | Function called when the input's value changes                                                                                                                                                                                                           | ((details: InputValueChangeDetails) => void) \| undefined                                                                                                                                                                                                                                                                      | -                              |
| onValueChange           | Function called when a new item is selected                                                                                                                                                                                                              | ((details: ValueChangeDetails\<any>) => void) \| undefined                                                                                                                                                                                                                                                                     | -                              |
| onHighlightChange       | Function called when an item is highlighted using the pointer&#xA;or keyboard navigation.                                                                                                                                                                | ((details: HighlightChangeDetails\<any>) => void) \| undefined                                                                                                                                                                                                                                                                 | -                              |
| onSelect                | Function called when an item is selected                                                                                                                                                                                                                 | ((details: SelectionDetails) => void) \| undefined                                                                                                                                                                                                                                                                             | -                              |
| onOpenChange            | Function called when the popup is opened                                                                                                                                                                                                                 | ((details: OpenChangeDetails) => void) \| undefined                                                                                                                                                                                                                                                                            | -                              |
| translations            | Specifies the localized strings that identifies the accessibility elements and their states                                                                                                                                                              | IntlTranslations \| undefined                                                                                                                                                                                                                                                                                                  | -                              |
| collection              | The collection of items                                                                                                                                                                                                                                  | ListCollection\<any> \| undefined                                                                                                                                                                                                                                                                                              | -                              |
| multiple                | Whether to allow multiple selection.&#xA;&#xA;\*\*Good to know:\*\* When \`multiple\` is \`true\`, the \`selectionBehavior\` is automatically set to \`clear\`.&#xA;It is recommended to render the selected items in a separate container.              | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| closeOnSelect           | Whether to close the combobox when an item is selected.                                                                                                                                                                                                  | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| openOnKeyPress          | Whether to open the combobox on arrow key press                                                                                                                                                                                                          | boolean \| undefined                                                                                                                                                                                                                                                                                                           | true                           |
| scrollToIndexFn         | Function to scroll to a specific index                                                                                                                                                                                                                   | ((details: ScrollToIndexDetails) => void) \| undefined                                                                                                                                                                                                                                                                         | -                              |
| composite               | Whether the combobox is a composed with other composite widgets like tabs                                                                                                                                                                                | boolean \| undefined                                                                                                                                                                                                                                                                                                           | true                           |
| disableLayer            | Whether to disable registering this a dismissable layer                                                                                                                                                                                                  | boolean \| undefined                                                                                                                                                                                                                                                                                                           | -                              |
| navigate                | Function to navigate to the selected item                                                                                                                                                                                                                | ((details: NavigateDetails) => void) \| null \| undefined                                                                                                                                                                                                                                                                      | -                              |
| dir                     | The document's text/writing direction.                                                                                                                                                                                                                   | "ltr" \| "rtl" \| undefined                                                                                                                                                                                                                                                                                                    | "ltr"                          |
| getRootNode             | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                                                                                                                               | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                                                                                                                                            | -                              |
| onPointerDownOutside    | Function called when the pointer is pressed down outside the component                                                                                                                                                                                   | ((event: PointerDownOutsideEvent) => void) \| undefined                                                                                                                                                                                                                                                                        | -                              |
| onFocusOutside          | Function called when the focus is moved outside the component                                                                                                                                                                                            | ((event: FocusOutsideEvent) => void) \| undefined                                                                                                                                                                                                                                                                              | -                              |
| onInteractOutside       | Function called when an interaction happens outside the component                                                                                                                                                                                        | ((event: InteractOutsideEvent) => void) \| undefined                                                                                                                                                                                                                                                                           | -                              |
| element                 | Render the element yourself                                                                                                                                                                                                                              | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                                                                                                                                               | -                              |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => ComboboxApi\<PropTypes, any>               | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                            | Default |
| -------- | ----------- | ----------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => ComboboxApi\<PropTypes, any>]> | -       |

### Label

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### Control

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Input

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### ClearTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Positioner

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                            | Default |
| ------- | --------------------------- | ----------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"ul">]> \| undefined | -       |

### ItemGroup

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemGroupLabel

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop         | Description                                                 | Type                                            | Default |
| ------------ | ----------------------------------------------------------- | ----------------------------------------------- | ------- |
| persistFocus | Whether hovering outside should clear the highlighted state | boolean \| undefined                            | -       |
| item         | The item to render                                          | any                                             | -       |
| element      | Render the element yourself                                 | Snippet\<\[HTMLAttributes\<"li">]> \| undefined | -       |

### ItemText

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### ItemIndicator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Date Picker

Select dates from a calendar interface.

```svelte
<script lang="ts">
	import { DatePicker, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<DatePicker>
	<DatePicker.Label>Choose Date</DatePicker.Label>
	<DatePicker.Control>
		<DatePicker.Input placeholder="mm/dd/yyyy" />
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.View view="day">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableHead>
									<DatePicker.TableRow>
										{#each datePicker().weekDays as weekDay, id (id)}
											<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
										{/each}
									</DatePicker.TableRow>
								</DatePicker.TableHead>
								<DatePicker.TableBody>
									{#each datePicker().weeks as week, id (id)}
										<DatePicker.TableRow>
											{#each week as day, id (id)}
												<DatePicker.TableCell value={day}>
													<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="month">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
										<DatePicker.TableRow>
											{#each months as month, id (id)}
												<DatePicker.TableCell value={month.value}>
													<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="year">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
										<DatePicker.TableRow>
											{#each years as year, id (id)}
												<DatePicker.TableCell value={year.value}>
													<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>

```

## Usage

Given the scale and scope of the Date Picker component, consider implementing within a local component to add a layer of abstraction. Then utlize the props and event handlers to pass data to and from the component respectively.

## Controlled

Manage the selected date value with controlled state.

```svelte
<script lang="ts">
	import { DatePicker, parseDate, Portal } from '@skeletonlabs/skeleton-svelte';

	let value = $state([parseDate('2025-10-15')]);
</script>

<DatePicker {value} onValueChange={(e) => (value = e.value)}>
	<DatePicker.Label>Picked date: {value.at(0)?.toString()}</DatePicker.Label>
	<DatePicker.Control>
		<DatePicker.Input placeholder="mm/dd/yyyy" />
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.View view="day">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableHead>
									<DatePicker.TableRow>
										{#each datePicker().weekDays as weekDay, id (id)}
											<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
										{/each}
									</DatePicker.TableRow>
								</DatePicker.TableHead>
								<DatePicker.TableBody>
									{#each datePicker().weeks as week, id (id)}
										<DatePicker.TableRow>
											{#each week as day, id (id)}
												<DatePicker.TableCell value={day}>
													<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="month">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
										<DatePicker.TableRow>
											{#each months as month, id (id)}
												<DatePicker.TableCell value={month.value}>
													<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="year">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
										<DatePicker.TableRow>
											{#each years as year, id (id)}
												<DatePicker.TableCell value={year.value}>
													<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>

```

## Disabled

Disable the date picker to prevent user interaction.

```svelte
<script lang="ts">
	import { DatePicker, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<DatePicker disabled>
	<DatePicker.Label>Choose Date</DatePicker.Label>
	<DatePicker.Control>
		<DatePicker.Input placeholder="mm/dd/yyyy" />
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.View view="day">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableHead>
									<DatePicker.TableRow>
										{#each datePicker().weekDays as weekDay, id (id)}
											<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
										{/each}
									</DatePicker.TableRow>
								</DatePicker.TableHead>
								<DatePicker.TableBody>
									{#each datePicker().weeks as week, id (id)}
										<DatePicker.TableRow>
											{#each week as day, id (id)}
												<DatePicker.TableCell value={day}>
													<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="month">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
										<DatePicker.TableRow>
											{#each months as month, id (id)}
												<DatePicker.TableCell value={month.value}>
													<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="year">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
										<DatePicker.TableRow>
											{#each years as year, id (id)}
												<DatePicker.TableCell value={year.value}>
													<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>

```

## Minimum and Maximum

Restrict date selection to a specific range using the `min` and `max` props with the `parseDate` helper function.

```svelte
<script lang="ts">
	import { DatePicker, parseDate, Portal } from '@skeletonlabs/skeleton-svelte';

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
</script>

<DatePicker min={parseDate(`${currentYear}-01-01`)} max={parseDate(`${currentYear}-12-31`)}>
	<DatePicker.Label>Choose Date</DatePicker.Label>
	<DatePicker.Control>
		<DatePicker.Input placeholder="mm/dd/yyyy" />
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.View view="day">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableHead>
									<DatePicker.TableRow>
										{#each datePicker().weekDays as weekDay, id (id)}
											<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
										{/each}
									</DatePicker.TableRow>
								</DatePicker.TableHead>
								<DatePicker.TableBody>
									{#each datePicker().weeks as week, id (id)}
										<DatePicker.TableRow>
											{#each week as day, id (id)}
												<DatePicker.TableCell value={day}>
													<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="month">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
										<DatePicker.TableRow>
											{#each months as month, id (id)}
												<DatePicker.TableCell value={month.value}>
													<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="year">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
										<DatePicker.TableRow>
											{#each years as year, id (id)}
												<DatePicker.TableCell value={year.value}>
													<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>

```

## Range Selection

Enable range selection by setting `selectionMode="range"` on the root component. Pair with two inputs fields:

* `index={0}` to represent the start dates.
* `index={1}` to represent the end dates.

```svelte
<script lang="ts">
	import { DatePicker, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<DatePicker selectionMode="range">
	<DatePicker.Label>Select Date Range</DatePicker.Label>
	<DatePicker.Control>
		<DatePicker.Input index={0} placeholder="Start date..." />
		<DatePicker.Input index={1} placeholder="End date..." />
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.View view="day">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableHead>
									<DatePicker.TableRow>
										{#each datePicker().weekDays as weekDay, id (id)}
											<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
										{/each}
									</DatePicker.TableRow>
								</DatePicker.TableHead>
								<DatePicker.TableBody>
									{#each datePicker().weeks as week, id (id)}
										<DatePicker.TableRow>
											{#each week as day, id (id)}
												<DatePicker.TableCell value={day}>
													<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="month">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
										<DatePicker.TableRow>
											{#each months as month, id (id)}
												<DatePicker.TableCell value={month.value}>
													<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="year">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
										<DatePicker.TableRow>
											{#each years as year, id (id)}
												<DatePicker.TableCell value={year.value}>
													<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>

```

### Presets

Use the `PresetTrigger` component to allow users to quickly select predefined date ranges.

```svelte
<script lang="ts">
	import { DatePicker, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<DatePicker selectionMode="range">
	<DatePicker.Label>Select Date Range</DatePicker.Label>
	<DatePicker.Control>
		<DatePicker.Input index={0} placeholder="Start date..." />
		<DatePicker.Input index={1} placeholder="End date..." />
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.View view="day">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<div class="flex gap-2">
								<DatePicker.PresetTrigger value="last3Days">Last 3 Days</DatePicker.PresetTrigger>
								<DatePicker.PresetTrigger value="last7Days">Last 7 Days</DatePicker.PresetTrigger>
								<DatePicker.PresetTrigger value="last30Days">Last 30 Days</DatePicker.PresetTrigger>
							</div>
							<DatePicker.Table>
								<DatePicker.TableHead>
									<DatePicker.TableRow>
										{#each datePicker().weekDays as weekDay, id (id)}
											<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
										{/each}
									</DatePicker.TableRow>
								</DatePicker.TableHead>
								<DatePicker.TableBody>
									{#each datePicker().weeks as week, id (id)}
										<DatePicker.TableRow>
											{#each week as day, id (id)}
												<DatePicker.TableCell value={day}>
													<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="month">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
										<DatePicker.TableRow>
											{#each months as month, id (id)}
												<DatePicker.TableCell value={month.value}>
													<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="year">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
										<DatePicker.TableRow>
											{#each years as year, id (id)}
												<DatePicker.TableCell value={year.value}>
													<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>

```

## Inline calendar

Display the calendar inline without a popover by adding the `inline` prop to the root component. When using inline mode, omit the `Portal` and `Positioner` components.

```svelte
<script lang="ts">
	import { DatePicker } from '@skeletonlabs/skeleton-svelte';
</script>

<DatePicker inline>
	<DatePicker.Label>Choose Date</DatePicker.Label>
	<DatePicker.Content>
		<DatePicker.View view="day">
			<DatePicker.Context>
				{#snippet children(datePicker)}
					<DatePicker.ViewControl>
						<DatePicker.PrevTrigger />
						<DatePicker.ViewTrigger>
							<DatePicker.RangeText />
						</DatePicker.ViewTrigger>
						<DatePicker.NextTrigger />
					</DatePicker.ViewControl>
					<DatePicker.Table>
						<DatePicker.TableHead>
							<DatePicker.TableRow>
								{#each datePicker().weekDays as weekDay, id (id)}
									<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
								{/each}
							</DatePicker.TableRow>
						</DatePicker.TableHead>
						<DatePicker.TableBody>
							{#each datePicker().weeks as week, id (id)}
								<DatePicker.TableRow>
									{#each week as day, id (id)}
										<DatePicker.TableCell value={day}>
											<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
										</DatePicker.TableCell>
									{/each}
								</DatePicker.TableRow>
							{/each}
						</DatePicker.TableBody>
					</DatePicker.Table>
				{/snippet}
			</DatePicker.Context>
		</DatePicker.View>
		<DatePicker.View view="month">
			<DatePicker.Context>
				{#snippet children(datePicker)}
					<DatePicker.ViewControl>
						<DatePicker.PrevTrigger />
						<DatePicker.ViewTrigger>
							<DatePicker.RangeText />
						</DatePicker.ViewTrigger>
						<DatePicker.NextTrigger />
					</DatePicker.ViewControl>
					<DatePicker.Table>
						<DatePicker.TableBody>
							{#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
								<DatePicker.TableRow>
									{#each months as month, id (id)}
										<DatePicker.TableCell value={month.value}>
											<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
										</DatePicker.TableCell>
									{/each}
								</DatePicker.TableRow>
							{/each}
						</DatePicker.TableBody>
					</DatePicker.Table>
				{/snippet}
			</DatePicker.Context>
		</DatePicker.View>
		<DatePicker.View view="year">
			<DatePicker.Context>
				{#snippet children(datePicker)}
					<DatePicker.ViewControl>
						<DatePicker.PrevTrigger />
						<DatePicker.ViewTrigger>
							<DatePicker.RangeText />
						</DatePicker.ViewTrigger>
						<DatePicker.NextTrigger />
					</DatePicker.ViewControl>
					<DatePicker.Table>
						<DatePicker.TableBody>
							{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
								<DatePicker.TableRow>
									{#each years as year, id (id)}
										<DatePicker.TableCell value={year.value}>
											<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
										</DatePicker.TableCell>
									{/each}
								</DatePicker.TableRow>
							{/each}
						</DatePicker.TableBody>
					</DatePicker.Table>
				{/snippet}
			</DatePicker.Context>
		</DatePicker.View>
	</DatePicker.Content>
</DatePicker>

```

## Month and Year Selection

Add `MonthSelect` and `YearSelect` components to provide selectors for quickly changing the month and year.

```svelte
<script lang="ts">
	import { DatePicker, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<DatePicker>
	<DatePicker.Label>Choose Date</DatePicker.Label>
	<DatePicker.Control>
		<DatePicker.Input placeholder="mm/dd/yyyy" />
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.YearSelect />
				<DatePicker.MonthSelect />
				<DatePicker.View view="day">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger disabled>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableHead>
									<DatePicker.TableRow>
										{#each datePicker().weekDays as weekDay, id (id)}
											<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
										{/each}
									</DatePicker.TableRow>
								</DatePicker.TableHead>
								<DatePicker.TableBody>
									{#each datePicker().weeks as week, id (id)}
										<DatePicker.TableRow>
											{#each week as day, id (id)}
												<DatePicker.TableCell value={day}>
													<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="month">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getMonthsGrid({ columns: 4, format: 'short' }) as months, id (id)}
										<DatePicker.TableRow>
											{#each months as month, id (id)}
												<DatePicker.TableCell value={month.value}>
													<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="year">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
										<DatePicker.TableRow>
											{#each years as year, id (id)}
												<DatePicker.TableCell value={year.value}>
													<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>

```

## Anatomy

Here's an overview of how the DatePicker component is structured in code:

```svelte
<script lang="ts">
	import { DatePicker, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<DatePicker>
	<DatePicker.Label />
	<DatePicker.Control>
		<DatePicker.Input />
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.YearSelect />
				<DatePicker.MonthSelect />
				<DatePicker.View>
					<DatePicker.ViewControl>
						<DatePicker.PrevTrigger />
						<DatePicker.ViewTrigger>
							<DatePicker.RangeText />
						</DatePicker.ViewTrigger>
						<DatePicker.NextTrigger />
					</DatePicker.ViewControl>
					<DatePicker.Table>
						<DatePicker.TableHead>
							<DatePicker.TableRow>
								<DatePicker.TableHeader />
							</DatePicker.TableRow>
						</DatePicker.TableHead>
						<DatePicker.TableBody>
							<DatePicker.TableRow>
								<DatePicker.TableCell>
									<DatePicker.TableCellTrigger />
								</DatePicker.TableCell>
							</DatePicker.TableRow>
						</DatePicker.TableBody>
					</DatePicker.Table>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>
```

## API Reference

### Root

| Prop                 | Description                                                                                                                                                                                             | Type                                                                                                                                                                                                                                                      | Default  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| locale               | The locale (BCP 47 language tag) to use when formatting the date.                                                                                                                                       | string \| undefined                                                                                                                                                                                                                                       | "en-US"  |
| createCalendar       | A function that creates a Calendar object for a given calendar identifier.&#xA;Enables non-Gregorian calendar support (Persian, Buddhist, Islamic, etc.)&#xA;without bundling all calendars by default. | ((identifier: CalendarIdentifier) => Calendar) \| undefined                                                                                                                                                                                               | -        |
| translations         | The localized messages to use.                                                                                                                                                                          | IntlTranslations \| undefined                                                                                                                                                                                                                             | -        |
| ids                  | The ids of the elements in the date picker. Useful for composition.                                                                                                                                     | Partial\<\{ root: string; label: (index: number) => string; table: (id: string) => string; tableHeader: (id: string) => string; tableBody: (id: string) => string; tableRow: (id: string) => string; ... 11 more ...; positioner: string; }> \| undefined | -        |
| name                 | The \`name\` attribute of the input element.                                                                                                                                                            | string \| undefined                                                                                                                                                                                                                                       | -        |
| timeZone             | The time zone to use                                                                                                                                                                                    | string \| undefined                                                                                                                                                                                                                                       | "UTC"    |
| disabled             | Whether the calendar is disabled.                                                                                                                                                                       | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| readOnly             | Whether the calendar is read-only.                                                                                                                                                                      | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| required             | Whether the date picker is required                                                                                                                                                                     | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| invalid              | Whether the date picker is invalid                                                                                                                                                                      | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| outsideDaySelectable | Whether day outside the visible range can be selected.                                                                                                                                                  | boolean \| undefined                                                                                                                                                                                                                                      | false    |
| min                  | The minimum date that can be selected.                                                                                                                                                                  | DateValue \| undefined                                                                                                                                                                                                                                    | -        |
| max                  | The maximum date that can be selected.                                                                                                                                                                  | DateValue \| undefined                                                                                                                                                                                                                                    | -        |
| closeOnSelect        | Whether the calendar should close after the date selection is complete.&#xA;This is ignored when the selection mode is \`multiple\`.                                                                    | boolean \| undefined                                                                                                                                                                                                                                      | true     |
| openOnClick          | Whether to open the calendar when the input is clicked.                                                                                                                                                 | boolean \| undefined                                                                                                                                                                                                                                      | false    |
| value                | The controlled selected date(s).                                                                                                                                                                        | DateValue\[] \| undefined                                                                                                                                                                                                                                 | -        |
| defaultValue         | The initial selected date(s) when rendered.&#xA;Use when you don't need to control the selected date(s) of the date picker.                                                                             | DateValue\[] \| undefined                                                                                                                                                                                                                                 | -        |
| focusedValue         | The controlled focused date.                                                                                                                                                                            | DateValue \| undefined                                                                                                                                                                                                                                    | -        |
| defaultFocusedValue  | The initial focused date when rendered.&#xA;Use when you don't need to control the focused date of the date picker.                                                                                     | DateValue \| undefined                                                                                                                                                                                                                                    | -        |
| numOfMonths          | The number of months to display.                                                                                                                                                                        | number \| undefined                                                                                                                                                                                                                                       | -        |
| startOfWeek          | The first day of the week.&#xA; \`0\` - Sunday&#xA; \`1\` - Monday&#xA; \`2\` - Tuesday&#xA; \`3\` - Wednesday&#xA; \`4\` - Thursday&#xA; \`5\` - Friday&#xA; \`6\` - Saturday                          | number \| undefined                                                                                                                                                                                                                                       | -        |
| fixedWeeks           | Whether the calendar should have a fixed number of weeks.&#xA;This renders the calendar with 6 weeks instead of 5 or 6.                                                                                 | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| showWeekNumbers      | Whether to show the week number column in the day view.                                                                                                                                                 | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| onValueChange        | Function called when the value changes.                                                                                                                                                                 | ((details: ValueChangeDetails) => void) \| undefined                                                                                                                                                                                                      | -        |
| onFocusChange        | Function called when the focused date changes.                                                                                                                                                          | ((details: FocusChangeDetails) => void) \| undefined                                                                                                                                                                                                      | -        |
| onViewChange         | Function called when the view changes.                                                                                                                                                                  | ((details: ViewChangeDetails) => void) \| undefined                                                                                                                                                                                                       | -        |
| onVisibleRangeChange | Function called when the visible range changes.                                                                                                                                                         | ((details: VisibleRangeChangeDetails) => void) \| undefined                                                                                                                                                                                               | -        |
| onOpenChange         | Function called when the calendar opens or closes.                                                                                                                                                      | ((details: OpenChangeDetails) => void) \| undefined                                                                                                                                                                                                       | -        |
| isDateUnavailable    | Returns whether a date of the calendar is available.                                                                                                                                                    | ((date: DateValue, locale: string) => boolean) \| undefined                                                                                                                                                                                               | -        |
| selectionMode        | The selection mode of the calendar.&#xA;- \`single\` - only one date can be selected&#xA;- \`multiple\` - multiple dates can be selected&#xA;- \`range\` - a range of dates can be selected             | SelectionMode \| undefined                                                                                                                                                                                                                                | "single" |
| maxSelectedDates     | The maximum number of dates that can be selected.&#xA;This is only applicable when \`selectionMode\` is \`multiple\`.                                                                                   | number \| undefined                                                                                                                                                                                                                                       | -        |
| format               | The format of the date to display in the input.                                                                                                                                                         | ((date: DateValue, details: LocaleDetails) => string) \| undefined                                                                                                                                                                                        | -        |
| parse                | Function to parse the date from the input back to a DateValue.                                                                                                                                          | ((value: string, details: LocaleDetails) => DateValue \| undefined) \| undefined                                                                                                                                                                          | -        |
| placeholder          | The placeholder text to display in the input.                                                                                                                                                           | string \| undefined                                                                                                                                                                                                                                       | -        |
| view                 | The view of the calendar                                                                                                                                                                                | DateView \| undefined                                                                                                                                                                                                                                     | -        |
| defaultView          | The default view of the calendar                                                                                                                                                                        | DateView \| undefined                                                                                                                                                                                                                                     | "day"    |
| minView              | The minimum view of the calendar                                                                                                                                                                        | DateView \| undefined                                                                                                                                                                                                                                     | "day"    |
| maxView              | The maximum view of the calendar                                                                                                                                                                        | DateView \| undefined                                                                                                                                                                                                                                     | "year"   |
| positioning          | The user provided options used to position the date picker content                                                                                                                                      | PositioningOptions \| undefined                                                                                                                                                                                                                           | -        |
| open                 | The controlled open state of the date picker                                                                                                                                                            | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| defaultOpen          | The initial open state of the date picker when rendered.&#xA;Use when you don't need to control the open state of the date picker.                                                                      | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| inline               | Whether to render the date picker inline                                                                                                                                                                | boolean \| undefined                                                                                                                                                                                                                                      | -        |
| dir                  | The document's text/writing direction.                                                                                                                                                                  | "ltr" \| "rtl" \| undefined                                                                                                                                                                                                                               | "ltr"    |
| getRootNode          | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                                                                              | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                                                                       | -        |
| element              | Render the element yourself                                                                                                                                                                             | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                                                                          | -        |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => DatePickerApi\<PropTypes>                  | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                         | Default |
| -------- | ----------- | -------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => DatePickerApi\<PropTypes>]> | -       |

### Label

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### Control

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### PresetTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| value   | -                           | PresetTriggerValue                                  | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Input

| Prop      | Description                             | Type                                               | Default |
| --------- | --------------------------------------- | -------------------------------------------------- | ------- |
| index     | The index of the input to focus.        | number \| undefined                                | -       |
| fixOnBlur | Whether to fix the input value on blur. | boolean \| undefined                               | true    |
| element   | Render the element yourself             | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Positioner

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### YearSelect

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"select">]> \| undefined | -       |

### MonthSelect

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"select">]> \| undefined | -       |

### View

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| view    | -                           | DateView \| undefined                            | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ViewControl

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### PrevTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### ViewTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### RangeText

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### NextTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Table

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"table">]> \| undefined | -       |

### TableHead

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"thead">]> \| undefined | -       |

### TableRow

| Prop    | Description                 | Type                                            | Default |
| ------- | --------------------------- | ----------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"tr">]> \| undefined | -       |

### TableHeader

| Prop    | Description                 | Type                                            | Default |
| ------- | --------------------------- | ----------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"th">]> \| undefined | -       |

### TableBody

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"tbody">]> \| undefined | -       |

### TableCell

| Prop         | Description                 | Type                                            | Default |
| ------------ | --------------------------- | ----------------------------------------------- | ------- |
| disabled     | -                           | boolean \| undefined                            | -       |
| value        | -                           | number \| DateValue                             | -       |
| columns      | -                           | number \| undefined                             | -       |
| visibleRange | -                           | VisibleRange \| undefined                       | -       |
| element      | Render the element yourself | Snippet\<\[HTMLAttributes\<"td">]> \| undefined | -       |

### TableCellTrigger

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Dialog

A modal dialog for displaying content and actions.

```svelte
<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';

	// The following animation is optional.
	// This may also be included inline.
	const animation =
		'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';
</script>

<Dialog>
	<Dialog.Trigger class="btn preset-filled">Trigger</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
			<Dialog.Content class="card bg-surface-100-900 w-full max-w-xl p-4 space-y-4 shadow-xl {animation}">
				<header class="flex justify-between items-center">
					<Dialog.Title class="text-lg font-bold">Hello Skeleton</Dialog.Title>
					<Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
						<XIcon class="size-4" />
					</Dialog.CloseTrigger>
				</header>
				<Dialog.Description>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</Dialog.Description>
				<footer class="flex justify-end gap-2">
					<Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
					<button type="button" class="btn preset-filled">Save</button>
				</footer>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>

```

Breaking convention in Skeleton, this component is provided "headless". Meaning no default styles are applied out of the box. This ensures you retain full control of all styling for maximum flexibility.

## Alert Dialog

The [alertdialog](https://w3c.github.io/aria/#alertdialog) role enables assistive technologies and browsers to distinguish alert dialogs from other dialogs so they have the option of giving alert dialogs special treatment, such as playing a system alert sound.

```svelte
<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Dialog role="alertdialog">
	<Dialog.Trigger class="btn preset-filled">Trigger</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-error-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center">
			<Dialog.Content class="card preset-filled-error-500 w-md p-4 space-y-2 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">Alert</Dialog.Title>
				<Dialog.Description>Something important has happened!</Dialog.Description>
				<Dialog.CloseTrigger class="btn preset-tonal-error">Close</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>

```

## Interaction

If desired, you can disable click to close interactions for the backdrop.

> TIP: use this sparingly, as this can trap users in this experience without a dedicated close action.

```svelte
<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Dialog closeOnInteractOutside={false}>
	<Dialog.Trigger class="btn preset-filled">Trigger</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center">
			<Dialog.Content class="card bg-surface-100-900 w-md p-4 space-y-2 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">Dialog Title</Dialog.Title>
				<Dialog.Description>This dialog will only close with the Close button or via programmatic controls.</Dialog.Description>
				<Dialog.CloseTrigger class="btn preset-tonal">Close</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>

```

## Drawer

This example repurposes the Dialog for use as a side-panel Drawer. This pairs well with the [Navigation Sidebar](/docs/svelte/framework-components/navigation#sidebar).

```svelte
<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';

	// The following animations are optional.
	// These may also be included inline.
	const animBackdrop = 'transition transition-discrete opacity-0 starting:data-[state=open]:opacity-0 data-[state=open]:opacity-100';
	const animModal =
		'transition transition-discrete opacity-0 -translate-x-full starting:data-[state=open]:opacity-0 starting:data-[state=open]:-translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0';
</script>

<Dialog>
	<Dialog.Trigger class="btn preset-filled">Trigger</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50 transition transition-discrete {animBackdrop}" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-start">
			<Dialog.Content class="h-screen card bg-surface-100-900 w-sm p-4 space-y-4 shadow-xl {animModal}">
				<header class="flex justify-between items-center">
					<Dialog.Title class="text-2xl font-bold">Drawer</Dialog.Title>
					<Dialog.CloseTrigger class="btn-icon preset-tonal">
						<XIcon />
					</Dialog.CloseTrigger>
				</header>
				<p>A slide out drawer panel.</p>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>

```

## Z-Index

By default Skeleton does not take an opinionated stance regarding z-index stacking. The result is the component can sometimes be occluded beneath other elements with a higher index. The Z-Index can controlled by applying a utility class to the `Positioner` component.

```svelte
<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Dialog>
	<Dialog.Trigger class="btn preset-filled">Trigger</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center">
			<Dialog.Content class="card bg-surface-100-900 w-md p-4 space-y-2 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">Setting Z-Index</Dialog.Title>
				<Dialog.Description>This dialog will have a z-index value of 50.</Dialog.Description>
				<Dialog.CloseTrigger class="btn preset-tonal">Close</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Dialog dir="rtl">
	<Dialog.Trigger class="btn preset-filled">Trigger</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center">
			<Dialog.Content class="card bg-surface-100-900 w-md p-4 space-y-2 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">Hello World</Dialog.Title>
				<Dialog.Description>This is an example of a basic dialog.</Dialog.Description>
				<Dialog.CloseTrigger class="btn preset-tonal">Close</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>

```

## Anatomy

Here's an overview of how the Dialog component is structured in code:

```svelte
<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Dialog>
	<Dialog.Trigger />
	<Portal>
		<Dialog.Backdrop />
		<Dialog.Positioner>
			<Dialog.Content>
				<Dialog.Title />
				<Dialog.Description />
				<Dialog.CloseTrigger />
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
```

## API Reference

### Root

| Prop                   | Description                                                                                                                    | Type                                                                                                                                                                                                       | Default  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| ids                    | The ids of the elements in the dialog. Useful for composition.                                                                 | Partial\<\{ trigger: string \| ((value?: string \| undefined) => string); positioner: string; backdrop: string; content: string; closeTrigger: string; title: string; description: string; }> \| undefined | -        |
| trapFocus              | Whether to trap focus inside the dialog when it's opened                                                                       | boolean \| undefined                                                                                                                                                                                       | true     |
| preventScroll          | Whether to prevent scrolling behind the dialog when it's opened                                                                | boolean \| undefined                                                                                                                                                                                       | true     |
| modal                  | Whether to prevent pointer interaction outside the element and hide all content below it                                       | boolean \| undefined                                                                                                                                                                                       | true     |
| initialFocusEl         | Element to receive focus when the dialog is opened                                                                             | (() => MaybeElement) \| undefined                                                                                                                                                                          | -        |
| finalFocusEl           | Element to receive focus when the dialog is closed                                                                             | (() => MaybeElement) \| undefined                                                                                                                                                                          | -        |
| restoreFocus           | Whether to restore focus to the element that had focus before the dialog was opened                                            | boolean \| undefined                                                                                                                                                                                       | -        |
| closeOnInteractOutside | Whether to close the dialog when the outside is clicked                                                                        | boolean \| undefined                                                                                                                                                                                       | true     |
| closeOnEscape          | Whether to close the dialog when the escape key is pressed                                                                     | boolean \| undefined                                                                                                                                                                                       | true     |
| aria-label             | Human readable label for the dialog, in event the dialog title is not rendered                                                 | string \| undefined                                                                                                                                                                                        | -        |
| role                   | The dialog's role                                                                                                              | "dialog" \| "alertdialog" \| undefined                                                                                                                                                                     | "dialog" |
| open                   | The controlled open state of the dialog                                                                                        | boolean \| undefined                                                                                                                                                                                       | -        |
| defaultOpen            | The initial open state of the dialog when rendered.&#xA;Use when you don't need to control the open state of the dialog.       | boolean \| undefined                                                                                                                                                                                       | false    |
| onOpenChange           | Function to call when the dialog's open state changes                                                                          | ((details: OpenChangeDetails) => void) \| undefined                                                                                                                                                        | -        |
| triggerValue           | The controlled active trigger value                                                                                            | string \| null \| undefined                                                                                                                                                                                | -        |
| defaultTriggerValue    | The initial active trigger value when rendered.&#xA;Use when you don't need to control the active trigger value.               | string \| null \| undefined                                                                                                                                                                                | -        |
| onTriggerValueChange   | Function to call when the active trigger changes                                                                               | ((details: TriggerValueChangeDetails) => void) \| undefined                                                                                                                                                | -        |
| dir                    | The document's text/writing direction.                                                                                         | "ltr" \| "rtl" \| undefined                                                                                                                                                                                | "ltr"    |
| getRootNode            | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                     | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                        | -        |
| onEscapeKeyDown        | Function called when the escape key is pressed                                                                                 | ((event: KeyboardEvent) => void) \| undefined                                                                                                                                                              | -        |
| onRequestDismiss       | Function called when this layer is closed due to a parent layer being closed                                                   | ((event: LayerDismissEvent) => void) \| undefined                                                                                                                                                          | -        |
| onPointerDownOutside   | Function called when the pointer is pressed down outside the component                                                         | ((event: PointerDownOutsideEvent) => void) \| undefined                                                                                                                                                    | -        |
| onFocusOutside         | Function called when the focus is moved outside the component                                                                  | ((event: FocusOutsideEvent) => void) \| undefined                                                                                                                                                          | -        |
| onInteractOutside      | Function called when an interaction happens outside the component                                                              | ((event: InteractOutsideEvent) => void) \| undefined                                                                                                                                                       | -        |
| persistentElements     | Returns the persistent elements that:&#xA;- should not have pointer-events disabled&#xA;- should not trigger the dismiss event | (() => Element \| null)\[] \| undefined                                                                                                                                                                    | -        |
| children               | The default slot content to be rendered within the component.                                                                  | Snippet\<\[]> \| undefined                                                                                                                                                                                 | -        |

### Provider

| Prop     | Description                                                   | Type                        | Default |
| -------- | ------------------------------------------------------------- | --------------------------- | ------- |
| value    | -                                                             | () => DialogApi\<PropTypes> | -       |
| children | The default slot content to be rendered within the component. | Snippet\<\[]> \| undefined  | -       |

### Context

| Prop     | Description | Type                                     | Default |
| -------- | ----------- | ---------------------------------------- | ------- |
| children | -           | Snippet\<\[() => DialogApi\<PropTypes>]> | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Backdrop

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Positioner

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Title

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Description

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### CloseTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

# File Upload

File upload dropzone and input patterns for selecting files.

```svelte
<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
</script>

<FileUpload>
	<FileUpload.Label>Upload your files</FileUpload.Label>
	<FileUpload.Dropzone>
		<FileIcon class="size-10" />
		<span>Select file or drag here.</span>
		<FileUpload.Trigger>Browse Files</FileUpload.Trigger>
		<FileUpload.HiddenInput />
	</FileUpload.Dropzone>
	<FileUpload.ItemGroup>
		<FileUpload.Context>
			{#snippet children(fileUpload)}
				{#each fileUpload().acceptedFiles as file (file.name)}
					<FileUpload.Item {file}>
						<FileUpload.ItemName>{file.name}</FileUpload.ItemName>
						<FileUpload.ItemSizeText>{file.size} bytes</FileUpload.ItemSizeText>
						<FileUpload.ItemDeleteTrigger />
					</FileUpload.Item>
				{/each}
			{/snippet}
		</FileUpload.Context>
	</FileUpload.ItemGroup>
	<FileUpload.ClearTrigger>Clear Files</FileUpload.ClearTrigger>
</FileUpload>

```

## Disabled

Set the `disabled` prop to enable the disabled state.

```svelte
<script lang="ts">
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
</script>

<FileUpload disabled>
	<FileUpload.Label>Upload your files</FileUpload.Label>
	<FileUpload.Dropzone>
		<FileUpload.Trigger>Browse Files</FileUpload.Trigger>
		<FileUpload.HiddenInput />
	</FileUpload.Dropzone>
	<FileUpload.ItemGroup>
		<FileUpload.Context>
			{#snippet children(fileUpload)}
				{#each fileUpload().acceptedFiles as file (file.name)}
					<FileUpload.Item {file}>
						<FileUpload.ItemName>{file.name}</FileUpload.ItemName>
						<FileUpload.ItemSizeText>{file.size} bytes</FileUpload.ItemSizeText>
						<FileUpload.ItemDeleteTrigger />
					</FileUpload.Item>
				{/each}
			{/snippet}
		</FileUpload.Context>
	</FileUpload.ItemGroup>
</FileUpload>

```

## Button Only

Replace the interface with a simple "browse" button.

```svelte
<script lang="ts">
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
</script>

<FileUpload class="w-fit" onFileAccept={console.log}>
	<FileUpload.Trigger>Browse Files</FileUpload.Trigger>
	<FileUpload.HiddenInput />
</FileUpload>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
</script>

<FileUpload dir="rtl">
	<FileUpload.Label>Upload your files</FileUpload.Label>
	<FileUpload.Dropzone>
		<FileUpload.Trigger>Browse Files</FileUpload.Trigger>
		<FileUpload.HiddenInput />
	</FileUpload.Dropzone>
	<FileUpload.ItemGroup>
		<FileUpload.Context>
			{#snippet children(fileUpload)}
				{#each fileUpload().acceptedFiles as file (file.name)}
					<FileUpload.Item {file}>
						<FileUpload.ItemName>{file.name}</FileUpload.ItemName>
						<FileUpload.ItemSizeText>{file.size} bytes</FileUpload.ItemSizeText>
						<FileUpload.ItemDeleteTrigger />
					</FileUpload.Item>
				{/each}
			{/snippet}
		</FileUpload.Context>
	</FileUpload.ItemGroup>
</FileUpload>

```

## Anatomy

Here's an overview of how the FileUpload component is structured in code:

```svelte
<script lang="ts">
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
</script>

<FileUpload>
	<FileUpload.Dropzone>
		<FileUpload.Trigger />
		<FileUpload.HiddenInput />
	</FileUpload.Dropzone>
	<FileUpload.ItemGroup>
		<FileUpload.Item>
			<FileUpload.ItemName />
			<FileUpload.ItemSizeText />
			<FileUpload.ItemDeleteTrigger />
		</FileUpload.Item>
	</FileUpload.ItemGroup>
	<FileUpload.ClearTrigger />
</FileUpload>
```

## API Reference

### Root

| Prop                 | Description                                                                                                       | Type                                                                                                                                                                                                                                                                                                   | Default  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| name                 | The name of the underlying file input                                                                             | string \| undefined                                                                                                                                                                                                                                                                                    | -        |
| ids                  | The ids of the elements. Useful for composition.                                                                  | Partial\<\{ root: string; dropzone: string; hiddenInput: string; trigger: string; label: string; item: (id: string) => string; itemName: (id: string) => string; itemSizeText: (id: string) => string; itemPreview: (id: string) => string; itemDeleteTrigger: (id: string) => string; }> \| undefined | -        |
| translations         | The localized messages to use.                                                                                    | IntlTranslations \| undefined                                                                                                                                                                                                                                                                          | -        |
| accept               | The accept file types                                                                                             | Record\<string, string\[]> \| FileMimeType \| FileMimeType\[] \| undefined                                                                                                                                                                                                                             | -        |
| disabled             | Whether the file input is disabled                                                                                | boolean \| undefined                                                                                                                                                                                                                                                                                   | -        |
| required             | Whether the file input is required                                                                                | boolean \| undefined                                                                                                                                                                                                                                                                                   | -        |
| allowDrop            | Whether to allow drag and drop in the dropzone element                                                            | boolean \| undefined                                                                                                                                                                                                                                                                                   | true     |
| maxFileSize          | The maximum file size in bytes                                                                                    | number \| undefined                                                                                                                                                                                                                                                                                    | Infinity |
| minFileSize          | The minimum file size in bytes                                                                                    | number \| undefined                                                                                                                                                                                                                                                                                    | 0        |
| maxFiles             | The maximum number of files                                                                                       | number \| undefined                                                                                                                                                                                                                                                                                    | 1        |
| preventDocumentDrop  | Whether to prevent the drop event on the document                                                                 | boolean \| undefined                                                                                                                                                                                                                                                                                   | true     |
| validate             | Function to validate a file                                                                                       | ((file: File, details: FileValidateDetails) => FileError\[] \| null) \| undefined                                                                                                                                                                                                                      | -        |
| defaultAcceptedFiles | The default accepted files when rendered.&#xA;Use when you don't need to control the accepted files of the input. | File\[] \| undefined                                                                                                                                                                                                                                                                                   | -        |
| acceptedFiles        | The controlled accepted files                                                                                     | File\[] \| undefined                                                                                                                                                                                                                                                                                   | -        |
| onFileChange         | Function called when the value changes, whether accepted or rejected                                              | ((details: FileChangeDetails) => void) \| undefined                                                                                                                                                                                                                                                    | -        |
| onFileAccept         | Function called when the file is accepted                                                                         | ((details: FileAcceptDetails) => void) \| undefined                                                                                                                                                                                                                                                    | -        |
| onFileReject         | Function called when the file is rejected                                                                         | ((details: FileRejectDetails) => void) \| undefined                                                                                                                                                                                                                                                    | -        |
| capture              | The default camera to use when capturing media                                                                    | "user" \| "environment" \| undefined                                                                                                                                                                                                                                                                   | -        |
| directory            | Whether to accept directories, only works in webkit browsers                                                      | boolean \| undefined                                                                                                                                                                                                                                                                                   | -        |
| invalid              | Whether the file input is invalid                                                                                 | boolean \| undefined                                                                                                                                                                                                                                                                                   | -        |
| readOnly             | Whether the file input is read-only                                                                               | boolean \| undefined                                                                                                                                                                                                                                                                                   | -        |
| transformFiles       | Function to transform the accepted files to apply transformations                                                 | ((files: File\[]) => Promise\<File\[]>) \| undefined                                                                                                                                                                                                                                                   | -        |
| locale               | The current locale. Based on the BCP 47 definition.                                                               | string \| undefined                                                                                                                                                                                                                                                                                    | "en-US"  |
| dir                  | The document's text/writing direction.                                                                            | "ltr" \| "rtl" \| undefined                                                                                                                                                                                                                                                                            | "ltr"    |
| getRootNode          | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                        | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                                                                                                                    | -        |
| element              | Render the element yourself                                                                                       | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                                                                                                                       | -        |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => FileUploadApi\<PropTypes>                  | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type             | Default |
| -------- | ----------- | ---------------- | ------- |
| children | -           | Snippet\<\[any]> | -       |

### Label

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### Dropzone

| Prop         | Description                                        | Type                                             | Default |
| ------------ | -------------------------------------------------- | ------------------------------------------------ | ------- |
| disableClick | Whether to disable the click event on the dropzone | boolean \| undefined                             | -       |
| element      | Render the element yourself                        | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### ClearTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### HiddenInput

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

### ItemGroup

| Prop    | Description                 | Type                                            | Default |
| ------- | --------------------------- | ----------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"ul">]> \| undefined | -       |

### Item

| Prop    | Description                 | Type                                            | Default |
| ------- | --------------------------- | ----------------------------------------------- | ------- |
| file    | -                           | File                                            | -       |
| type    | -                           | ItemType \| undefined                           | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"li">]> \| undefined | -       |

### ItemName

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemSizeText

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemDeleteTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

# Floating Panel

A draggable, resizable floating panel with minimize/maximize controls.

```svelte
<script>
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MaximizeIcon from '@lucide/svelte/icons/maximize';
	import MinimizeIcon from '@lucide/svelte/icons/minimize';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import XIcon from '@lucide/svelte/icons/x';
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<FloatingPanel>
	<FloatingPanel.Trigger class="btn preset-filled">Open Panel</FloatingPanel.Trigger>
	<Portal>
		<FloatingPanel.Positioner class="z-50">
			<FloatingPanel.Content>
				<FloatingPanel.DragTrigger>
					<FloatingPanel.Header>
						<FloatingPanel.Title>
							<GripVerticalIcon class="size-4" />
							Floating Panel
						</FloatingPanel.Title>
						<FloatingPanel.Control>
							<FloatingPanel.StageTrigger stage="minimized">
								<MinusIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="maximized">
								<MaximizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="default">
								<MinimizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.CloseTrigger>
								<XIcon className="size-4" />
							</FloatingPanel.CloseTrigger>
						</FloatingPanel.Control>
					</FloatingPanel.Header>
				</FloatingPanel.DragTrigger>
				<FloatingPanel.Body>
					<p>
						This is a floating panel that can be dragged, resized, minimized, and maximized. Try dragging from the header or resizing from
						the bottom-right corner.
					</p>
				</FloatingPanel.Body>
				<FloatingPanel.ResizeTrigger axis="se" />
			</FloatingPanel.Content>
		</FloatingPanel.Positioner>
	</Portal>
</FloatingPanel>

```

## Size Constraints

Use the `minSize` and `maxSize` props to set size constraints on the Floating Panel.

```svelte
<script>
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MaximizeIcon from '@lucide/svelte/icons/maximize';
	import MinimizeIcon from '@lucide/svelte/icons/minimize';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import XIcon from '@lucide/svelte/icons/x';
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<FloatingPanel maxSize={{ width: 900, height: 600 }} minSize={{ width: 300, height: 200 }}>
	<FloatingPanel.Trigger class="btn preset-filled">Open Panel</FloatingPanel.Trigger>
	<Portal>
		<FloatingPanel.Positioner class="z-50">
			<FloatingPanel.Content>
				<FloatingPanel.DragTrigger>
					<FloatingPanel.Header>
						<FloatingPanel.Title>
							<GripVerticalIcon class="size-4" />
							Floating Panel
						</FloatingPanel.Title>
						<FloatingPanel.Control>
							<FloatingPanel.StageTrigger stage="minimized">
								<MinusIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="maximized">
								<MaximizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="default">
								<MinimizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.CloseTrigger>
								<XIcon className="size-4" />
							</FloatingPanel.CloseTrigger>
						</FloatingPanel.Control>
					</FloatingPanel.Header>
				</FloatingPanel.DragTrigger>
				<FloatingPanel.Body>
					<p>This panel has size constraints applied: minimum 300x200 pixels and maximum 900x600 pixels.</p>
					<p>Try resizing from the bottom-right corner - the panel will respect these boundaries.</p>
				</FloatingPanel.Body>
				<FloatingPanel.ResizeTrigger axis="se" />
			</FloatingPanel.Content>
		</FloatingPanel.Positioner>
	</Portal>
</FloatingPanel>

```

## Controlled

Control the open state and size of the Floating Panel with your own state.

```svelte
<script lang="ts">
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MaximizeIcon from '@lucide/svelte/icons/maximize';
	import MinimizeIcon from '@lucide/svelte/icons/minimize';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import XIcon from '@lucide/svelte/icons/x';
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';

	let open = $state(false);
	let size = $state({
		width: 400,
		height: 300,
	});
</script>

<div class="flex flex-col gap-4">
	<label class="label flex items-center gap-2">
		<input type="checkbox" class="checkbox" bind:checked={open} />
		<span class="label-text">Open Panel</span>
	</label>
	<label class="label">
		<span class="label-text">Width:</span>
		<input type="number" class="input" bind:value={size.width} />
	</label>
	<label class="label">
		<span class="label-text">Height:</span>
		<input type="number" class="input" bind:value={size.height} />
	</label>
</div>

<FloatingPanel {open} onOpenChange={(details) => (open = details.open)} {size} onSizeChange={(details) => (size = details.size)}>
	<Portal>
		<FloatingPanel.Positioner class="z-50">
			<FloatingPanel.Content>
				<FloatingPanel.DragTrigger>
					<FloatingPanel.Header>
						<FloatingPanel.Title>
							<GripVerticalIcon class="size-4" />
							Controlled Panel
						</FloatingPanel.Title>
						<FloatingPanel.Control>
							<FloatingPanel.StageTrigger stage="minimized">
								<MinusIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="maximized">
								<MaximizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="default">
								<MinimizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.CloseTrigger>
								<XIcon class="size-4" />
							</FloatingPanel.CloseTrigger>
						</FloatingPanel.Control>
					</FloatingPanel.Header>
				</FloatingPanel.DragTrigger>
				<FloatingPanel.Body>
					<p>This panel's open state and size are controlled via the inputs above.</p>
					<p>Try changing the values or resizing/closing the panel to see the inputs update.</p>
				</FloatingPanel.Body>
				<FloatingPanel.ResizeTrigger axis="se" />
			</FloatingPanel.Content>
		</FloatingPanel.Positioner>
	</Portal>
</FloatingPanel>

```

## Anchor Position

Position the panel relative to another element using the `defaultPosition` prop.

```svelte
<script lang="ts">
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MaximizeIcon from '@lucide/svelte/icons/maximize';
	import MinimizeIcon from '@lucide/svelte/icons/minimize';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import XIcon from '@lucide/svelte/icons/x';
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="space-y-4">
	<FloatingPanel
		getAnchorPosition={(ctx) => {
			if (!ctx.triggerRect) return { x: 0, y: 0 };
			return {
				x: ctx.triggerRect.x + ctx.triggerRect.width / 2,
				y: ctx.triggerRect.y + ctx.triggerRect.height / 2,
			};
		}}
	>
		<FloatingPanel.Trigger class="btn preset-filled">Open Panel</FloatingPanel.Trigger>
		<Portal>
			<FloatingPanel.Positioner class="z-50">
				<FloatingPanel.Content>
					<FloatingPanel.DragTrigger>
						<FloatingPanel.Header>
							<FloatingPanel.Title>
								<GripVerticalIcon class="size-4" />
								Anchored Panel
							</FloatingPanel.Title>
							<FloatingPanel.Control>
								<FloatingPanel.StageTrigger stage="minimized">
									<MinusIcon class="size-4" />
								</FloatingPanel.StageTrigger>
								<FloatingPanel.StageTrigger stage="maximized">
									<MaximizeIcon class="size-4" />
								</FloatingPanel.StageTrigger>
								<FloatingPanel.StageTrigger stage="default">
									<MinimizeIcon class="size-4" />
								</FloatingPanel.StageTrigger>
								<FloatingPanel.CloseTrigger>
									<XIcon class="size-4" />
								</FloatingPanel.CloseTrigger>
							</FloatingPanel.Control>
						</FloatingPanel.Header>
					</FloatingPanel.DragTrigger>
					<FloatingPanel.Body>
						<p>This panel is centered in the viewport using getAnchorPosition.</p>
						<p>The position is calculated based on the boundary rectangle.</p>
					</FloatingPanel.Body>
					<FloatingPanel.ResizeTrigger axis="se" />
				</FloatingPanel.Content>
			</FloatingPanel.Positioner>
		</Portal>
	</FloatingPanel>
</div>

```

## Resize Triggers

Add resize triggers on all sides and corners of the Floating Panel using the `axis` prop.

```svelte
<script>
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MaximizeIcon from '@lucide/svelte/icons/maximize';
	import MinimizeIcon from '@lucide/svelte/icons/minimize';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import XIcon from '@lucide/svelte/icons/x';
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<FloatingPanel>
	<FloatingPanel.Trigger class="btn preset-filled">Open Panel</FloatingPanel.Trigger>
	<Portal>
		<FloatingPanel.Positioner class="z-50">
			<FloatingPanel.Content>
				<FloatingPanel.DragTrigger>
					<FloatingPanel.Header>
						<FloatingPanel.Title>
							<GripVerticalIcon class="size-4" />
							Floating Panel
						</FloatingPanel.Title>
						<FloatingPanel.Control>
							<FloatingPanel.StageTrigger stage="minimized">
								<MinusIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="maximized">
								<MaximizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="default">
								<MinimizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.CloseTrigger>
								<XIcon className="size-4" />
							</FloatingPanel.CloseTrigger>
						</FloatingPanel.Control>
					</FloatingPanel.Header>
				</FloatingPanel.DragTrigger>
				<FloatingPanel.Body>
					<p>
						This is a floating panel that can be dragged, resized, minimized, and maximized. Try dragging from the header or resizing from
						the bottom-right corner.
					</p>
				</FloatingPanel.Body>
				<FloatingPanel.ResizeTrigger class="bg-primary-500/50" axis="n" />
				<FloatingPanel.ResizeTrigger class="bg-primary-500/50" axis="e" />
				<FloatingPanel.ResizeTrigger class="bg-primary-500/50" axis="w" />
				<FloatingPanel.ResizeTrigger class="bg-primary-500/50" axis="s" />
				<FloatingPanel.ResizeTrigger class="bg-primary-500/50" axis="ne" />
				<FloatingPanel.ResizeTrigger class="bg-primary-500/50" axis="se" />
				<FloatingPanel.ResizeTrigger class="bg-primary-500/50" axis="sw" />
				<FloatingPanel.ResizeTrigger class="bg-primary-500/50" axis="nw" />
			</FloatingPanel.Content>
		</FloatingPanel.Positioner>
	</Portal>
</FloatingPanel>

```

## Disable Dragging

Disable dragging by setting the `draggable` prop to `false`. The panel will remain in a fixed position but can still be resized.

```svelte
<script lang="ts">
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MaximizeIcon from '@lucide/svelte/icons/maximize';
	import MinimizeIcon from '@lucide/svelte/icons/minimize';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import XIcon from '@lucide/svelte/icons/x';
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<FloatingPanel draggable={false}>
	<FloatingPanel.Trigger class="btn preset-filled">Open Panel</FloatingPanel.Trigger>
	<Portal>
		<FloatingPanel.Positioner class="z-50">
			<FloatingPanel.Content>
				<FloatingPanel.DragTrigger>
					<FloatingPanel.Header>
						<FloatingPanel.Title>
							<GripVerticalIcon class="size-4" />
							Fixed Position Panel
						</FloatingPanel.Title>
						<FloatingPanel.Control>
							<FloatingPanel.StageTrigger stage="minimized">
								<MinusIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="maximized">
								<MaximizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="default">
								<MinimizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.CloseTrigger>
								<XIcon class="size-4" />
							</FloatingPanel.CloseTrigger>
						</FloatingPanel.Control>
					</FloatingPanel.Header>
				</FloatingPanel.DragTrigger>
				<FloatingPanel.Body>
					<p>This panel cannot be dragged - the position is fixed.</p>
					<p>However, it can still be resized from the bottom-right corner.</p>
				</FloatingPanel.Body>
				<FloatingPanel.ResizeTrigger axis="se" />
			</FloatingPanel.Content>
		</FloatingPanel.Positioner>
	</Portal>
</FloatingPanel>

```

## Disable Resizing

Disable resizing by setting the `resizable` prop to `false`. The panel will have a fixed size but can still be dragged.

```svelte
<script lang="ts">
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MaximizeIcon from '@lucide/svelte/icons/maximize';
	import MinimizeIcon from '@lucide/svelte/icons/minimize';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import XIcon from '@lucide/svelte/icons/x';
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<FloatingPanel resizable={false}>
	<FloatingPanel.Trigger class="btn preset-filled">Open Panel</FloatingPanel.Trigger>
	<Portal>
		<FloatingPanel.Positioner class="z-50">
			<FloatingPanel.Content>
				<FloatingPanel.DragTrigger>
					<FloatingPanel.Header>
						<FloatingPanel.Title>
							<GripVerticalIcon class="size-4" />
							Fixed Size Panel
						</FloatingPanel.Title>
						<FloatingPanel.Control>
							<FloatingPanel.StageTrigger stage="minimized">
								<MinusIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="maximized">
								<MaximizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="default">
								<MinimizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.CloseTrigger>
								<XIcon class="size-4" />
							</FloatingPanel.CloseTrigger>
						</FloatingPanel.Control>
					</FloatingPanel.Header>
				</FloatingPanel.DragTrigger>
				<FloatingPanel.Body>
					<p>This panel cannot be resized.</p>
					<p>Try dragging the edges - they won't respond.</p>
				</FloatingPanel.Body>
				<FloatingPanel.ResizeTrigger axis="se" />
			</FloatingPanel.Content>
		</FloatingPanel.Positioner>
	</Portal>
</FloatingPanel>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import GripVerticalIcon from '@lucide/svelte/icons/grip-vertical';
	import MaximizeIcon from '@lucide/svelte/icons/maximize';
	import MinimizeIcon from '@lucide/svelte/icons/minimize';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import XIcon from '@lucide/svelte/icons/x';
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<FloatingPanel dir="rtl">
	<FloatingPanel.Trigger class="btn preset-filled">Open Panel</FloatingPanel.Trigger>
	<Portal>
		<FloatingPanel.Positioner class="z-50">
			<FloatingPanel.Content>
				<FloatingPanel.DragTrigger>
					<FloatingPanel.Header>
						<FloatingPanel.Title>
							<GripVerticalIcon class="size-4" />
							Floating Panel
						</FloatingPanel.Title>
						<FloatingPanel.Control>
							<FloatingPanel.StageTrigger stage="minimized">
								<MinusIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="maximized">
								<MaximizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.StageTrigger stage="default">
								<MinimizeIcon class="size-4" />
							</FloatingPanel.StageTrigger>
							<FloatingPanel.CloseTrigger>
								<XIcon class="size-4" />
							</FloatingPanel.CloseTrigger>
						</FloatingPanel.Control>
					</FloatingPanel.Header>
				</FloatingPanel.DragTrigger>
				<FloatingPanel.Body>
					<p>This is a floating panel with right-to-left (RTL) direction.</p>
					<p>You can drag it from the header or resize it from the bottom-right corner.</p>
				</FloatingPanel.Body>
				<FloatingPanel.ResizeTrigger axis="se" />
			</FloatingPanel.Content>
		</FloatingPanel.Positioner>
	</Portal>
</FloatingPanel>

```

## Anatomy

Here's an overview of how the Floating Panel component is structured in code:

```svelte
<script lang="ts">
	import { FloatingPanel, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<FloatingPanel>
	<FloatingPanel.Trigger />
	<Portal>
		<FloatingPanel.Positioner>
			<FloatingPanel.Content>
				<FloatingPanel.DragTrigger>
					<FloatingPanel.Header>
						<FloatingPanel.Title />
						<FloatingPanel.Control>
							<FloatingPanel.StageTrigger />
							<FloatingPanel.CloseTrigger />
						</FloatingPanel.Control>
					</FloatingPanel.Header>
				</FloatingPanel.DragTrigger>
				<FloatingPanel.Body />
				<FloatingPanel.ResizeTrigger />
			</FloatingPanel.Content>
		</FloatingPanel.Positioner>
	</Portal>
</FloatingPanel>
```

## API Reference

### Root

| Prop                | Description                                                                                                                               | Type                                                                                                             | Default |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| ids                 | The ids of the elements in the floating panel. Useful for composition.                                                                    | Partial\<\{ trigger: string; positioner: string; content: string; title: string; header: string; }> \| undefined | -       |
| translations        | The translations for the floating panel.                                                                                                  | IntlTranslations \| undefined                                                                                    | -       |
| strategy            | The strategy to use for positioning                                                                                                       | "absolute" \| "fixed" \| undefined                                                                               | "fixed" |
| allowOverflow       | Whether the panel should be strictly contained within the boundary when dragging                                                          | boolean \| undefined                                                                                             | true    |
| open                | The controlled open state of the panel                                                                                                    | boolean \| undefined                                                                                             | -       |
| defaultOpen         | The initial open state of the panel when rendered.&#xA;Use when you don't need to control the open state of the panel.                    | boolean \| undefined                                                                                             | false   |
| draggable           | Whether the panel is draggable                                                                                                            | boolean \| undefined                                                                                             | true    |
| resizable           | Whether the panel is resizable                                                                                                            | boolean \| undefined                                                                                             | true    |
| size                | The size of the panel                                                                                                                     | Size \| undefined                                                                                                | -       |
| defaultSize         | The default size of the panel                                                                                                             | Size \| undefined                                                                                                | -       |
| minSize             | The minimum size of the panel                                                                                                             | Size \| undefined                                                                                                | -       |
| maxSize             | The maximum size of the panel                                                                                                             | Size \| undefined                                                                                                | -       |
| position            | The controlled position of the panel                                                                                                      | Point \| undefined                                                                                               | -       |
| defaultPosition     | The initial position of the panel when rendered.&#xA;Use when you don't need to control the position of the panel.                        | Point \| undefined                                                                                               | -       |
| getAnchorPosition   | Function that returns the initial position of the panel when it is opened.&#xA;If provided, will be used instead of the default position. | ((details: AnchorPositionDetails) => Point) \| undefined                                                         | -       |
| lockAspectRatio     | Whether the panel is locked to its aspect ratio                                                                                           | boolean \| undefined                                                                                             | -       |
| closeOnEscape       | Whether the panel should close when the escape key is pressed                                                                             | boolean \| undefined                                                                                             | -       |
| getBoundaryEl       | The boundary of the panel. Useful for recalculating the boundary rect when&#xA;the it is resized.                                         | (() => HTMLElement \| null) \| undefined                                                                         | -       |
| initialFocusEl      | Element to receive focus when the panel is opened.&#xA;By default, the first focusable element in the content is focused.                 | (() => HTMLElement \| null) \| undefined                                                                         | -       |
| finalFocusEl        | Element to receive focus when the panel is closed.&#xA;By default, the trigger element is focused.                                        | (() => HTMLElement \| null) \| undefined                                                                         | -       |
| restoreFocus        | Whether to restore focus to the trigger when the panel is closed.                                                                         | boolean \| undefined                                                                                             | true    |
| disabled            | Whether the panel is disabled                                                                                                             | boolean \| undefined                                                                                             | -       |
| onPositionChange    | Function called when the position of the panel changes via dragging                                                                       | ((details: PositionChangeDetails) => void) \| undefined                                                          | -       |
| onPositionChangeEnd | Function called when the position of the panel changes via dragging ends                                                                  | ((details: PositionChangeDetails) => void) \| undefined                                                          | -       |
| onOpenChange        | Function called when the panel is opened or closed                                                                                        | ((details: OpenChangeDetails) => void) \| undefined                                                              | -       |
| onSizeChange        | Function called when the size of the panel changes via resizing                                                                           | ((details: SizeChangeDetails) => void) \| undefined                                                              | -       |
| onSizeChangeEnd     | Function called when the size of the panel changes via resizing ends                                                                      | ((details: SizeChangeDetails) => void) \| undefined                                                              | -       |
| persistRect         | Whether the panel size and position should be preserved when it is closed                                                                 | boolean \| undefined                                                                                             | -       |
| gridSize            | The snap grid for the panel                                                                                                               | number \| undefined                                                                                              | 1       |
| onStageChange       | Function called when the stage of the panel changes                                                                                       | ((details: StageChangeDetails) => void) \| undefined                                                             | -       |
| dir                 | The document's text/writing direction.                                                                                                    | "ltr" \| "rtl" \| undefined                                                                                      | "ltr"   |
| getRootNode         | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                | (() => ShadowRoot \| Node \| Document) \| undefined                                                              | -       |
| children            | The default slot content to be rendered within the component.                                                                             | Snippet\<\[]> \| undefined                                                                                       | -       |

### Provider

| Prop     | Description                                                   | Type                               | Default |
| -------- | ------------------------------------------------------------- | ---------------------------------- | ------- |
| value    | -                                                             | () => FloatingPanelApi\<PropTypes> | -       |
| children | The default slot content to be rendered within the component. | Snippet\<\[]> \| undefined         | -       |

### Context

| Prop     | Description | Type                                            | Default |
| -------- | ----------- | ----------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => FloatingPanelApi\<PropTypes>]> | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Positioner

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### DragTrigger

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Header

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Title

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Control

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### StageTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |
| stage   | The stage of the panel      | Stage                                               | -       |

### CloseTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Body

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ResizeTrigger

| Prop    | Description                   | Type                                             | Default |
| ------- | ----------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself   | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |
| axis    | The axis of the resize handle | ResizeTriggerAxis                                | -       |

# Listbox

Accessible listbox for single and multi selection.

```svelte
<script lang="ts">
	import { Listbox, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	const collection = useListCollection({
		items: data,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value,
	});
</script>

<Listbox class="w-full max-w-md" {collection}>
	<Listbox.Label>Select a food</Listbox.Label>
	<Listbox.Content>
		{#each collection.items as item (item.value)}
			<Listbox.Item {item}>
				<Listbox.ItemText>{item.label}</Listbox.ItemText>
				<Listbox.ItemIndicator />
			</Listbox.Item>
		{/each}
	</Listbox.Content>
</Listbox>

```

## Groups

Organize items into categorized groups.

```svelte
<script lang="ts">
	import { Listbox, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple', type: 'Fruits' },
		{ label: 'Banana', value: 'banana', type: 'Fruits' },
		{ label: 'Orange', value: 'orange', type: 'Fruits' },
		{ label: 'Carrot', value: 'carrot', type: 'Vegetables' },
		{ label: 'Broccoli', value: 'broccoli', type: 'Vegetables' },
		{ label: 'Spinach', value: 'spinach', type: 'Vegetables' },
	];

	const collection = useListCollection({
		items: data,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value,
		groupBy: (item) => item.type,
	});
</script>

<Listbox class="w-full max-w-md" {collection}>
	<Listbox.Content>
		{#each collection.group() as [type, items] (type)}
			<Listbox.ItemGroup>
				<Listbox.ItemGroupLabel>{type}</Listbox.ItemGroupLabel>
				{#each items as item (item.value)}
					<Listbox.Item {item}>
						<Listbox.ItemText>{item.label}</Listbox.ItemText>
						<Listbox.ItemIndicator />
					</Listbox.Item>
				{/each}
			</Listbox.ItemGroup>
		{/each}
	</Listbox.Content>
</Listbox>

```

## Multiple

Set the `multiple` proper to allow selecting more than one item.

```svelte
<script lang="ts">
	import { Listbox, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	const collection = useListCollection({
		items: data,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value,
	});
</script>

<Listbox class="w-full max-w-md" {collection} selectionMode="multiple">
	<Listbox.Content>
		{#each collection.items as item (item.value)}
			<Listbox.Item {item}>
				<Listbox.ItemText>{item.label}</Listbox.ItemText>
				<Listbox.ItemIndicator />
			</Listbox.Item>
		{/each}
	</Listbox.Content>
</Listbox>

```

## Disabled

Set the `disabled` prop to enable the disabled state.

```svelte
<script lang="ts">
	import { Listbox, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	const collection = useListCollection({
		items: data,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value,
	});
</script>

<Listbox class="w-full max-w-md" {collection} disabled={true}>
	<Listbox.Content>
		{#each collection.items as item (item.value)}
			<Listbox.Item {item}>
				<Listbox.ItemText>{item.label}</Listbox.ItemText>
				<Listbox.ItemIndicator />
			</Listbox.Item>
		{/each}
	</Listbox.Content>
</Listbox>

```

Which can also be enabled per item.

```svelte
<script lang="ts">
	import { Listbox, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	const collection = useListCollection({
		items: data,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value,
		isItemDisabled: (item) => item.value === 'banana',
	});
</script>

<Listbox class="w-full max-w-md" {collection}>
	<Listbox.Content>
		{#each collection.items as item (item.value)}
			<Listbox.Item {item}>
				<Listbox.ItemText>{item.label}</Listbox.ItemText>
				<Listbox.ItemIndicator />
			</Listbox.Item>
		{/each}
	</Listbox.Content>
</Listbox>

```

## Search

Utilize the `Input` component to implement simple search.

```svelte
<script lang="ts">
	import { Listbox, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	let query = $state('');

	const collection = $derived(
		useListCollection({
			items: data.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
		}),
	);
</script>

<Listbox class="w-full max-w-md" {collection}>
	<Listbox.Label>Search for Food</Listbox.Label>
	<Listbox.Input placeholder="Type to search..." value={query} oninput={(e) => (query = e.currentTarget.value)} />
	<Listbox.Content>
		{#each collection.items as item (item.value)}
			<Listbox.Item {item}>
				<Listbox.ItemText>{item.label}</Listbox.ItemText>
				<Listbox.ItemIndicator />
			</Listbox.Item>
		{/each}
	</Listbox.Content>
</Listbox>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Listbox, useListCollection } from '@skeletonlabs/skeleton-svelte';

	const data = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Orange', value: 'orange' },
		{ label: 'Carrot', value: 'carrot' },
		{ label: 'Broccoli', value: 'broccoli' },
		{ label: 'Spinach', value: 'spinach' },
	];

	const collection = useListCollection({
		items: data,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value,
	});
</script>

<Listbox class="w-full max-w-md" {collection} dir="rtl">
	<Listbox.Label>Select a food</Listbox.Label>
	<Listbox.Content>
		{#each collection.items as item (item.value)}
			<Listbox.Item {item}>
				<Listbox.ItemText>{item.label}</Listbox.ItemText>
				<Listbox.ItemIndicator />
			</Listbox.Item>
		{/each}
	</Listbox.Content>
</Listbox>

```

## Anatomy

Here's an overview of how the Listbox component is structured in code:

```svelte
<script lang="ts">
	import { Listbox } from '@skeletonlabs/skeleton-svelte';
</script>

<Listbox>
	<Listbox.Label />
	<Listbox.Content>
		<Listbox.Item>
			<Listbox.ItemText />
			<Listbox.ItemIndicator />
		</Listbox.Item>
	</Listbox.Content>
</Listbox>
```

## API Reference

### Root

| Prop                    | Description                                                                                                                                                                                                                                                                       | Type                                                                                                                                                                                                             | Default    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| orientation             | The orientation of the listbox.                                                                                                                                                                                                                                                   | "horizontal" \| "vertical" \| undefined                                                                                                                                                                          | "vertical" |
| collection              | The item collection                                                                                                                                                                                                                                                               | ListCollection\<any> \| GridCollection\<any>                                                                                                                                                                     | -          |
| ids                     | The ids of the elements in the listbox. Useful for composition.                                                                                                                                                                                                                   | Partial\<\{ root: string; content: string; label: string; item: (id: string \| number) => string; itemGroup: (id: string \| number) => string; itemGroupLabel: (id: string \| number) => string; }> \| undefined | -          |
| disabled                | Whether the listbox is disabled                                                                                                                                                                                                                                                   | boolean \| undefined                                                                                                                                                                                             | -          |
| disallowSelectAll       | Whether to disallow selecting all items when \`meta+a\` is pressed                                                                                                                                                                                                                | boolean \| undefined                                                                                                                                                                                             | -          |
| onHighlightChange       | The callback fired when the highlighted item changes.                                                                                                                                                                                                                             | ((details: HighlightChangeDetails\<any>) => void) \| undefined                                                                                                                                                   | -          |
| onValueChange           | The callback fired when the selected item changes.                                                                                                                                                                                                                                | ((details: ValueChangeDetails\<any>) => void) \| undefined                                                                                                                                                       | -          |
| value                   | The controlled keys of the selected items                                                                                                                                                                                                                                         | string\[] \| undefined                                                                                                                                                                                           | -          |
| defaultValue            | The initial default value of the listbox when rendered.&#xA;Use when you don't need to control the value of the listbox.                                                                                                                                                          | string\[] \| undefined                                                                                                                                                                                           | \[]        |
| highlightedValue        | The controlled key of the highlighted item                                                                                                                                                                                                                                        | string \| null \| undefined                                                                                                                                                                                      | -          |
| defaultHighlightedValue | The initial value of the highlighted item when opened.&#xA;Use when you don't need to control the highlighted value of the listbox.                                                                                                                                               | string \| null \| undefined                                                                                                                                                                                      | -          |
| loopFocus               | Whether to loop the keyboard navigation through the options                                                                                                                                                                                                                       | boolean \| undefined                                                                                                                                                                                             | false      |
| selectionMode           | How multiple selection should behave in the listbox.&#xA;&#xA;- \`single\`: The user can select a single item.&#xA;- \`multiple\`: The user can select multiple items without using modifier keys.&#xA;- \`extended\`: The user can select multiple items by using modifier keys. | SelectionMode \| undefined                                                                                                                                                                                       | "single"   |
| scrollToIndexFn         | Function to scroll to a specific index                                                                                                                                                                                                                                            | ((details: ScrollToIndexDetails) => void) \| undefined                                                                                                                                                           | -          |
| selectOnHighlight       | Whether to select the item when it is highlighted                                                                                                                                                                                                                                 | boolean \| undefined                                                                                                                                                                                             | -          |
| deselectable            | Whether to disallow empty selection                                                                                                                                                                                                                                               | boolean \| undefined                                                                                                                                                                                             | -          |
| typeahead               | Whether to enable typeahead on the listbox                                                                                                                                                                                                                                        | boolean \| undefined                                                                                                                                                                                             | -          |
| onSelect                | Function called when an item is selected                                                                                                                                                                                                                                          | ((details: SelectionDetails) => void) \| undefined                                                                                                                                                               | -          |
| dir                     | The document's text/writing direction.                                                                                                                                                                                                                                            | "ltr" \| "rtl" \| undefined                                                                                                                                                                                      | "ltr"      |
| getRootNode             | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                                                                                                                                                        | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                              | -          |
| element                 | Render the element yourself                                                                                                                                                                                                                                                       | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                                 | -          |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => ListboxApi\<PropTypes, any>                | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                           | Default |
| -------- | ----------- | ---------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => ListboxApi\<PropTypes, any>]> | -       |

### Label

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### Input

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                            | Default |
| ------- | --------------------------- | ----------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"ul">]> \| undefined | -       |

### ItemGroup

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemGroupLabel

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop             | Description                            | Type                                            | Default |
| ---------------- | -------------------------------------- | ----------------------------------------------- | ------- |
| item             | The item to render                     | any                                             | -       |
| highlightOnHover | Whether to highlight the item on hover | boolean \| undefined                            | -       |
| element          | Render the element yourself            | Snippet\<\[HTMLAttributes\<"li">]> \| undefined | -       |

### ItemText

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### ItemIndicator

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

# Locale Provider

Provides locale context to components for controlling reading direction.

```svelte
<script lang="ts">
	import { LocaleProvider } from '@skeletonlabs/skeleton-svelte';
</script>

<LocaleProvider locale="en-US">
	<!-- your app -->
</LocaleProvider>
```

## Anatomy

Here's an overview of how the LocaleProvider component is structured in code:

```svelte
<script lang="ts">
	import { LocaleProvider } from '@skeletonlabs/skeleton-svelte';
</script>

<LocaleProvider></LocaleProvider>
```

## API Reference

### Root

| Prop     | Description                                                   | Type                       | Default |
| -------- | ------------------------------------------------------------- | -------------------------- | ------- |
| locale   | The locale to use for the application.                        | string                     | 'en-US' |
| children | The default slot content to be rendered within the component. | Snippet\<\[]> \| undefined | -       |

### Context

| Prop     | Description | Type             | Default |
| -------- | ----------- | ---------------- | ------- |
| children | -           | Snippet\<\[any]> | -       |

# Marquee

Auto-scrolls content like logos, announcements, or featured items.

```svelte
<script lang="ts">
	import { Marquee } from '@skeletonlabs/skeleton-svelte';

	const items = [
		{ emoji: '🐉', label: 'Dragon' },
		{ emoji: '🧙', label: 'Wizard' },
		{ emoji: '⚔️', label: 'Knight' },
		{ emoji: '💀', label: 'Skeleton' },
		{ emoji: '🏰', label: 'Castle' },
		{ emoji: '🧝', label: 'Elf' },
		{ emoji: '🗡️', label: 'Rogue' },
		{ emoji: '🛡️', label: 'Paladin' },
	];
</script>

<Marquee autoFill pauseOnInteraction>
	<Marquee.Edge side="start" />
	<Marquee.Viewport>
		<Marquee.Context>
			{#snippet children(marquee)}
				{#each Array.from({ length: marquee().contentCount }) as _, index}
					<Marquee.Content {index}>
						{#each items as item}
							<div class="card bg-surface-100-900 flex items-center gap-3 px-6 py-4 whitespace-nowrap">
								<span class="text-3xl">{item.emoji}</span>
								<span class="font-medium">{item.label}</span>
							</div>
						{/each}
					</Marquee.Content>
				{/each}
			{/snippet}
		</Marquee.Context>
	</Marquee.Viewport>
	<Marquee.Edge side="end" />
</Marquee>

```

## Usage

Access `contentCount` via `Marquee.Context` to render the correct number of content blocks. Zag handles duplication for seamless looping — your items only need to be written once inside `Marquee.Content`.

```svelte
<Marquee autoFill pauseOnInteraction>
	<Marquee.Edge side="start" />
	<Marquee.Viewport>
		<Marquee.Context>
			{#snippet children(marquee)}
				{#each Array.from({ length: marquee().contentCount }) as _, index}
					<Marquee.Content {index}>
						<!-- items here -->
					</Marquee.Content>
				{/each}
			{/snippet}
		</Marquee.Context>
	</Marquee.Viewport>
	<Marquee.Edge side="end" />
</Marquee>
```

## Controlled

Use `useMarquee` to control pause state from outside the component.

```svelte
<script lang="ts">
	import { Marquee, useMarquee } from '@skeletonlabs/skeleton-svelte';

	const marquee = useMarquee(() => ({ autoFill: true, pauseOnInteraction: true }));
</script>

<button onclick={() => marquee().togglePause()}>Toggle Pause</button>
<Marquee.Provider value={marquee}>...</Marquee.Provider>
```

## Anatomy

Here's an overview of how the Marquee component is structured in code:

```svelte
<script lang="ts">
	import { Marquee } from '@skeletonlabs/skeleton-svelte';
</script>

<Marquee>
	<Marquee.Edge side="start" />
	<Marquee.Viewport>
		<Marquee.Context>
			{#snippet children(marquee)}
				{#each Array.from({ length: marquee().contentCount }) as _, index}
					<Marquee.Content {index}>
						<!-- items -->
					</Marquee.Content>
				{/each}
			{/snippet}
		</Marquee.Context>
	</Marquee.Viewport>
	<Marquee.Edge side="end" />
</Marquee>
```

## API Reference

### Root

| Prop               | Description                                                                                                      | Type                                                                                            | Default |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| ids                | The ids of the elements in the marquee. Useful for composition.                                                  | Partial\<\{ root: string; viewport: string; content: (index: number) => string; }> \| undefined | -       |
| translations       | The localized messages to use.                                                                                   | IntlTranslations \| undefined                                                                   | -       |
| side               | The side/direction the marquee scrolls towards.                                                                  | Side \| undefined                                                                               | "start" |
| speed              | The speed of the marquee animation in pixels per second.                                                         | number \| undefined                                                                             | 50      |
| delay              | The delay before the animation starts (in seconds).                                                              | number \| undefined                                                                             | 0       |
| loopCount          | The number of times to loop the animation (0 = infinite).                                                        | number \| undefined                                                                             | 0       |
| spacing            | The spacing between marquee items.                                                                               | string \| undefined                                                                             | "1rem"  |
| autoFill           | Whether to automatically duplicate content to fill the container.                                                | boolean \| undefined                                                                            | false   |
| pauseOnInteraction | Whether to pause the marquee on user interaction (hover, focus).                                                 | boolean \| undefined                                                                            | false   |
| reverse            | Whether to reverse the animation direction.                                                                      | boolean \| undefined                                                                            | false   |
| paused             | Whether the marquee is paused.                                                                                   | boolean \| undefined                                                                            | -       |
| defaultPaused      | Whether the marquee is paused by default.                                                                        | boolean \| undefined                                                                            | false   |
| onPauseChange      | Function called when the pause status changes.                                                                   | ((details: PauseStatusDetails) => void) \| undefined                                            | -       |
| onLoopComplete     | Function called when the marquee completes one loop iteration.                                                   | (() => void) \| undefined                                                                       | -       |
| onComplete         | Function called when the marquee completes all loops and stops.&#xA;Only fires for finite loops (loopCount > 0). | (() => void) \| undefined                                                                       | -       |
| dir                | The document's text/writing direction.                                                                           | "ltr" \| "rtl" \| undefined                                                                     | "ltr"   |
| getRootNode        | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                       | (() => ShadowRoot \| Node \| Document) \| undefined                                             | -       |
| element            | Render the element yourself                                                                                      | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                | -       |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => MarqueeApi\<PropTypes>                     | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                      | Default |
| -------- | ----------- | ----------------------------------------- | ------- |
| children | -           | Snippet\<\[() => MarqueeApi\<PropTypes>]> | -       |

### Viewport

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                                                            | Type                                             | Default |
| ------- | ---------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| index   | The index of the content instance (0 for original, 1+ for duplicates). | number                                           | -       |
| element | Render the element yourself                                            | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Edge

| Prop    | Description                                     | Type                                             | Default |
| ------- | ----------------------------------------------- | ------------------------------------------------ | ------- |
| side    | The side where the edge gradient should appear. | Side                                             | -       |
| element | Render the element yourself                     | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Menu

Accessible dropdown and context menus for actions and navigation.

```svelte
<script lang="ts">
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Menu>
	<Menu.Trigger class="btn preset-filled">Open Menu</Menu.Trigger>
	<Portal>
		<Menu.Positioner>
			<Menu.Content>
				<Menu.Item value="new">
					<Menu.ItemText>New File</Menu.ItemText>
				</Menu.Item>
				<Menu.Item value="open">
					<Menu.ItemText>Open File</Menu.ItemText>
				</Menu.Item>
				<Menu.Separator />
				<Menu.Item value="save">
					<Menu.ItemText>Save</Menu.ItemText>
				</Menu.Item>
				<Menu.Item value="export">
					<Menu.ItemText>Export</Menu.ItemText>
				</Menu.Item>
			</Menu.Content>
		</Menu.Positioner>
	</Portal>
</Menu>

```

## Grouped Items

Use `ItemGroup` and `ItemGroupLabel` to organize menu items into logical sections.

```svelte
<script lang="ts">
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Menu>
	<Menu.Trigger class="btn preset-filled">View Options</Menu.Trigger>
	<Portal>
		<Menu.Positioner>
			<Menu.Content>
				<Menu.ItemGroup>
					<Menu.ItemGroupLabel>View</Menu.ItemGroupLabel>
					<Menu.Item value="split">
						<Menu.ItemText>Split View</Menu.ItemText>
					</Menu.Item>
					<Menu.Item value="fullscreen">
						<Menu.ItemText>Fullscreen</Menu.ItemText>
					</Menu.Item>
				</Menu.ItemGroup>
				<Menu.Separator />
				<Menu.ItemGroup>
					<Menu.ItemGroupLabel>Appearance</Menu.ItemGroupLabel>
					<Menu.Item value="theme">
						<Menu.ItemText>Change Theme</Menu.ItemText>
					</Menu.Item>
					<Menu.Item value="zoom">
						<Menu.ItemText>Zoom</Menu.ItemText>
					</Menu.Item>
				</Menu.ItemGroup>
			</Menu.Content>
		</Menu.Positioner>
	</Portal>
</Menu>

```

## Context Menu

Use `ContextTrigger` instead of `Trigger` to open the menu on right-click.

```svelte
<script lang="ts">
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Menu>
	<Menu.ContextTrigger class="card border border-dashed border-surface-200-800 p-8">Right-click here</Menu.ContextTrigger>
	<Portal>
		<Menu.Positioner>
			<Menu.Content>
				<Menu.Item value="cut">
					<Menu.ItemText>Cut</Menu.ItemText>
				</Menu.Item>
				<Menu.Item value="copy">
					<Menu.ItemText>Copy</Menu.ItemText>
				</Menu.Item>
				<Menu.Item value="paste">
					<Menu.ItemText>Paste</Menu.ItemText>
				</Menu.Item>
				<Menu.Separator />
				<Menu.Item value="delete">
					<Menu.ItemText>Delete</Menu.ItemText>
				</Menu.Item>
			</Menu.Content>
		</Menu.Positioner>
	</Portal>
</Menu>

```

## Nested Menu

Use the `TriggerItem` component to create nested menus within a parent menu.

```svelte
<script lang="ts">
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Menu>
	<Menu.Trigger class="btn preset-filled">Open Menu</Menu.Trigger>
	<Portal>
		<Menu.Positioner>
			<Menu.Content>
				<Menu>
					<Menu.TriggerItem value="new">
						<Menu.ItemText>New</Menu.ItemText>
						<Menu.ItemIndicator>
							<ChevronRightIcon class="size-4" />
						</Menu.ItemIndicator>
					</Menu.TriggerItem>
					<Portal>
						<Menu.Positioner>
							<Menu.Content>
								<Menu.Item value="project">
									<Menu.ItemText>New Project</Menu.ItemText>
								</Menu.Item>
								<Menu.Item value="file">
									<Menu.ItemText>New File</Menu.ItemText>
								</Menu.Item>
								<Menu.Item value="folder">
									<Menu.ItemText>New Folder</Menu.ItemText>
								</Menu.Item>
							</Menu.Content>
						</Menu.Positioner>
					</Portal>
				</Menu>
				<Menu.Item value="open">
					<Menu.ItemText>Open File</Menu.ItemText>
				</Menu.Item>
				<Menu.Separator />
				<Menu.Item value="save">
					<Menu.ItemText>Save</Menu.ItemText>
				</Menu.Item>
				<Menu.Item value="export">
					<Menu.ItemText>Export</Menu.ItemText>
				</Menu.Item>
			</Menu.Content>
		</Menu.Positioner>
	</Portal>
</Menu>

```

## Option Items

Use `OptionItem` to create menu items that can be toggled on or off with checkbox or radio group like behavior.

```svelte
<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';

	const sortOptions = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'popular', label: 'Most Popular' },
		{ value: 'rating', label: 'Highest Rated' },
	];

	const filterOptions = [
		{ value: 'free-shipping', label: 'Free Shipping' },
		{ value: 'in-stock', label: 'In Stock' },
		{ value: 'on-sale', label: 'On Sale' },
	];

	let sort = $state('newest');
	let filters = $state<string[]>(['free-shipping', 'in-stock']);
</script>

<Menu closeOnSelect={false}>
	<Menu.Trigger class="btn preset-filled">Open Menu</Menu.Trigger>
	<Portal>
		<Menu.Positioner>
			<Menu.Content>
				{#each sortOptions as item (item)}
					<Menu.OptionItem
						type="radio"
						checked={sort === item.value}
						onCheckedChange={(checked) => (sort = checked ? item.value : '')}
						value={item.value}
					>
						<Menu.ItemText>{item.label}</Menu.ItemText>
						<Menu.ItemIndicator class="hidden data-[state=checked]:block">
							<CheckIcon class="size-4" />
						</Menu.ItemIndicator>
					</Menu.OptionItem>
				{/each}
				<Menu.Separator />
				{#each filterOptions as item (item)}
					<Menu.OptionItem
						type="checkbox"
						checked={filters.includes(item.value)}
						onCheckedChange={(checked) => (filters = checked ? [...filters, item.value] : filters.filter((x) => x !== item.value))}
						value={item.value}
					>
						<Menu.ItemText>{item.label}</Menu.ItemText>
						<Menu.ItemIndicator class="hidden data-[state=checked]:block">
							<CheckIcon class="size-4" />
						</Menu.ItemIndicator>
					</Menu.OptionItem>
				{/each}
			</Menu.Content>
		</Menu.Positioner>
	</Portal>
</Menu>

```

## Disabled Item

Set the disabled prop to enable the disabled state.

```tsx
<script lang="ts">
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Menu>
	<Menu.Trigger class="btn preset-filled">Open Menu</Menu.Trigger>
	<Portal>
		<Menu.Positioner>
			<Menu.Content>
				<Menu.Item value="new">
					<Menu.ItemText>New File</Menu.ItemText>
				</Menu.Item>
				<Menu.Item value="open">
					<Menu.ItemText>Open File</Menu.ItemText>
				</Menu.Item>
				<Menu.Separator />
				<Menu.Item value="save">
					<Menu.ItemText>Save</Menu.ItemText>
				</Menu.Item>
				<Menu.Item value="disabled" disabled={true}>
					<Menu.ItemText>Disabled</Menu.ItemText>
				</Menu.Item>
			</Menu.Content>
		</Menu.Positioner>
	</Portal>
</Menu>

```

## Anatomy

Here's an overview of how the Menu component is structured in code:

```svelte
<script lang="ts">
	import { Menu } from '@skeletonlabs/skeleton-svelte';
</script>

<Menu>
	<Menu.Trigger>
		<Menu.Indicator />
	</Menu.Trigger>
	<Menu.ContextTrigger>
		<Menu.Indicator />
	</Menu.ContextTrigger>
	<Menu.Positioner>
		<Menu.Content>
			<Menu.ItemGroup>
				<Menu.ItemGroupLabel />
				<Menu.Item>
					<Menu.ItemIndicator />
					<Menu.ItemText />
				</Menu.Item>
				<Menu.OptionItem>
					<Menu.ItemIndicator />
					<Menu.ItemText />
				</Menu.OptionItem>
				<Menu.TriggerItem>
					<Menu.ItemIndicator />
					<Menu.ItemText />
				</Menu.TriggerItem>
			</Menu.ItemGroup>
			<Menu.Separator />
			<Menu.Arrow>
				<Menu.ArrowTip />
			</Menu.Arrow>
		</Menu.Content>
	</Menu.Positioner>
</Menu>
```

## API Reference

### Root

| Prop                    | Description                                                                                                                                  | Type                                                                                                                                                                                                                                                                                  | Default |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| ids                     | The ids of the elements in the menu. Useful for composition.                                                                                 | Partial\<\{ trigger: string \| ((value?: string \| undefined) => string); contextTrigger: string \| ((value?: string \| undefined) => string); content: string; groupLabel: (id: string) => string; group: (id: string) => string; positioner: string; arrow: string; }> \| undefined | -       |
| defaultHighlightedValue | The initial highlighted value of the menu item when rendered.&#xA;Use when you don't need to control the highlighted value of the menu item. | string \| null \| undefined                                                                                                                                                                                                                                                           | -       |
| highlightedValue        | The controlled highlighted value of the menu item.                                                                                           | string \| null \| undefined                                                                                                                                                                                                                                                           | -       |
| onHighlightChange       | Function called when the highlighted menu item changes.                                                                                      | ((details: HighlightChangeDetails) => void) \| undefined                                                                                                                                                                                                                              | -       |
| onSelect                | Function called when a menu item is selected.                                                                                                | ((details: SelectionDetails) => void) \| undefined                                                                                                                                                                                                                                    | -       |
| anchorPoint             | The positioning point for the menu. Can be set by the context menu trigger or the button trigger.                                            | Point \| null \| undefined                                                                                                                                                                                                                                                            | -       |
| loopFocus               | Whether to loop the keyboard navigation.                                                                                                     | boolean \| undefined                                                                                                                                                                                                                                                                  | false   |
| positioning             | The options used to dynamically position the menu                                                                                            | PositioningOptions \| undefined                                                                                                                                                                                                                                                       | -       |
| closeOnSelect           | Whether to close the menu when an option is selected                                                                                         | boolean \| undefined                                                                                                                                                                                                                                                                  | true    |
| aria-label              | The accessibility label for the menu                                                                                                         | string \| undefined                                                                                                                                                                                                                                                                   | -       |
| open                    | The controlled open state of the menu                                                                                                        | boolean \| undefined                                                                                                                                                                                                                                                                  | -       |
| onOpenChange            | Function called when the menu opens or closes                                                                                                | ((details: OpenChangeDetails) => void) \| undefined                                                                                                                                                                                                                                   | -       |
| defaultOpen             | The initial open state of the menu when rendered.&#xA;Use when you don't need to control the open state of the menu.                         | boolean \| undefined                                                                                                                                                                                                                                                                  | -       |
| typeahead               | Whether the pressing printable characters should trigger typeahead navigation                                                                | boolean \| undefined                                                                                                                                                                                                                                                                  | true    |
| composite               | Whether the menu is a composed with other composite widgets like a combobox or tabs                                                          | boolean \| undefined                                                                                                                                                                                                                                                                  | true    |
| navigate                | Function to navigate to the selected item if it's an anchor element                                                                          | ((details: NavigateDetails) => void) \| null \| undefined                                                                                                                                                                                                                             | -       |
| triggerValue            | The controlled trigger value                                                                                                                 | string \| null \| undefined                                                                                                                                                                                                                                                           | -       |
| defaultTriggerValue     | The initial trigger value when rendered.&#xA;Use when you don't need to control the trigger value.                                           | string \| null \| undefined                                                                                                                                                                                                                                                           | -       |
| onTriggerValueChange    | Function called when the trigger value changes.                                                                                              | ((details: TriggerValueChangeDetails) => void) \| undefined                                                                                                                                                                                                                           | -       |
| dir                     | The document's text/writing direction.                                                                                                       | "ltr" \| "rtl" \| undefined                                                                                                                                                                                                                                                           | "ltr"   |
| getRootNode             | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                   | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                                                                                                   | -       |
| onEscapeKeyDown         | Function called when the escape key is pressed                                                                                               | ((event: KeyboardEvent) => void) \| undefined                                                                                                                                                                                                                                         | -       |
| onRequestDismiss        | Function called when this layer is closed due to a parent layer being closed                                                                 | ((event: LayerDismissEvent) => void) \| undefined                                                                                                                                                                                                                                     | -       |
| onPointerDownOutside    | Function called when the pointer is pressed down outside the component                                                                       | ((event: PointerDownOutsideEvent) => void) \| undefined                                                                                                                                                                                                                               | -       |
| onFocusOutside          | Function called when the focus is moved outside the component                                                                                | ((event: FocusOutsideEvent) => void) \| undefined                                                                                                                                                                                                                                     | -       |
| onInteractOutside       | Function called when an interaction happens outside the component                                                                            | ((event: InteractOutsideEvent) => void) \| undefined                                                                                                                                                                                                                                  | -       |
| element                 | Render the element yourself                                                                                                                  | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                                                                                                      | -       |

### Provider

| Prop     | Description | Type                                                   | Default |
| -------- | ----------- | ------------------------------------------------------ | ------- |
| value    | -           | () => MenuApi\<PropTypes> & \{ service: MenuService; } | -       |
| children | -           | Snippet\<\[]> \| undefined                             | -       |

### Context

| Prop     | Description | Type                                                                | Default |
| -------- | ----------- | ------------------------------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => MenuApi\<PropTypes> & \{ service: MenuService; }]> | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### ContextTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Indicator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Positioner

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemGroup

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemGroupLabel

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop          | Description                                                                                                                                     | Type                                             | Default |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| value         | The unique value of the menu item option.                                                                                                       | string                                           | -       |
| disabled      | Whether the menu item is disabled                                                                                                               | boolean \| undefined                             | -       |
| valueText     | The textual value of the option. Used in typeahead navigation of the menu.&#xA;If not provided, the text content of the menu item will be used. | string \| undefined                              | -       |
| closeOnSelect | Whether the menu should be closed when the option is selected.                                                                                  | boolean \| undefined                             | -       |
| element       | Render the element yourself                                                                                                                     | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### OptionItem

| Prop            | Description                                                                                                                                     | Type                                             | Default |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| checked         | Whether the option is checked                                                                                                                   | boolean                                          | -       |
| type            | Whether the option is a radio or a checkbox                                                                                                     | "radio" \| "checkbox"                            | -       |
| value           | The value of the option                                                                                                                         | string                                           | -       |
| onCheckedChange | Function called when the option state is changed                                                                                                | ((checked: boolean) => void) \| undefined        | -       |
| disabled        | Whether the menu item is disabled                                                                                                               | boolean \| undefined                             | -       |
| valueText       | The textual value of the option. Used in typeahead navigation of the menu.&#xA;If not provided, the text content of the menu item will be used. | string \| undefined                              | -       |
| closeOnSelect   | Whether the menu should be closed when the option is selected.                                                                                  | boolean \| undefined                             | -       |
| element         | Render the element yourself                                                                                                                     | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### TriggerItem

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemText

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemIndicator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Separator

| Prop    | Description                 | Type                                            | Default |
| ------- | --------------------------- | ----------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"hr">]> \| undefined | -       |

### Arrow

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ArrowTip

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Navigation

Navigation patterns for apps (bar, rail, sidebar, toggle).

## Bar

```svelte
<script lang="ts">
	import BikeIcon from '@lucide/svelte/icons/bike';
	import BookIcon from '@lucide/svelte/icons/book';
	import HouseIcon from '@lucide/svelte/icons/house';
	import TreePalmIcon from '@lucide/svelte/icons/tree-palm';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Home', href: '/#', icon: HouseIcon },
		{ label: 'Entertainment', href: '/#', icon: BookIcon },
		{ label: 'Recreation', href: '/#', icon: BikeIcon },
		{ label: 'Relaxation', href: '/#', icon: TreePalmIcon },
	];
</script>

<div class="w-[375px] h-[200px] grid grid-rows-[1fr_auto] border border-surface-200-800">
	<div class="flex justify-center items-center">
		<p class="opacity-60">...</p>
	</div>
	<!-- --- -->
	<Navigation layout="bar">
		<Navigation.Menu class="grid grid-cols-4 gap-2">
			{#each links as link (link)}
				{@const Icon = link.icon}
				<Navigation.TriggerAnchor href={link.href}>
					<Icon class="size-5" />
					<Navigation.TriggerText>{link.label}</Navigation.TriggerText>
				</Navigation.TriggerAnchor>
			{/each}
		</Navigation.Menu>
	</Navigation>
	<!-- --- -->
</div>

```

* Recommended for small sized screens (ex: mobile).
* Ideal for vertical screen layouts.
* Should be fixed to the bottom of the viewport.
* Supports 3-5 tiles based on contents and viewport width.
* Consider progressive enhancement with the [Virtual Keyboard API](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API).

## Rail

```svelte
<script lang="ts">
	import BikeIcon from '@lucide/svelte/icons/bike';
	import BookIcon from '@lucide/svelte/icons/book';
	import HouseIcon from '@lucide/svelte/icons/house';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import SkullIcon from '@lucide/svelte/icons/skull';
	import TreePalmIcon from '@lucide/svelte/icons/tree-palm';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Home', href: '/#', icon: HouseIcon },
		{ label: 'Entertainment', href: '/#', icon: BookIcon },
		{ label: 'Recreation', href: '/#', icon: BikeIcon },
		{ label: 'Relaxation', href: '/#', icon: TreePalmIcon },
	];
</script>

<div class="w-full h-[640px] grid grid-cols-[auto_1fr] border border-surface-200-800">
	<!-- --- -->
	<Navigation layout="rail">
		<Navigation.Header>
			<Navigation.TriggerAnchor href="/#" title="View Homepage" aria-label="View Homepage">
				<SkullIcon class="size-8" />
			</Navigation.TriggerAnchor>
		</Navigation.Header>
		<Navigation.Content>
			<Navigation.Menu>
				{#each links as link (link)}
					{@const Icon = link.icon}
					<Navigation.TriggerAnchor href={link.href}>
						<Icon class="size-5" />
						<Navigation.TriggerText>{link.label}</Navigation.TriggerText>
					</Navigation.TriggerAnchor>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
		<Navigation.Footer>
			<Navigation.TriggerAnchor href="/#" title="Settings" aria-label="Settings">
				<SettingsIcon class="size-5" />
			</Navigation.TriggerAnchor>
		</Navigation.Footer>
	</Navigation>
	<!-- --- -->
	<div class="flex justify-center items-center">
		<p class="opacity-50">Contents</p>
	</div>
</div>

```

* Recommended for medium sized screens (ex: tablet).
* Ideal for horizontal screen layouts.
* Should be fixed to the left or right of the viewport.
* Supports 3-7 tiles based on contents and viewport height.

## Sidebar

```svelte
<script lang="ts">
	import BedDoubleIcon from '@lucide/svelte/icons/bed-double';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import BookIcon from '@lucide/svelte/icons/book';
	import BubblesIcon from '@lucide/svelte/icons/bubbles';
	import HouseIcon from '@lucide/svelte/icons/house';
	import MountainIcon from '@lucide/svelte/icons/mountain';
	import PopcornIcon from '@lucide/svelte/icons/popcorn';
	import SailboatIcon from '@lucide/svelte/icons/sailboat';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import SkullIcon from '@lucide/svelte/icons/skull';
	import TreePalmIcon from '@lucide/svelte/icons/tree-palm';
	import TvIcon from '@lucide/svelte/icons/tv';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const linksSidebar = {
		entertainment: [
			{ label: 'Books', href: '/#', icon: BookIcon },
			{ label: 'Movies', href: '/#', icon: PopcornIcon },
			{ label: 'Television', href: '/#', icon: TvIcon },
		],
		recreation: [
			{ label: 'Biking', href: '/#', icon: BikeIcon },
			{ label: 'Sailing', href: '/#', icon: SailboatIcon },
			{ label: 'Hiking', href: '/#', icon: MountainIcon },
		],
		relaxation: [
			{ label: 'Lounge', href: '/#', icon: TreePalmIcon },
			{ label: 'Spa', href: '/#', icon: BubblesIcon },
			{ label: 'Sleep', href: '/#', icon: BedDoubleIcon },
		],
	};
</script>

<div class="w-full h-[728px] grid grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
	<!-- --- -->
	<Navigation layout="sidebar" class="grid grid-rows-[auto_1fr_auto] gap-4">
		<Navigation.Header>
			<a href="https://www.skeleton.dev" class="btn-icon btn-icon-lg preset-filled-primary-500">
				<SkullIcon class="size-6" />
			</a>
		</Navigation.Header>
		<Navigation.Content>
			<Navigation.Group>
				<Navigation.Menu>
					<Navigation.TriggerAnchor href="/">
						<HouseIcon class="size-4" />
						<Navigation.TriggerText>Home</Navigation.TriggerText>
					</Navigation.TriggerAnchor>
				</Navigation.Menu>
			</Navigation.Group>
			{#each Object.entries(linksSidebar) as [category, links]}
				<Navigation.Group>
					<Navigation.Label class="capitalize pl-2">{category}</Navigation.Label>
					<Navigation.Menu>
						{#each links as link (link)}
							{@const Icon = link.icon}
							<Navigation.TriggerAnchor href={link.href} title={link.label} aria-label={link.label}>
								<Icon class="size-4" />
								<Navigation.TriggerText>{link.label}</Navigation.TriggerText>
							</Navigation.TriggerAnchor>
						{/each}
					</Navigation.Menu>
				</Navigation.Group>
			{/each}
		</Navigation.Content>
		<Navigation.Footer>
			<Navigation.TriggerAnchor href="/" title="Settings" aria-label="Settings">
				<SettingsIcon class="size-4" />
				<Navigation.TriggerText>Settings</Navigation.TriggerText>
			</Navigation.TriggerAnchor>
		</Navigation.Footer>
	</Navigation>
	<!-- --- -->
	<div class="flex justify-center items-center">
		<p class="opacity-50">Contents</p>
	</div>
</div>

```

* Recommended for large sized screens (ex: desktop).
* Ideal for horizontal screen layouts.
* Should be fixed to the left or right of the viewport.
* Supports multiple groups of links for deep navigation.
* Supports a label field per each group.
* Can scroll vertically if contents extend beyond the viewport height.

## Toggle Layout

Using reactive state we can dynamically switch between multiple layouts. Tap the double arrow icon to toggle.

```svelte
<script lang="ts">
	import ArrowLeftRightIcon from '@lucide/svelte/icons/arrow-left-right';
	import BikeIcon from '@lucide/svelte/icons/bike';
	import BookIcon from '@lucide/svelte/icons/book';
	import HouseIcon from '@lucide/svelte/icons/house';
	import TreePalmIcon from '@lucide/svelte/icons/tree-palm';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	const links = [
		{ label: 'Home', href: '/#', icon: HouseIcon },
		{ label: 'Entertainment', href: '/#', icon: BookIcon },
		{ label: 'Recreation', href: '/#', icon: BikeIcon },
		{ label: 'Relaxation', href: '/#', icon: TreePalmIcon },
	];

	const buttonClasses = 'btn hover:preset-tonal';
	let anchorRail = `${buttonClasses} aspect-square w-full max-w-[84px] flex flex-col items-center gap-0.5`;
	let anchorSidebar = `${buttonClasses} justify-start px-2 w-full`;

	let layoutRail = $state(true);

	function toggleLayout() {
		layoutRail = !layoutRail;
	}
</script>

<div class="w-full h-[728px] grid grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
	<!-- --- -->
	<Navigation layout={layoutRail ? 'rail' : 'sidebar'} class={layoutRail ? '' : 'grid grid-rows-[1fr_auto] gap-4'}>
		<Navigation.Content>
			<Navigation.Header>
				<Navigation.Trigger onclick={toggleLayout}>
					<ArrowLeftRightIcon class={layoutRail ? 'size-5' : 'size-4'} />
					{#if !layoutRail}<span>Resize</span>{/if}
				</Navigation.Trigger>
			</Navigation.Header>
			<Navigation.Menu>
				{#each links as link (link)}
					{@const Icon = link.icon}
					<Navigation.TriggerAnchor>
						<Icon class={layoutRail ? 'size-5' : 'size-4'} />
						<Navigation.TriggerText>{link.label}</Navigation.TriggerText>
					</Navigation.TriggerAnchor>
				{/each}
			</Navigation.Menu>
		</Navigation.Content>
	</Navigation>
	<!-- --- -->
	<div class="flex justify-center items-center">
		<pre class="pre">Layout: {layoutRail ? 'Rail' : 'Sidebar'}</pre>
	</div>
</div>

```

## Anatomy

Here's an overview of how the Navigation component is structured in code:

```svelte
<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
</script>

<Navigation>
	<Navigation.Header />
	<Navigation.Content>
		<Navigation.Group>
			<Navigation.Label />
			<Navigation.Menu />
		</Navigation.Group>
	</Navigation.Content>
	<Navigation.Footer />
</Navigation>
```

## API Reference

### Root

| Prop    | Description                                                                                  | Type                                             | Default |
| ------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| layout  | Sets the data-layout attribute, which modifies the visual presentation of the component set. | "bar" \| "rail" \| "sidebar" \| undefined        | bar     |
| element | Render the element yourself                                                                  | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Header

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"header">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Group

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Label

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Menu

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### TriggerAnchor

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"anchor">]> \| undefined | -       |

### TriggerText

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### Footer

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"footer">]> \| undefined | -       |

# Pagination

Client and server-side pagination controls.

```svelte
<script lang="ts" module>
	const PAGE_SIZE = 5;
</script>

<script>
	import { users } from './data';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';

	let page = $state(1);

	const start = $derived((page - 1) * PAGE_SIZE);
	const end = $derived(start + PAGE_SIZE);
	const paginatedUsers = $derived(users.slice(start, end));
</script>

<div class="grid gap-4 w-full place-items-center">
	<table class="table table-auto">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Email</th>
				<th>Country</th>
			</tr>
		</thead>
		<tbody>
			{#each paginatedUsers as user}
				<tr>
					<td>{user.id}</td>
					<td>{user.name}</td>
					<td>{user.email}</td>
					<td>{user.country}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<Pagination count={users.length} pageSize={PAGE_SIZE} {page} onPageChange={(event) => (page = event.page)}>
		<Pagination.PrevTrigger>
			<ArrowLeftIcon class="size-4" />
		</Pagination.PrevTrigger>
		<Pagination.Context>
			{#snippet children(pagination)}
				{#each pagination().pages as page, index (page)}
					{#if page.type === 'page'}
						<Pagination.Item {...page}>
							{page.value}
						</Pagination.Item>
					{:else}
						<Pagination.Ellipsis {index}>&#8230;</Pagination.Ellipsis>
					{/if}
				{/each}
			{/snippet}
		</Pagination.Context>
		<Pagination.NextTrigger>
			<ArrowRightIcon class="size-4" />
		</Pagination.NextTrigger>
	</Pagination>
</div>

```

```ts
import { faker } from '@faker-js/faker';

faker.seed(0);

export const users = Array.from({ length: 500 }, (_, i) => ({
	id: i + 1,
	name: faker.person.fullName(),
	email: faker.internet.email(),
	country: faker.location.country(),
}));

```

## Page Size

Implement a custom page `pageSize` amount using a select element.

```svelte
<script lang="ts">
	import { users } from './data';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';

	let page = $state(1);
	let pageSize = $state(5);

	const start = $derived((page - 1) * pageSize);
	const end = $derived(start + pageSize);
	const paginatedUsers = $derived(users.slice(start, end));
</script>

<div class="grid gap-4 w-full place-items-center">
	<table class="table table-auto">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Email</th>
				<th>Country</th>
			</tr>
		</thead>
		<tbody>
			{#each paginatedUsers as user}
				<tr>
					<td>{user.id}</td>
					<td>{user.name}</td>
					<td>{user.email}</td>
					<td>{user.country}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="flex justify-between items-center gap-4 w-full">
		<label class="label">
			<span class="sr-only">Page Size</span>
			<select class="select w-fit" value={String(pageSize)} onchange={(e) => (pageSize = Number(e.currentTarget.value))}>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
			</select>
		</label>
		<Pagination count={users.length} {pageSize} {page} onPageChange={(event) => (page = event.page)}>
			<Pagination.PrevTrigger>
				<ArrowLeftIcon class="size-4" />
			</Pagination.PrevTrigger>
			<Pagination.Context>
				{#snippet children(pagination)}
					{#each pagination().pages as page, index (page)}
						{#if page.type === 'page'}
							<Pagination.Item {...page}>
								{page.value}
							</Pagination.Item>
						{:else}
							<Pagination.Ellipsis {index}>&#8230;</Pagination.Ellipsis>
						{/if}
					{/each}
				{/snippet}
			</Pagination.Context>
			<Pagination.NextTrigger>
				<ArrowRightIcon class="size-4" />
			</Pagination.NextTrigger>
		</Pagination>
	</div>
</div>

```

```ts
import { faker } from '@faker-js/faker';

faker.seed(0);

export const users = Array.from({ length: 500 }, (_, i) => ({
	id: i + 1,
	name: faker.person.fullName(),
	email: faker.internet.email(),
	country: faker.location.country(),
}));

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts" module>
	const PAGE_SIZE = 5;
</script>

<script lang="ts">
	import { users } from './data';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';

	let page = $state(1);

	const start = $derived((page - 1) * PAGE_SIZE);
	const end = $derived(start + PAGE_SIZE);
	const paginatedUsers = $derived(users.slice(start, end));
</script>

<div class="grid gap-4 w-full place-items-center">
	<table class="table table-auto">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Email</th>
				<th>Country</th>
			</tr>
		</thead>
		<tbody>
			{#each paginatedUsers as user}
				<tr>
					<td>{user.id}</td>
					<td>{user.name}</td>
					<td>{user.email}</td>
					<td>{user.country}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<Pagination count={users.length} pageSize={PAGE_SIZE} {page} onPageChange={(event) => (page = event.page)} dir="rtl">
		<Pagination.PrevTrigger>
			<ArrowRightIcon class="size-4" />
		</Pagination.PrevTrigger>
		<Pagination.Context>
			{#snippet children(pagination)}
				{#each pagination().pages as page, index (page)}
					{#if page.type === 'page'}
						<Pagination.Item {...page}>
							{page.value}
						</Pagination.Item>
					{:else}
						<Pagination.Ellipsis {index}>&#8230;</Pagination.Ellipsis>
					{/if}
				{/each}
			{/snippet}
		</Pagination.Context>
		<Pagination.NextTrigger>
			<ArrowLeftIcon class="size-4" />
		</Pagination.NextTrigger>
	</Pagination>
</div>

```

```ts
import { faker } from '@faker-js/faker';

faker.seed(0);

export const users = Array.from({ length: 500 }, (_, i) => ({
	id: i + 1,
	name: faker.person.fullName(),
	email: faker.internet.email(),
	country: faker.location.country(),
}));

```

## Total Count

For server-side pagination, your data source may be truncated. Make sure to specify the total records using `count`.

```ts
const res = {
	"results": [...],
	"pagination": {
		"page": 1,
		"limit": 10,
		"count": 500,
	}
}
```

{/* prettier-ignore */}

```html
<Pagination
	page={res.pagination.page}
	count={res.pagination.count}
	pageSize={res.pagination.limit}
>
	<!-- ... -->
</Pagination>
```

## Anatomy

Here's an overview of how the Pagination component is structured in code:

```svelte
<script lang="ts">
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
</script>

<Pagination>
	<Pagination.FirstTrigger />
	<Pagination.PrevTrigger />
	<Pagination.Item />
	<Pagination.Ellipsis />
	<Pagination.NextTrigger />
	<Pagination.LastTrigger />
</Pagination>
```

## API Reference

### Root

| Prop             | Description                                                                                                                      | Type                                                                                                                                                                                                | Default  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| ids              | The ids of the elements in the accordion. Useful for composition.                                                                | Partial\<\{ root: string; ellipsis: (index: number) => string; firstTrigger: string; prevTrigger: string; nextTrigger: string; lastTrigger: string; item: (page: number) => string; }> \| undefined | -        |
| translations     | Specifies the localized strings that identifies the accessibility elements and their states                                      | IntlTranslations \| undefined                                                                                                                                                                       | -        |
| count            | Total number of data items                                                                                                       | number \| undefined                                                                                                                                                                                 | -        |
| pageSize         | The controlled number of data items per page                                                                                     | number \| undefined                                                                                                                                                                                 | -        |
| defaultPageSize  | The initial number of data items per page when rendered.&#xA;Use when you don't need to control the page size of the pagination. | number \| undefined                                                                                                                                                                                 | 10       |
| siblingCount     | Number of pages to show beside active page                                                                                       | number \| undefined                                                                                                                                                                                 | 1        |
| boundaryCount    | Number of pages to show at the beginning and end                                                                                 | number \| undefined                                                                                                                                                                                 | 1        |
| page             | The controlled active page                                                                                                       | number \| undefined                                                                                                                                                                                 | -        |
| defaultPage      | The initial active page when rendered.&#xA;Use when you don't need to control the active page of the pagination.                 | number \| undefined                                                                                                                                                                                 | 1        |
| onPageChange     | Called when the page number is changed                                                                                           | ((details: PageChangeDetails) => void) \| undefined                                                                                                                                                 | -        |
| onPageSizeChange | Called when the page size is changed                                                                                             | ((details: PageSizeChangeDetails) => void) \| undefined                                                                                                                                             | -        |
| type             | The type of the trigger element                                                                                                  | "button" \| "link" \| undefined                                                                                                                                                                     | "button" |
| getPageUrl       | Function to generate href attributes for pagination links.&#xA;Only used when \`type\` is set to "link".                         | ((details: PageUrlDetails) => string) \| undefined                                                                                                                                                  | -        |
| dir              | The document's text/writing direction.                                                                                           | "ltr" \| "rtl" \| undefined                                                                                                                                                                         | "ltr"    |
| getRootNode      | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                       | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                 | -        |
| element          | Render the element yourself                                                                                                      | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                    | -        |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => PaginationApi\<PropTypes>                  | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                         | Default |
| -------- | ----------- | -------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => PaginationApi\<PropTypes>]> | -       |

### FirstTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### PrevTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Item

| Prop    | Description                 | Type                                           | Default |
| ------- | --------------------------- | ---------------------------------------------- | ------- |
| type    | -                           | "page"                                         | -       |
| value   | -                           | number                                         | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"a">]> \| undefined | -       |

### Ellipsis

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| index   | -                           | number                                            | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### NextTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### LastTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

# Popover

Small overlay panels positioned relative to a trigger.

```svelte
<script>
	import XIcon from '@lucide/svelte/icons/x';
	import { Avatar, Popover, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Popover>
	<Popover.Trigger class="btn preset-filled">Trigger</Popover.Trigger>
	<Portal>
		<Popover.Positioner>
			<Popover.Content class="card w-96 p-4 bg-surface-100-900 shadow-xl">
				<div class="space-y-4">
					<header class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
						<Avatar>
							<Avatar.Image
								src="https://cdn.bsky.app/img/avatar/plain/did:plc:whtgi5zx7ylmdw2i76vq7vq4/bafkreibgoxuqahwcpiah22yfovqszh33x2u4sysmqoyuk5j54aoakt7364@jpeg"
								alt="Skeleton Labs"
							/>
						</Avatar>
						<div>
							<Popover.Title class="text-lg font-bold">Skeleton Labs</Popover.Title>
							<a href="https://bsky.app/profile/skeleton.dev" target="_blank" class="anchor">@skeletonlabs.dev</a>
						</div>
						<Popover.CloseTrigger class="btn-icon hover:preset-tonal self-start">
							<XIcon class="size-4" />
						</Popover.CloseTrigger>
					</header>
					<Popover.Description>Your friendly neighborhood open source maintainers. Creators of Skeleton.</Popover.Description>
					<div class="flex gap-4">
						<p class="text-sm">800 <span class="opacity-60">Followers</span></p>
						<p class="text-sm">120 <span class="opacity-60">Following</span></p>
						<p class="text-sm">100 <span class="opacity-60">Posts</span></p>
					</div>
				</div>
				<Popover.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-100-900)]">
					<Popover.ArrowTip />
				</Popover.Arrow>
			</Popover.Content>
		</Popover.Positioner>
	</Portal>
</Popover>

```

Breaking convention in Skeleton, this component is provided "headless". Meaning no default styles are applied out of the box. This ensures you retain full control of all styling for maximum flexibility.

## Anchor

Use the `Anchor` component to position the popover contents relative to an element other than the trigger.

```svelte
<script>
	import XIcon from '@lucide/svelte/icons/x';
	import { Avatar, Popover, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Popover>
	<div class="flex items-center gap-4">
		<Popover.Anchor>
			<Avatar>
				<Avatar.Image
					src="https://cdn.bsky.app/img/avatar/plain/did:plc:whtgi5zx7ylmdw2i76vq7vq4/bafkreibgoxuqahwcpiah22yfovqszh33x2u4sysmqoyuk5j54aoakt7364@jpeg"
					alt="Skeleton Labs"
				/>
			</Avatar>
		</Popover.Anchor>
		<Popover.Trigger class="btn preset-filled">Show Profile</Popover.Trigger>
	</div>
	<Portal>
		<Popover.Positioner>
			<Popover.Content class="card w-96 p-4 bg-surface-100-900 shadow-xl">
				<div class="space-y-4">
					<header class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
						<Avatar>
							<Avatar.Image
								src="https://cdn.bsky.app/img/avatar/plain/did:plc:whtgi5zx7ylmdw2i76vq7vq4/bafkreibgoxuqahwcpiah22yfovqszh33x2u4sysmqoyuk5j54aoakt7364@jpeg"
								alt="Skeleton Labs"
							/>
						</Avatar>
						<div>
							<Popover.Title class="text-lg font-bold">Skeleton Labs</Popover.Title>
							<a href="https://bsky.app/profile/skeleton.dev" target="_blank" rel="noopener noreferrer" class="anchor">@skeletonlabs.dev</a>
						</div>
						<Popover.CloseTrigger class="btn-icon hover:preset-tonal self-start">
							<XIcon class="size-4" />
						</Popover.CloseTrigger>
					</header>
					<Popover.Description>Your friendly neighborhood open source maintainers. Creators of Skeleton.</Popover.Description>
					<div class="flex gap-4">
						<p class="text-sm">800 <span class="opacity-60">Followers</span></p>
						<p class="text-sm">120 <span class="opacity-60">Following</span></p>
						<p class="text-sm">100 <span class="opacity-60">Posts</span></p>
					</div>
				</div>
				<Popover.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-100-900)]">
					<Popover.ArrowTip />
				</Popover.Arrow>
			</Popover.Content>
		</Popover.Positioner>
	</Portal>
</Popover>

```

## Arrow

Visually connects the popover content to the trigger element. Will automatically align based on the selected side.

```svelte
<script>
	import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Popover>
	<Popover.Trigger class="btn preset-filled">Trigger</Popover.Trigger>
	<Portal>
		<Popover.Positioner>
			<Popover.Content class="card max-w-md p-4 bg-surface-100-900 shadow-xl">
				<Popover.Description>This example will have a small arrow.</Popover.Description>
				<Popover.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-100-900)]">
					<Popover.ArrowTip />
				</Popover.Arrow>
			</Popover.Content>
		</Popover.Positioner>
	</Portal>
</Popover>

```

## Z-Index

By default Skeleton does not take an opinionated stance regarding z-index stacking. The result is the component can sometimes be occluded beneath other elements with a higher index. The Z-Index can controlled by applying a utility class to the `Positioner` component.

```svelte
<script>
	import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="grid grid-cols-2 gap-4">
	<Popover>
		<Popover.Trigger class="btn preset-filled">Default (auto)</Popover.Trigger>
		<Portal>
			<Popover.Positioner>
				<Popover.Content class="card max-w-md p-4 bg-surface-100-900 space-y-2">
					<Popover.Description>This example will be below the sibling.</Popover.Description>
				</Popover.Content>
			</Popover.Positioner>
		</Portal>
	</Popover>

	<Popover>
		<Popover.Trigger class="btn preset-filled">Above (20)</Popover.Trigger>
		<Portal>
			<Popover.Positioner class="z-20!">
				<Popover.Content class="card max-w-md p-4 bg-surface-100-900 shadow-xl space-y-2">
					<Popover.Description>This example will be above the sibling.</Popover.Description>
				</Popover.Content>
			</Popover.Positioner>
		</Portal>
	</Popover>

	<div class="col-span-2 h-[100px] relative">
		<div class="rounded bg-primary-200-800/75 w-full h-full z-10 flex justify-center items-center absolute">Sibling (10)</div>
	</div>
</div>

```

## Provider Pattern

Use the [Provider Pattern](/docs/\[framework]/get-started/fundamentals#provider-pattern) to gain access to the inner component APIs.

```svelte
<script>
	import { Popover, Portal, usePopover } from '@skeletonlabs/skeleton-svelte';

	const id = $props.id();
	const popover = usePopover({
		id: id,
		closeOnInteractOutside: false,
	});

	function showAndHide() {
		popover().setOpen(true);
		setTimeout(() => {
			popover().setOpen(false);
		}, 3000);
	}
</script>

<div class="flex flex-col gap-4">
	<button class="btn preset-filled" onclick={showAndHide}>Show for 3 seconds</button>

	<Popover.Provider value={popover}>
		<Popover.Trigger class="btn preset-tonal">Anchor</Popover.Trigger>
		<Portal>
			<Popover.Positioner>
				<Popover.Content class="card max-w-sm p-4 bg-surface-100-900 shadow-xl space-y-2">
					<Popover.Description>This popover will appear, stay open for three seconds, then close on it's own.</Popover.Description>
				</Popover.Content>
			</Popover.Positioner>
		</Portal>
	</Popover.Provider>
</div>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script>
	import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Popover dir="rtl">
	<Popover.Trigger class="btn preset-filled">Trigger</Popover.Trigger>
	<Portal>
		<Popover.Positioner>
			<Popover.Content class="card max-w-md p-4 bg-surface-100-900 shadow-xl space-y-2">
				<Popover.Title class="font-bold">Example</Popover.Title>
				<Popover.Description>This is a basic example of a popover.</Popover.Description>
				<Popover.CloseTrigger class="btn preset-tonal">Close</Popover.CloseTrigger>
			</Popover.Content>
		</Popover.Positioner>
	</Portal>
</Popover>

```

## Anatomy

Here's an overview of how the Popover component is structured in code:

```svelte
<script lang="ts">
	import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Popover>
	<Popover.Anchor />
	<Popover.Trigger />
	<Portal>
		<Popover.Positioner>
			<Popover.Content>
				<Popover.Title />
				<Popover.Description />
				<Popover.CloseTrigger />
				<Popover.Arrow>
					<Popover.ArrowTip />
				</Popover.Arrow>
			</Popover.Content>
		</Popover.Positioner>
	</Portal>
</Popover>
```

## API Reference

### Root

| Prop                   | Description                                                                                                                                                                                                                                           | Type                                                                                                                                                                                                                    | Default |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| translations           | Specifies the localized strings that identifies the accessibility elements and their states                                                                                                                                                           | IntlTranslations \| undefined                                                                                                                                                                                           | -       |
| ids                    | The ids of the elements in the popover. Useful for composition.                                                                                                                                                                                       | Partial\<\{ anchor: string; trigger: string \| ((value?: string \| undefined) => string); content: string; title: string; description: string; closeTrigger: string; positioner: string; arrow: string; }> \| undefined | -       |
| modal                  | Whether the popover should be modal. When set to \`true\`:&#xA;- interaction with outside elements will be disabled&#xA;- only popover content will be visible to screen readers&#xA;- scrolling is blocked&#xA;- focus is trapped within the popover | boolean \| undefined                                                                                                                                                                                                    | false   |
| portalled              | Whether the popover is portalled. This will proxy the tabbing behavior regardless of the DOM position&#xA;of the popover content.                                                                                                                     | boolean \| undefined                                                                                                                                                                                                    | true    |
| autoFocus              | Whether to automatically set focus on the first focusable&#xA;content within the popover when opened.                                                                                                                                                 | boolean \| undefined                                                                                                                                                                                                    | true    |
| initialFocusEl         | The element to focus on when the popover is opened.                                                                                                                                                                                                   | (() => HTMLElement \| null) \| undefined                                                                                                                                                                                | -       |
| finalFocusEl           | Element to receive focus when the popover is closed.                                                                                                                                                                                                  | (() => MaybeElement) \| undefined                                                                                                                                                                                       | -       |
| restoreFocus           | Whether to restore focus to the element that had focus before the popover was opened.                                                                                                                                                                 | boolean \| undefined                                                                                                                                                                                                    | true    |
| closeOnInteractOutside | Whether to close the popover when the user clicks outside of the popover.                                                                                                                                                                             | boolean \| undefined                                                                                                                                                                                                    | true    |
| closeOnEscape          | Whether to close the popover when the escape key is pressed.                                                                                                                                                                                          | boolean \| undefined                                                                                                                                                                                                    | true    |
| onOpenChange           | Function invoked when the popover opens or closes                                                                                                                                                                                                     | ((details: OpenChangeDetails) => void) \| undefined                                                                                                                                                                     | -       |
| positioning            | The user provided options used to position the popover content                                                                                                                                                                                        | PositioningOptions \| undefined                                                                                                                                                                                         | -       |
| open                   | The controlled open state of the popover                                                                                                                                                                                                              | boolean \| undefined                                                                                                                                                                                                    | -       |
| defaultOpen            | The initial open state of the popover when rendered.&#xA;Use when you don't need to control the open state of the popover.                                                                                                                            | boolean \| undefined                                                                                                                                                                                                    | -       |
| triggerValue           | The controlled trigger value                                                                                                                                                                                                                          | string \| null \| undefined                                                                                                                                                                                             | -       |
| defaultTriggerValue    | The initial trigger value when rendered.&#xA;Use when you don't need to control the trigger value.                                                                                                                                                    | string \| null \| undefined                                                                                                                                                                                             | -       |
| onTriggerValueChange   | Function called when the trigger value changes.                                                                                                                                                                                                       | ((details: TriggerValueChangeDetails) => void) \| undefined                                                                                                                                                             | -       |
| getRootNode            | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                                                                                                                            | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                                     | -       |
| dir                    | The document's text/writing direction.                                                                                                                                                                                                                | "ltr" \| "rtl" \| undefined                                                                                                                                                                                             | "ltr"   |
| onEscapeKeyDown        | Function called when the escape key is pressed                                                                                                                                                                                                        | ((event: KeyboardEvent) => void) \| undefined                                                                                                                                                                           | -       |
| onRequestDismiss       | Function called when this layer is closed due to a parent layer being closed                                                                                                                                                                          | ((event: LayerDismissEvent) => void) \| undefined                                                                                                                                                                       | -       |
| onPointerDownOutside   | Function called when the pointer is pressed down outside the component                                                                                                                                                                                | ((event: PointerDownOutsideEvent) => void) \| undefined                                                                                                                                                                 | -       |
| onFocusOutside         | Function called when the focus is moved outside the component                                                                                                                                                                                         | ((event: FocusOutsideEvent) => void) \| undefined                                                                                                                                                                       | -       |
| onInteractOutside      | Function called when an interaction happens outside the component                                                                                                                                                                                     | ((event: InteractOutsideEvent) => void) \| undefined                                                                                                                                                                    | -       |
| persistentElements     | Returns the persistent elements that:&#xA;- should not have pointer-events disabled&#xA;- should not trigger the dismiss event                                                                                                                        | (() => Element \| null)\[] \| undefined                                                                                                                                                                                 | -       |
| children               | The default slot content to be rendered within the component.                                                                                                                                                                                         | Snippet\<\[]> \| undefined                                                                                                                                                                                              | -       |

### Provider

| Prop     | Description                                                   | Type                         | Default |
| -------- | ------------------------------------------------------------- | ---------------------------- | ------- |
| value    | -                                                             | () => PopoverApi\<PropTypes> | -       |
| children | The default slot content to be rendered within the component. | Snippet\<\[]> \| undefined   | -       |

### Context

| Prop     | Description | Type                                      | Default |
| -------- | ----------- | ----------------------------------------- | ------- |
| children | -           | Snippet\<\[() => PopoverApi\<PropTypes>]> | -       |

### Anchor

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Positioner

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Arrow

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ArrowTip

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Title

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Description

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### CloseTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

# Portal

Renders children into a DOM node that exists outside the DOM hierarchy.

```svelte
<script lang="ts">
	import SkullIcon from '@lucide/svelte/icons/skull';
	import { Portal } from '@skeletonlabs/skeleton-svelte';

	let disabled = $state(true);
	let target: HTMLElement | undefined = $state();

	const cardClasses = 'card preset-outlined-surface-300-700 size-24 grid place-items-center p-4';
	const buttonClasses = 'col-span-2 btn preset-filled';
</script>

<div class="grid grid-cols-2 gap-4">
	<!-- Source -->
	<div class={cardClasses}>
		<Portal {disabled} {target}>
			<SkullIcon class="size-8" />
		</Portal>
	</div>

	<!-- Target -->
	<div class={cardClasses} bind:this={target}>
		<!-- (the content will appear here) -->
	</div>

	<!-- Trigger -->
	<button class={buttonClasses} onclick={() => (disabled = !disabled)}>
		{disabled ? 'Enable' : 'Disable'}
	</button>
</div>

```

## How It Works

When enabled, the content will move from the source to the target element.

## Anatomy

Here's an overview of how the Portal component is structured in code:

```svelte
<script lang="ts">
	import { Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Portal>
	<!-- Content -->
</Portal>
```

## API Reference

### Root

| Prop     | Description                                                                       | Type                     | Default       |
| -------- | --------------------------------------------------------------------------------- | ------------------------ | ------------- |
| disabled | If true, the portal functionality is disabled and children are rendered in place. | boolean \| undefined     | false         |
| target   | The HTML element to which the portal content will be appended.                    | HTMLElement \| undefined | document.body |
| children | The default slot content to be rendered within the component.                     | Snippet\<\[]>            | -             |

# Progress - Circular

Circular progress indicators for showing task progress.

```svelte
<script lang="ts">
	import { Progress, Slider } from '@skeletonlabs/skeleton-svelte';

	let value = $state(50);
</script>

<div class="flex flex-col gap-8 items-center">
	<!-- Progress -->
	<Progress {value} class="items-center w-fit">
		<Progress.Label>Progress</Progress.Label>
		<Progress.Circle>
			<Progress.CircleTrack />
			<Progress.CircleRange />
		</Progress.Circle>
		<Progress.ValueText />
	</Progress>

	<!-- Control -->
	<Slider class="w-full" value={[value]} onValueChange={(e) => (value = e.value[0])} step={10}>
		<Slider.Control>
			<Slider.Track>
				<Slider.Range class="bg-transparent" />
			</Slider.Track>
			<Slider.Thumb index={0}>
				<Slider.HiddenInput />
			</Slider.Thumb>
		</Slider.Control>
	</Slider>
</div>

```

## Size

Use different sizes for context-appropriate indicators.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="flex gap-4 justify-evenly items-center w-full">
	<Progress value={75} class="w-fit">
		<Progress.Circle class="[--size:--spacing(12)]">
			<Progress.CircleTrack />
			<Progress.CircleRange />
		</Progress.Circle>
	</Progress>
	<Progress value={75} class="w-fit">
		<Progress.Circle>
			<Progress.CircleTrack />
			<Progress.CircleRange />
		</Progress.Circle>
	</Progress>
	<Progress value={75} class="w-fit">
		<Progress.Circle class="[--size:--spacing(32)]">
			<Progress.CircleTrack />
			<Progress.CircleRange />
		</Progress.Circle>
	</Progress>
</div>

```

## Color

Change the track and indicator color using utility classes or custom CSS variables to match your design system.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="flex gap-4 justify-evenly items-center w-full">
	<Progress value={40} class="w-fit">
		<Progress.Circle>
			<Progress.CircleTrack class="stroke-primary-50-950" />
			<Progress.CircleRange class="stroke-primary-500" />
		</Progress.Circle>
	</Progress>
	<Progress value={40} class="w-fit">
		<Progress.Circle>
			<Progress.CircleTrack class="stroke-secondary-50-950" />
			<Progress.CircleRange class="stroke-secondary-500" />
		</Progress.Circle>
	</Progress>
	<Progress value={40} class="w-fit">
		<Progress.Circle>
			<Progress.CircleTrack class="stroke-tertiary-50-950" />
			<Progress.CircleRange class="stroke-tertiary-500" />
		</Progress.Circle>
	</Progress>
</div>

```

## Centered Content

Place content in the center of the circular progress if needed (for example, a numeric value).

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress class="w-fit relative">
	<div class="absolute inset-0 flex items-center justify-center">
		<Progress.ValueText />
	</div>
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
</Progress>

```

## Indeterminate

Set a `null` value to enable indeterminate mode.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress class="items-center w-fit" value={null}>
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
	<Progress.ValueText />
</Progress>

```

## Format

Use the `format` prop to customize the output of the `ValueText` component. Options include:

* `percentage` (default)
* `decimal` (0.0 - 1.0)
* Custom - via the [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="flex gap-4 justify-evenly items-center w-full">
	<Progress class="items-center w-fit" formatOptions={{ style: 'percent' }}>
		<Progress.Circle>
			<Progress.CircleTrack />
			<Progress.CircleRange />
		</Progress.Circle>
		<Progress.ValueText />
	</Progress>
	<Progress class="items-center w-fit" formatOptions={{ style: 'decimal' }}>
		<Progress.Circle>
			<Progress.CircleTrack />
			<Progress.CircleRange />
		</Progress.Circle>
		<Progress.ValueText />
	</Progress>
	<Progress class="items-center w-fit" formatOptions={{ style: 'currency', currency: 'EUR' }}>
		<Progress.Circle>
			<Progress.CircleTrack />
			<Progress.CircleRange />
		</Progress.Circle>
		<Progress.ValueText />
	</Progress>
</div>

```

## Custom Value Text

Provide a custom renderer for the `ValueText` if you need to show a different layout or label.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress class="items-center w-fit">
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
	<Progress.ValueText>
		<Progress.Context>
			{#snippet children(progress)}
				{progress().value} of {progress().max}
			{/snippet}
		</Progress.Context>
	</Progress.ValueText>
</Progress>

```

## Anatomy

Here's an overview of how the Progress (Circular) component is structured in code:

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress>
	<Progress.Label />
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
	<Progress.ValueText />
</Progress>
```

## API Reference

### Root

| Prop          | Description                                                                                                                | Type                                                                                    | Default               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------- |
| ids           | The ids of the elements in the progress bar. Useful for composition.                                                       | Partial\<\{ root: string; track: string; label: string; circle: string; }> \| undefined | -                     |
| value         | The controlled value of the progress bar.                                                                                  | number \| null \| undefined                                                             | -                     |
| defaultValue  | The initial value of the progress bar when rendered.&#xA;Use when you don't need to control the value of the progress bar. | number \| null \| undefined                                                             | 50                    |
| min           | The minimum allowed value of the progress bar.                                                                             | number \| undefined                                                                     | 0                     |
| max           | The maximum allowed value of the progress bar.                                                                             | number \| undefined                                                                     | 100                   |
| translations  | The localized messages to use.                                                                                             | IntlTranslations \| undefined                                                           | -                     |
| onValueChange | Callback fired when the value changes.                                                                                     | ((details: ValueChangeDetails) => void) \| undefined                                    | -                     |
| formatOptions | The options to use for formatting the value.                                                                               | NumberFormatOptions \| undefined                                                        | \{ style: "percent" } |
| locale        | The locale to use for formatting the value.                                                                                | string \| undefined                                                                     | "en-US"               |
| dir           | The document's text/writing direction.                                                                                     | "ltr" \| "rtl" \| undefined                                                             | "ltr"                 |
| getRootNode   | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                 | (() => ShadowRoot \| Node \| Document) \| undefined                                     | -                     |
| orientation   | The orientation of the element.                                                                                            | "horizontal" \| "vertical" \| undefined                                                 | "horizontal"          |
| element       | Render the element yourself                                                                                                | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                        | -                     |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => ProgressApi\<PropTypes>                    | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                       | Default |
| -------- | ----------- | ------------------------------------------ | ------- |
| children | -           | Snippet\<\[() => ProgressApi\<PropTypes>]> | -       |

### Label

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ValueText

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### Track

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Range

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Circle

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"svg">]> \| undefined | -       |

### CircleTrack

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"circle">]> \| undefined | -       |

### CircleRange

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"circle">]> \| undefined | -       |

# Progress - Linear

An indicator showing the progress or completion of a task.

```svelte
<script lang="ts">
	import { Progress, Slider } from '@skeletonlabs/skeleton-svelte';

	let value = $state(75);
</script>

<div class="w-full space-y-8">
	<!-- Progress -->
	<Progress {value} class="grid grid-cols-[auto_1fr] items-center gap-4">
		<Progress.Label class="text-sm">{value}%</Progress.Label>
		<Progress.Track>
			<Progress.Range />
		</Progress.Track>
	</Progress>

	<!-- Controls -->
	<Slider class="w-32 mx-auto" value={[value]} onValueChange={(e) => (value = e.value[0])} step={10}>
		<Slider.Control>
			<Slider.Track>
				<Slider.Range class="bg-transparent" />
			</Slider.Track>
			<Slider.Thumb index={0}>
				<Slider.HiddenInput />
			</Slider.Thumb>
		</Slider.Control>
	</Slider>
</div>

```

## Color

Change the track and range color using utility classes or custom CSS variables to match your design system.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="flex w-full flex-col gap-8">
	<Progress>
		<Progress.Track class="bg-primary-50-950">
			<Progress.Range class="bg-primary-500" />
		</Progress.Track>
	</Progress>
	<Progress>
		<Progress.Track class="bg-secondary-50-950">
			<Progress.Range class="bg-secondary-500" />
		</Progress.Track>
	</Progress>
	<Progress>
		<Progress.Track class="bg-tertiary-50-950">
			<Progress.Range class="bg-tertiary-500" />
		</Progress.Track>
	</Progress>
</div>

```

## Height

Create variations using different heights.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="flex w-full flex-col gap-8">
	<Progress>
		<Progress.Track class="h-1">
			<Progress.Range />
		</Progress.Track>
	</Progress>
	<Progress>
		<Progress.Track class="h-4">
			<Progress.Range />
		</Progress.Track>
	</Progress>
	<Progress>
		<Progress.Track class="h-6">
			<Progress.Range />
		</Progress.Track>
	</Progress>
</div>

```

## Orientation

Using the `orientation` prop to control the layout.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress orientation="vertical">
	<Progress.Track>
		<Progress.Range />
	</Progress.Track>
</Progress>

```

## Indeterminate

Set a `null` value to enable indeterminate mode.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress value={null}>
	<Progress.Track>
		<Progress.Range />
	</Progress.Track>
</Progress>

```

Use CSS to enable custom animations.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress value={null}>
	<Progress.Track>
		<Progress.Range class="animate-[custom-animation_2s_ease-in-out_infinite]" />
	</Progress.Track>
</Progress>

<style>
	@keyframes -global-custom-animation {
		from {
			scale: 0.5 1;
			transform: translateX(-200%);
		}
		25% {
			transform: translateX(50%);
		}
		50% {
			transform: translateX(-50%);
		}
		75% {
			transform: translateX(150%);
		}
		to {
			scale: 0.5 1;
			transform: translateX(200%);
		}
	}
</style>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress dir="rtl">
	<Progress.Label>Label</Progress.Label>
	<Progress.Track>
		<Progress.Range />
	</Progress.Track>
</Progress>

```

## Native Alternative

Skeleton also provides styles for the native [Progress](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress) element.

```svelte
<progress class="progress" value="50" max="100"></progress>

```

## Anatomy

Here's an overview of how the Progress (Linear) component is structured in code:

```svelte
<script lang="ts">
	import { Progress } from '@skeletonlabs/skeleton-svelte';
</script>

<Progress>
	<Progress.Label />
	<Progress.Track>
		<Progress.Range />
	</Progress.Track>
	<Progress.ValueText />
</Progress>
```

## API Reference

### Root

| Prop          | Description                                                                                                                | Type                                                                                    | Default               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------- |
| ids           | The ids of the elements in the progress bar. Useful for composition.                                                       | Partial\<\{ root: string; track: string; label: string; circle: string; }> \| undefined | -                     |
| value         | The controlled value of the progress bar.                                                                                  | number \| null \| undefined                                                             | -                     |
| defaultValue  | The initial value of the progress bar when rendered.&#xA;Use when you don't need to control the value of the progress bar. | number \| null \| undefined                                                             | 50                    |
| min           | The minimum allowed value of the progress bar.                                                                             | number \| undefined                                                                     | 0                     |
| max           | The maximum allowed value of the progress bar.                                                                             | number \| undefined                                                                     | 100                   |
| translations  | The localized messages to use.                                                                                             | IntlTranslations \| undefined                                                           | -                     |
| onValueChange | Callback fired when the value changes.                                                                                     | ((details: ValueChangeDetails) => void) \| undefined                                    | -                     |
| formatOptions | The options to use for formatting the value.                                                                               | NumberFormatOptions \| undefined                                                        | \{ style: "percent" } |
| locale        | The locale to use for formatting the value.                                                                                | string \| undefined                                                                     | "en-US"               |
| dir           | The document's text/writing direction.                                                                                     | "ltr" \| "rtl" \| undefined                                                             | "ltr"                 |
| getRootNode   | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                 | (() => ShadowRoot \| Node \| Document) \| undefined                                     | -                     |
| orientation   | The orientation of the element.                                                                                            | "horizontal" \| "vertical" \| undefined                                                 | "horizontal"          |
| element       | Render the element yourself                                                                                                | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                        | -                     |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => ProgressApi\<PropTypes>                    | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                       | Default |
| -------- | ----------- | ------------------------------------------ | ------- |
| children | -           | Snippet\<\[() => ProgressApi\<PropTypes>]> | -       |

### Label

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ValueText

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### Track

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Range

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Circle

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"svg">]> \| undefined | -       |

### CircleTrack

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"circle">]> \| undefined | -       |

### CircleRange

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"circle">]> \| undefined | -       |

# QR Code

Render scannable QR codes with a frame, overlay, pattern, and download trigger.

```svelte
<script lang="ts">
	import favicon from '@/assets/favicon.png';
	import { QrCode } from '@skeletonlabs/skeleton-svelte';
</script>

<QrCode value="https://skeleton.dev">
	<QrCode.Frame class="size-full max-size-36">
		<QrCode.Pattern />
	</QrCode.Frame>
	<QrCode.Overlay class="bg-white rounded-full p-1">
		<img src={favicon.src} alt="Skeleton Logo" class="size-12" />
	</QrCode.Overlay>
	<QrCode.DownloadTrigger fileName="skeleton-dev" mimeType="image/png">Download</QrCode.DownloadTrigger>
</QrCode>

```

## Frame Colors

Use brand color for the frame and a contrasting fill for the QR pattern.

```svelte
<script lang="ts">
	import { QrCode } from '@skeletonlabs/skeleton-svelte';
</script>

<QrCode value="https://skeleton.dev">
	<QrCode.Frame class="size-full max-size-36 bg-brand-dark">
		<QrCode.Pattern class="fill-brand-contrast-dark" />
	</QrCode.Frame>
	<QrCode.Overlay />
</QrCode>

```

## Overlay

Demonstrates an overlay with an icon and a contrasting square background to separate it visually from the pattern.

```svelte
<script lang="ts">
	import favicon from '@/assets/favicon.png';
	import { QrCode } from '@skeletonlabs/skeleton-svelte';
</script>

<QrCode value="https://skeleton.dev">
	<QrCode.Frame class="size-full max-size-36">
		<QrCode.Pattern />
	</QrCode.Frame>
	<QrCode.Overlay class="bg-white rounded-full p-1">
		<img src={favicon.src} alt="Skeleton Logo" class="size-12" />
	</QrCode.Overlay>
</QrCode>

```

## Clickable Download

Wrap the visual frame/pattern in the download trigger so clicking the code initiates a download.

```svelte
<script lang="ts">
	import { QrCode } from '@skeletonlabs/skeleton-svelte';
</script>

<QrCode value="https://skeleton.dev">
	<QrCode.DownloadTrigger fileName="skeleton-dev" mimeType="image/png">
		<QrCode.Frame class="size-full max-size-36">
			<QrCode.Pattern />
		</QrCode.Frame>
	</QrCode.DownloadTrigger>
</QrCode>

```

## Anatomy

Here's an overview of how the QrCode component is structured in code:

```svelte
<script lang="ts">
	import { QrCode } from '@skeletonlabs/skeleton-svelte';
</script>

<QrCode value="https://skeleton.dev">
	<QrCode.Frame>
		<QrCode.Pattern />
	</QrCode.Frame>
	<QrCode.Overlay />
	<QrCode.DownloadTrigger />
</QrCode>
```

## API Reference

### Root

| Prop          | Description                                                                                                 | Type                                                     | Default |
| ------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------- |
| value         | The controlled value to encode.                                                                             | string \| undefined                                      | -       |
| defaultValue  | The initial value to encode when rendered.&#xA;Use when you don't need to control the value of the qr code. | string \| undefined                                      | -       |
| ids           | The element ids.                                                                                            | Partial\<\{ root: string; frame: string; }> \| undefined | -       |
| encoding      | The qr code encoding options.                                                                               | QrCodeGenerateOptions \| undefined                       | -       |
| onValueChange | Callback fired when the value changes.                                                                      | ((details: ValueChangeDetails) => void) \| undefined     | -       |
| pixelSize     | The pixel size of the qr code.                                                                              | number \| undefined                                      | -       |
| dir           | The document's text/writing direction.                                                                      | "ltr" \| "rtl" \| undefined                              | "ltr"   |
| getRootNode   | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                  | (() => ShadowRoot \| Node \| Document) \| undefined      | -       |
| element       | Render the element yourself                                                                                 | Snippet\<\[HTMLAttributes\<"div">]> \| undefined         | -       |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => QrCodeApi\<PropTypes>                      | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                     | Default |
| -------- | ----------- | ---------------------------------------- | ------- |
| children | -           | Snippet\<\[() => QrCodeApi\<PropTypes>]> | -       |

### DownloadTrigger

| Prop     | Description                 | Type                                                | Default |
| -------- | --------------------------- | --------------------------------------------------- | ------- |
| mimeType | The mime type of the image. | DataUrlType                                         | -       |
| quality  | The quality of the image.   | number \| undefined                                 | -       |
| fileName | The name of the file.       | string                                              | -       |
| element  | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Frame

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"svg">]> \| undefined | -       |

### Pattern

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"path">]> \| undefined | -       |

### Overlay

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Rating Group

Rating Group allows users to rate something

```svelte
<script lang="ts">
	import { RatingGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<RatingGroup count={5} defaultValue={3}>
	<RatingGroup.Control>
		<RatingGroup.Context>
			{#snippet children(ratingGroup)}
				{#each ratingGroup().items as index (index)}
					<RatingGroup.Item {index} />
				{/each}
			{/snippet}
		</RatingGroup.Context>
	</RatingGroup.Control>
	<RatingGroup.HiddenInput />
</RatingGroup>

```

## Half Step

Set the `allowHalf` prop to enable half steps.

```svelte
<script lang="ts">
	import { RatingGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<RatingGroup count={5} allowHalf={true}>
	<RatingGroup.Control>
		<RatingGroup.Context>
			{#snippet children(ratingGroup)}
				{#each ratingGroup().items as index (index)}
					<RatingGroup.Item {index} />
				{/each}
			{/snippet}
		</RatingGroup.Context>
	</RatingGroup.Control>
	<RatingGroup.HiddenInput />
</RatingGroup>

```

## Custom Icons

Insert your own custom images or icons for the `empty` and `full` states.

```svelte
<script lang="ts">
	import BoneIcon from '@lucide/svelte/icons/bone';
	import SkullIcon from '@lucide/svelte/icons/skull';
	import { RatingGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<RatingGroup count={3}>
	<RatingGroup.Control>
		<RatingGroup.Context>
			{#snippet children(ratingGroup)}
				{#each ratingGroup().items as index (index)}
					<RatingGroup.Item {index}>
						{#snippet empty()}
							<BoneIcon />
						{/snippet}
						{#snippet full()}
							<SkullIcon />
						{/snippet}
					</RatingGroup.Item>
				{/each}
			{/snippet}
		</RatingGroup.Context>
	</RatingGroup.Control>
	<RatingGroup.HiddenInput />
</RatingGroup>

```

## Label

Use the `Label` component to describe the intended usage.

```svelte
<script lang="ts">
	import { RatingGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<RatingGroup count={5}>
	<RatingGroup.Label>Rate us:</RatingGroup.Label>
	<RatingGroup.Control>
		<RatingGroup.Context>
			{#snippet children(ratingGroup)}
				{#each ratingGroup().items as index (index)}
					<RatingGroup.Item {index} />
				{/each}
			{/snippet}
		</RatingGroup.Context>
	</RatingGroup.Control>
	<RatingGroup.HiddenInput />
</RatingGroup>

```

## Disabled

Set the `disabled` prop to enable the disabled state.

```svelte
<script lang="ts">
	import { RatingGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<RatingGroup count={5} disabled={true}>
	<RatingGroup.Control>
		<RatingGroup.Context>
			{#snippet children(ratingGroup)}
				{#each ratingGroup().items as index (index)}
					<RatingGroup.Item {index} />
				{/each}
			{/snippet}
		</RatingGroup.Context>
	</RatingGroup.Control>
	<RatingGroup.HiddenInput />
</RatingGroup>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { RatingGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<RatingGroup count={5} dir="rtl">
	<RatingGroup.Label>Label</RatingGroup.Label>
	<RatingGroup.Control>
		<RatingGroup.Context>
			{#snippet children(ratingGroup)}
				{#each ratingGroup().items as index (index)}
					<RatingGroup.Item {index} />
				{/each}
			{/snippet}
		</RatingGroup.Context>
	</RatingGroup.Control>
	<RatingGroup.HiddenInput />
</RatingGroup>

```

## Anatomy

Here's an overview of how the RatingGroup component is structured in code:

```svelte
<script lang="ts">
	import { RatingGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<RatingGroup>
	<RatingGroup.Label />
	<RatingGroup.Control>
		<RatingGroup.Item />
	</RatingGroup.Control>
	<RatingGroup.HiddenInput />
</RatingGroup>
```

## API Reference

### Root

| Prop          | Description                                                                                                    | Type                                                                                                                         | Default |
| ------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| ids           | The ids of the elements in the rating. Useful for composition.                                                 | Partial\<\{ root: string; label: string; hiddenInput: string; control: string; item: (id: string) => string; }> \| undefined | -       |
| translations  | Specifies the localized strings that identifies the accessibility elements and their states                    | IntlTranslations \| undefined                                                                                                | -       |
| count         | The total number of ratings.                                                                                   | number \| undefined                                                                                                          | 5       |
| name          | The name attribute of the rating element (used in forms).                                                      | string \| undefined                                                                                                          | -       |
| form          | The associate form of the underlying input element.                                                            | string \| undefined                                                                                                          | -       |
| value         | The controlled value of the rating                                                                             | number \| undefined                                                                                                          | -       |
| defaultValue  | The initial value of the rating when rendered.&#xA;Use when you don't need to control the value of the rating. | number \| undefined                                                                                                          | -       |
| readOnly      | Whether the rating is readonly.                                                                                | boolean \| undefined                                                                                                         | -       |
| disabled      | Whether the rating is disabled.                                                                                | boolean \| undefined                                                                                                         | -       |
| required      | Whether the rating is required.                                                                                | boolean \| undefined                                                                                                         | -       |
| allowHalf     | Whether to allow half stars.                                                                                   | boolean \| undefined                                                                                                         | -       |
| autoFocus     | Whether to autofocus the rating.                                                                               | boolean \| undefined                                                                                                         | -       |
| onValueChange | Function to be called when the rating value changes.                                                           | ((details: ValueChangeDetails) => void) \| undefined                                                                         | -       |
| onHoverChange | Function to be called when the rating value is hovered.                                                        | ((details: HoverChangeDetails) => void) \| undefined                                                                         | -       |
| dir           | The document's text/writing direction.                                                                         | "ltr" \| "rtl" \| undefined                                                                                                  | "ltr"   |
| getRootNode   | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                     | (() => ShadowRoot \| Node \| Document) \| undefined                                                                          | -       |
| element       | Render the element yourself                                                                                    | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                             | -       |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => RatingGroupApi\<PropTypes>                 | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                          | Default |
| -------- | ----------- | --------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => RatingGroupApi\<PropTypes>]> | -       |

### Label

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### Control

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop    | Description                                                | Type                                              | Default         |
| ------- | ---------------------------------------------------------- | ------------------------------------------------- | --------------- |
| empty   | The content to render when the item is in the empty state. | any                                               | StarEmpty (SVG) |
| half    | The content to render when the item is in the half state.  | any                                               | StarHalf (SVG)  |
| full    | The content to render when the item is in the full state.  | any                                               | StarFull (SVG)  |
| index   | -                                                          | number                                            | -               |
| element | Render the element yourself                                | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -               |

### HiddenInput

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

# Segmented Control

Capture input for a limited set of options.

```svelte
<script lang="ts">
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';

	let value = $state<string | null>('music');
</script>

<div class="flex flex-col items-center gap-4">
	<SegmentedControl {value} onValueChange={(details) => (value = details.value)}>
		<SegmentedControl.Label>Browse</SegmentedControl.Label>
		<SegmentedControl.Control>
			<SegmentedControl.Indicator />
			<SegmentedControl.Item value="music">
				<SegmentedControl.ItemText>Music</SegmentedControl.ItemText>
				<SegmentedControl.ItemHiddenInput />
			</SegmentedControl.Item>
			<SegmentedControl.Item value="images">
				<SegmentedControl.ItemText>Images</SegmentedControl.ItemText>
				<SegmentedControl.ItemHiddenInput />
			</SegmentedControl.Item>
			<SegmentedControl.Item value="videos">
				<SegmentedControl.ItemText>Videos</SegmentedControl.ItemText>
				<SegmentedControl.ItemHiddenInput />
			</SegmentedControl.Item>
		</SegmentedControl.Control>
	</SegmentedControl>

	<!-- Message -->
	<p><span class="opacity-60">You selected</span> <code class="code">{value}</code></p>
</div>

```

## Icons

To adhere to accessibility best practices, include `title` and `aria-label` when using icon labels.

```svelte
<script lang="ts">
	import AlignCenterVerticalIcon from '@lucide/svelte/icons/align-center-vertical';
	import AlignEndVerticalIcon from '@lucide/svelte/icons/align-end-vertical';
	import AlignStartVerticalIcon from '@lucide/svelte/icons/align-start-vertical';
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';
</script>

<SegmentedControl defaultValue="start">
	<SegmentedControl.Control>
		<SegmentedControl.Indicator />
		<SegmentedControl.Item value="start" title="start" aria-label="start">
			<SegmentedControl.ItemText>
				<AlignStartVerticalIcon class="size-4" />
			</SegmentedControl.ItemText>
			<SegmentedControl.ItemHiddenInput />
		</SegmentedControl.Item>
		<SegmentedControl.Item value="center" title="center" aria-label="center">
			<SegmentedControl.ItemText>
				<AlignCenterVerticalIcon class="size-4" />
			</SegmentedControl.ItemText>
			<SegmentedControl.ItemHiddenInput />
		</SegmentedControl.Item>
		<SegmentedControl.Item value="end" title="end" aria-label="end">
			<SegmentedControl.ItemText>
				<AlignEndVerticalIcon class="size-4" />
			</SegmentedControl.ItemText>
			<SegmentedControl.ItemHiddenInput />
		</SegmentedControl.Item>
	</SegmentedControl.Control>
</SegmentedControl>

```

## Orientation

Using the `orientation` prop to control the layout.

```svelte
<script lang="ts">
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';
</script>

<SegmentedControl defaultValue="music" orientation="vertical">
	<SegmentedControl.Control>
		<SegmentedControl.Indicator />
		<SegmentedControl.Item value="music">
			<SegmentedControl.ItemText>Music</SegmentedControl.ItemText>
			<SegmentedControl.ItemHiddenInput />
		</SegmentedControl.Item>
		<SegmentedControl.Item value="images">
			<SegmentedControl.ItemText>Images</SegmentedControl.ItemText>
			<SegmentedControl.ItemHiddenInput />
		</SegmentedControl.Item>
		<SegmentedControl.Item value="videos">
			<SegmentedControl.ItemText>Videos</SegmentedControl.ItemText>
			<SegmentedControl.ItemHiddenInput />
		</SegmentedControl.Item>
	</SegmentedControl.Control>
</SegmentedControl>

```

## Anatomy

Here's an overview of how the SegmentedControl component is structured in code:

```svelte
<script lang="ts">
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';
</script>

<SegmentedControl>
	<SegmentedControl.Label />
	<SegmentedControl.Control>
		<SegmentedControl.Indicator />
		<SegmentedControl.Item>
			<SegmentedControl.ItemText />
			<SegmentedControl.ItemHiddenInput />
		</SegmentedControl.Item>
	</SegmentedControl.Control>
</SegmentedControl>
```

## API Reference

### Root

| Prop          | Description                                                                                                                | Type                                                                                                                                                                                                                                   | Default |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| ids           | The ids of the elements in the radio. Useful for composition.                                                              | Partial\<\{ root: string; label: string; indicator: string; item: (value: string) => string; itemLabel: (value: string) => string; itemControl: (value: string) => string; itemHiddenInput: (value: string) => string; }> \| undefined | -       |
| value         | The controlled value of the radio group                                                                                    | string \| null \| undefined                                                                                                                                                                                                            | -       |
| defaultValue  | The initial value of the checked radio when rendered.&#xA;Use when you don't need to control the value of the radio group. | string \| null \| undefined                                                                                                                                                                                                            | -       |
| name          | The name of the input fields in the radio&#xA;(Useful for form submission).                                                | string \| undefined                                                                                                                                                                                                                    | -       |
| form          | The associate form of the underlying input.                                                                                | string \| undefined                                                                                                                                                                                                                    | -       |
| disabled      | If \`true\`, the radio group will be disabled                                                                              | boolean \| undefined                                                                                                                                                                                                                   | -       |
| invalid       | If \`true\`, the radio group is marked as invalid.                                                                         | boolean \| undefined                                                                                                                                                                                                                   | -       |
| required      | If \`true\`, the radio group is marked as required.                                                                        | boolean \| undefined                                                                                                                                                                                                                   | -       |
| readOnly      | Whether the radio group is read-only                                                                                       | boolean \| undefined                                                                                                                                                                                                                   | -       |
| onValueChange | Function called once a radio is checked                                                                                    | ((details: ValueChangeDetails) => void) \| undefined                                                                                                                                                                                   | -       |
| orientation   | Orientation of the radio group                                                                                             | "horizontal" \| "vertical" \| undefined                                                                                                                                                                                                | -       |
| dir           | The document's text/writing direction.                                                                                     | "ltr" \| "rtl" \| undefined                                                                                                                                                                                                            | "ltr"   |
| getRootNode   | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                 | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                                                    | -       |
| element       | Render the element yourself                                                                                                | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                                                       | -       |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => RadioGroupApi\<PropTypes>                  | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                         | Default |
| -------- | ----------- | -------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => RadioGroupApi\<PropTypes>]> | -       |

### Label

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### Control

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Indicator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop     | Description                 | Type                                               | Default |
| -------- | --------------------------- | -------------------------------------------------- | ------- |
| value    | -                           | string                                             | -       |
| disabled | -                           | boolean \| undefined                               | -       |
| invalid  | -                           | boolean \| undefined                               | -       |
| element  | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### ItemText

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### ItemHiddenInput

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

# Slider

Capture input from a range of values.

```svelte
<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';
</script>

<Slider defaultValue={[50]}>
	<Slider.Label>Label</Slider.Label>
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb index={0}>
			<Slider.HiddenInput />
		</Slider.Thumb>
	</Slider.Control>
	<Slider.MarkerGroup>
		<Slider.Marker value={25} />
		<Slider.Marker value={50} />
		<Slider.Marker value={75} />
	</Slider.MarkerGroup>
</Slider>

```

## Color

Change the track, range, and thumb color using utility classes or custom CSS variables to match your design system.

```svelte
<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="space-y-8 w-full">
	<Slider defaultValue={[50]}>
		<Slider.Control>
			<Slider.Track class="bg-primary-50-950">
				<Slider.Range class="bg-primary-500" />
			</Slider.Track>
			<Slider.Thumb index={0} class="ring-primary-500">
				<Slider.HiddenInput />
			</Slider.Thumb>
		</Slider.Control>
	</Slider>

	<Slider defaultValue={[50]}>
		<Slider.Control>
			<Slider.Track class="bg-secondary-50-950">
				<Slider.Range class="bg-secondary-500" />
			</Slider.Track>
			<Slider.Thumb index={0} class="ring-secondary-500">
				<Slider.HiddenInput />
			</Slider.Thumb>
		</Slider.Control>
	</Slider>

	<Slider defaultValue={[50]}>
		<Slider.Control>
			<Slider.Track class="bg-tertiary-50-950">
				<Slider.Range class="bg-tertiary-500" />
			</Slider.Track>
			<Slider.Thumb index={0} class="ring-tertiary-500">
				<Slider.HiddenInput />
			</Slider.Thumb>
		</Slider.Control>
	</Slider>
</div>

```

## Disabled

Set the `disabled` prop to enable the disabled state.

```svelte
<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';
</script>

<Slider defaultValue={[50]} disabled>
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb index={0}>
			<Slider.HiddenInput />
		</Slider.Thumb>
	</Slider.Control>
</Slider>

```

## Read-Only

Set the `readOnly` prop to enable the disabled state.

```svelte
<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';
</script>

<Slider defaultValue={[50]} readOnly>
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb index={0}>
			<Slider.HiddenInput />
		</Slider.Thumb>
	</Slider.Control>
</Slider>

```

## Multiple Thumbs

Set a `value` array of two values to enable start and end thumbs.

```svelte
<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';
</script>

<Slider defaultValue={[25, 75]}>
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb index={0}>
			<Slider.HiddenInput />
		</Slider.Thumb>
		<Slider.Thumb index={1}>
			<Slider.HiddenInput />
		</Slider.Thumb>
	</Slider.Control>
</Slider>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';
</script>

<Slider defaultValue={[50]} dir="rtl">
	<Slider.Label>Label</Slider.Label>
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb index={0}>
			<Slider.HiddenInput />
		</Slider.Thumb>
	</Slider.Control>
	<Slider.MarkerGroup>
		<Slider.Marker value={25} />
		<Slider.Marker value={50} />
		<Slider.Marker value={75} />
	</Slider.MarkerGroup>
</Slider>

```

## Anatomy

Here's an overview of how the Slider component is structured in code:

```svelte
<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';
</script>

<Slider>
	<Slider.Label />
	<Slider.Control>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb>
			<Slider.HiddenInput />
		</Slider.Thumb>
	</Slider.Control>
	<Slider.MarkerGroup>
		<Slider.Marker />
	</Slider.MarkerGroup>
	<Slider.ValueText />
</Slider>
```

## API Reference

### Root

| Prop                   | Description                                                                                                                                                                                                                                                                                                                               | Type                                                                                                                                                                                                                                    | Default      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| ids                    | The ids of the elements in the slider. Useful for composition.                                                                                                                                                                                                                                                                            | Partial\<\{ root: string; thumb: (index: number) => string; hiddenInput: (index: number) => string; control: string; track: string; range: string; label: string; valueText: string; marker: (index: number) => string; }> \| undefined | -            |
| aria-label             | The aria-label of each slider thumb. Useful for providing an accessible name to the slider                                                                                                                                                                                                                                                | string\[] \| undefined                                                                                                                                                                                                                  | -            |
| aria-labelledby        | The \`id\` of the elements that labels each slider thumb. Useful for providing an accessible name to the slider                                                                                                                                                                                                                           | string\[] \| undefined                                                                                                                                                                                                                  | -            |
| name                   | The name associated with each slider thumb (when used in a form)                                                                                                                                                                                                                                                                          | string \| undefined                                                                                                                                                                                                                     | -            |
| form                   | The associate form of the underlying input element.                                                                                                                                                                                                                                                                                       | string \| undefined                                                                                                                                                                                                                     | -            |
| value                  | The controlled value of the slider                                                                                                                                                                                                                                                                                                        | number\[] \| undefined                                                                                                                                                                                                                  | -            |
| defaultValue           | The initial value of the slider when rendered.&#xA;Use when you don't need to control the value of the slider.                                                                                                                                                                                                                            | number\[] \| undefined                                                                                                                                                                                                                  | -            |
| disabled               | Whether the slider is disabled                                                                                                                                                                                                                                                                                                            | boolean \| undefined                                                                                                                                                                                                                    | -            |
| readOnly               | Whether the slider is read-only                                                                                                                                                                                                                                                                                                           | boolean \| undefined                                                                                                                                                                                                                    | -            |
| invalid                | Whether the slider is invalid                                                                                                                                                                                                                                                                                                             | boolean \| undefined                                                                                                                                                                                                                    | -            |
| onValueChange          | Function invoked when the value of the slider changes                                                                                                                                                                                                                                                                                     | ((details: ValueChangeDetails) => void) \| undefined                                                                                                                                                                                    | -            |
| onValueChangeEnd       | Function invoked when the slider value change is done                                                                                                                                                                                                                                                                                     | ((details: ValueChangeDetails) => void) \| undefined                                                                                                                                                                                    | -            |
| onFocusChange          | Function invoked when the slider's focused index changes                                                                                                                                                                                                                                                                                  | ((details: FocusChangeDetails) => void) \| undefined                                                                                                                                                                                    | -            |
| getAriaValueText       | Function that returns a human readable value for the slider thumb                                                                                                                                                                                                                                                                         | ((details: ValueTextDetails) => string) \| undefined                                                                                                                                                                                    | -            |
| min                    | The minimum value of the slider                                                                                                                                                                                                                                                                                                           | number \| undefined                                                                                                                                                                                                                     | 0            |
| max                    | The maximum value of the slider                                                                                                                                                                                                                                                                                                           | number \| undefined                                                                                                                                                                                                                     | 100          |
| step                   | The step value of the slider                                                                                                                                                                                                                                                                                                              | number \| undefined                                                                                                                                                                                                                     | 1            |
| minStepsBetweenThumbs  | The minimum permitted steps between multiple thumbs.&#xA;&#xA;\`minStepsBetweenThumbs\` \* \`step\` should reflect the gap between the thumbs.&#xA;&#xA;- \`step: 1\` and \`minStepsBetweenThumbs: 10\` => gap is \`10\`&#xA;- \`step: 10\` and \`minStepsBetweenThumbs: 2\` => gap is \`20\`                                             | number \| undefined                                                                                                                                                                                                                     | 0            |
| orientation            | The orientation of the slider                                                                                                                                                                                                                                                                                                             | "vertical" \| "horizontal" \| undefined                                                                                                                                                                                                 | "horizontal" |
| origin                 | The origin of the slider range. The track is filled from the origin&#xA;to the thumb for single values.&#xA;- "start": Useful when the value represents an absolute value&#xA;- "center": Useful when the value represents an offset (relative)&#xA;- "end": Useful when the value represents an offset from the end                      | "start" \| "center" \| "end" \| undefined                                                                                                                                                                                               | "start"      |
| thumbAlignment         | The alignment of the slider thumb relative to the track&#xA;- \`center\`: the thumb will extend beyond the bounds of the slider track.&#xA;- \`contain\`: the thumb will be contained within the bounds of the track.                                                                                                                     | "center" \| "contain" \| undefined                                                                                                                                                                                                      | "contain"    |
| thumbSize              | The slider thumbs dimensions                                                                                                                                                                                                                                                                                                              | \{ width: number; height: number; } \| undefined                                                                                                                                                                                        | -            |
| thumbCollisionBehavior | Controls how thumbs behave when they collide during pointer interactions.&#xA;- \`none\` (default): Thumbs cannot move past each other; excess movement is ignored.&#xA;- \`push\`: Thumbs push each other without restoring their previous positions when dragged back.&#xA;- \`swap\`: Thumbs swap places when dragged past each other. | "none" \| "push" \| "swap" \| undefined                                                                                                                                                                                                 | "none"       |
| dir                    | The document's text/writing direction.                                                                                                                                                                                                                                                                                                    | "ltr" \| "rtl" \| undefined                                                                                                                                                                                                             | "ltr"        |
| getRootNode            | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                                                                                                                                                                                                                | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                                                     | -            |
| element                | Render the element yourself                                                                                                                                                                                                                                                                                                               | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                                                        | -            |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => SliderApi\<PropTypes>                      | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                     | Default |
| -------- | ----------- | ---------------------------------------- | ------- |
| children | -           | Snippet\<\[() => SliderApi\<PropTypes>]> | -       |

### Label

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### ValueText

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"output">]> \| undefined | -       |

### Control

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Track

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Range

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Thumb

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| index   | -                           | number                                           | -       |
| name    | -                           | string \| undefined                              | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### HiddenInput

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

### MarkerGroup

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Marker

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | number                                           | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Steps

Use steps to guide users through a multi-step process.

```svelte
<script lang="ts">
	import { Steps } from '@skeletonlabs/skeleton-svelte';

	const steps = [
		{ title: 'First', content: 'First do this.' },
		{ title: 'Then', content: 'Then do that.' },
		{ title: 'Finally', content: 'Almost done...' },
	];
</script>

<Steps count={steps.length} class="w-full">
	<Steps.List>
		{#each steps as item, index}
			<Steps.Item {index}>
				<Steps.Trigger>
					<Steps.Indicator>{index + 1}</Steps.Indicator>
					{item.title}
				</Steps.Trigger>
				{#if index < steps.length - 1}
					<Steps.Separator />
				{/if}
			</Steps.Item>
		{/each}
	</Steps.List>
	{#each steps as item, index}
		<Steps.Content {index} class="card preset-filled-surface-100-900 p-4 flex justify-center items-center">
			{item.content}
		</Steps.Content>
	{/each}
	<Steps.Content index={steps.length} class="card preset-filled-surface-100-900 p-4 flex justify-center items-center"
		>All done!</Steps.Content
	>
	<div class="flex justify-between items-center gap-2">
		<Steps.PrevTrigger class="btn preset-filled">Back</Steps.PrevTrigger>
		<Steps.NextTrigger class="btn preset-filled">Next</Steps.NextTrigger>
	</div>
</Steps>

```

## Controlled

Use the `step` and `onStepChange` props to control state programmatically.

```svelte
<script lang="ts">
	import { Steps } from '@skeletonlabs/skeleton-svelte';

	const steps = [
		{ title: 'First', content: 'First do this.' },
		{ title: 'Then', content: 'Then do that.' },
		{ title: 'Finally', content: 'Almost done...' },
	];

	let step = $state(0);
</script>

<Steps {step} onStepChange={(details) => (step = details.step)} count={steps.length} class="w-full">
	<Steps.List>
		{#each steps as item, index}
			<Steps.Item {index}>
				<Steps.Trigger>
					<Steps.Indicator>{index + 1}</Steps.Indicator>
					{item.title}
				</Steps.Trigger>
				{#if index < steps.length - 1}
					<Steps.Separator />
				{/if}
			</Steps.Item>
		{/each}
	</Steps.List>
	{#each steps as item, index}
		<Steps.Content {index} class="card preset-filled-surface-100-900 p-4 flex justify-center items-center">
			{item.content}
		</Steps.Content>
	{/each}
	<Steps.Content index={steps.length} class="card preset-filled-surface-100-900 p-4 flex justify-center items-center"
		>All done!</Steps.Content
	>
	<div class="flex justify-between items-center gap-2">
		<Steps.PrevTrigger class="btn preset-filled">Back</Steps.PrevTrigger>
		<Steps.NextTrigger class="btn preset-filled">Next</Steps.NextTrigger>
	</div>
</Steps>

```

## Orientation

Using the `orientation` prop to control the layout.

```svelte
<script lang="ts">
	import { Steps } from '@skeletonlabs/skeleton-svelte';

	const steps = [
		{ title: 'First', content: 'First do this.' },
		{ title: 'Then', content: 'Then do that.' },
		{ title: 'Finally', content: 'Almost done...' },
	];
</script>

<Steps orientation="vertical" count={steps.length} class="w-full h-48">
	<Steps.List>
		{#each steps as item, index}
			<Steps.Item {index}>
				<Steps.Trigger>
					<Steps.Indicator>{index + 1}</Steps.Indicator>
					{item.title}
				</Steps.Trigger>
				{#if index < steps.length - 1}
					<Steps.Separator />
				{/if}
			</Steps.Item>
		{/each}
	</Steps.List>
	<div class="flex flex-col grow gap-4">
		{#each steps as item, index}
			<Steps.Content {index} class="card preset-filled-surface-100-900 p-4 flex justify-center items-center grow">
				{item.content}
			</Steps.Content>
		{/each}
		<Steps.Content index={steps.length} class="card preset-filled-surface-100-900 p-4 flex justify-center items-center grow"
			>All done!</Steps.Content
		>
		<div class="flex justify-between items-center gap-2">
			<Steps.PrevTrigger class="btn preset-filled">Back</Steps.PrevTrigger>
			<Steps.NextTrigger class="btn preset-filled">Next</Steps.NextTrigger>
		</div>
	</div>
</Steps>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Steps } from '@skeletonlabs/skeleton-svelte';

	const steps = [
		{ title: 'First', content: 'First do this.' },
		{ title: 'Then', content: 'Then do that.' },
		{ title: 'Finally', content: 'Almost done...' },
	];
</script>

<Steps dir="rtl" count={steps.length} class="w-full">
	<Steps.List>
		{#each steps as item, index}
			<Steps.Item {index}>
				<Steps.Trigger>
					<Steps.Indicator>{index + 1}</Steps.Indicator>
					{item.title}
				</Steps.Trigger>
				{#if index < steps.length - 1}
					<Steps.Separator />
				{/if}
			</Steps.Item>
		{/each}
	</Steps.List>
	{#each steps as item, index}
		<Steps.Content {index} class="card preset-filled-surface-100-900 p-4 flex justify-center items-center">
			{item.content}
		</Steps.Content>
	{/each}
	<Steps.Content index={steps.length} class="card preset-filled-surface-100-900 p-4 flex justify-center items-center"
		>All done!</Steps.Content
	>
	<div class="flex justify-between items-center gap-2">
		<Steps.PrevTrigger class="btn preset-filled">Back</Steps.PrevTrigger>
		<Steps.NextTrigger class="btn preset-filled">Next</Steps.NextTrigger>
	</div>
</Steps>

```

## Anatomy

Here's an overview of how the Steps component is structured in code:

```svelte
<script lang="ts">
	import { Steps } from '@skeletonlabs/skeleton-svelte';
</script>

<Steps>
	<Steps.List>
		<Steps.Item>
			<Steps.Trigger>
				<Steps.Indicator />
			</Steps.Trigger>
			<Steps.Separator />
		</Steps.Item>
	</Steps.List>
	<Steps.Content />
	<Steps.PrevTrigger />
	<Steps.NextTrigger />
</Steps>
```

## API Reference

### Root

| Prop            | Description                                                                                                      | Type                                                 | Default      |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------ |
| ids             | The custom ids for the stepper elements                                                                          | ElementIds \| undefined                              | -            |
| step            | The controlled value of the stepper                                                                              | number \| undefined                                  | -            |
| defaultStep     | The initial value of the stepper when rendered.&#xA;Use when you don't need to control the value of the stepper. | number \| undefined                                  | -            |
| onStepChange    | Callback to be called when the value changes                                                                     | ((details: StepChangeDetails) => void) \| undefined  | -            |
| onStepComplete  | Callback to be called when a step is completed                                                                   | VoidFunction \| undefined                            | -            |
| linear          | If \`true\`, the stepper requires the user to complete the steps in order                                        | boolean \| undefined                                 | -            |
| orientation     | The orientation of the stepper                                                                                   | "horizontal" \| "vertical" \| undefined              | "horizontal" |
| count           | The total number of steps                                                                                        | number \| undefined                                  | -            |
| isStepValid     | Whether a step is valid. Invalid steps block forward navigation in linear mode.                                  | ((index: number) => boolean) \| undefined            | () => true   |
| isStepSkippable | Whether a step can be skipped during navigation.&#xA;Skippable steps are bypassed when using next/prev.          | ((index: number) => boolean) \| undefined            | () => false  |
| onStepInvalid   | Called when navigation is blocked due to an invalid step.                                                        | ((details: StepInvalidDetails) => void) \| undefined | -            |
| dir             | The document's text/writing direction.                                                                           | "ltr" \| "rtl" \| undefined                          | "ltr"        |
| getRootNode     | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                       | (() => ShadowRoot \| Node \| Document) \| undefined  | -            |
| element         | Render the element yourself                                                                                      | Snippet\<\[HTMLAttributes\<"div">]> \| undefined     | -            |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => StepsApi\<PropTypes>                       | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                    | Default |
| -------- | ----------- | --------------------------------------- | ------- |
| children | -           | Snippet\<\[() => StepsApi\<PropTypes>]> | -       |

### List

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| index   | -                           | number                                           | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Indicator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Separator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| index   | -                           | number                                           | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### PrevTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### NextTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

# Switch

Toggle between two states, such as on/off.

```svelte
<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let checked = $state(false);
</script>

<div class="flex flex-col items-center gap-4">
	<Switch {checked} onCheckedChange={(details) => (checked = details.checked)}>
		<Switch.Control>
			<Switch.Thumb />
		</Switch.Control>
		<Switch.Label>Label</Switch.Label>
		<Switch.HiddenInput />
	</Switch>
	<p>
		<span class="opacity-60">Checked: </span>
		<code class="code">{checked}</code>
	</p>
</div>

```

## Color

Use the [Tailwind data attribute syntax](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes) to target the state using `data-[state=checked]`

```svelte
<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
</script>

<Switch>
	<Switch.Control class="preset-filled-secondary-50-950 data-[state=checked]:preset-filled-secondary-500">
		<Switch.Thumb />
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>

```

## List

Use the `Label` component to create a list layout.

```svelte
<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="grid gap-2 w-full">
	{#each ['Label 1', 'Label 2', 'Label 3'] as label, i (label)}
		<Switch class="flex justify-between p-2">
			<Switch.Label>{label}</Switch.Label>
			<Switch.Control>
				<Switch.Thumb />
			</Switch.Control>
			<Switch.HiddenInput />
		</Switch>
		{#if i < 2}
			<hr class="hr" />
		{/if}
	{/each}
</div>

```

## Icons

Add icons to act as state indicators.

```svelte
<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
</script>

<Switch>
	<Switch.Control>
		<Switch.Thumb>
			<Switch.Context>
				{#snippet children(switch_)}
					{#if switch_().checked}
						<SunIcon class="size-3" />
					{:else}
						<MoonIcon class="size-3" />
					{/if}
				{/snippet}
			</Switch.Context>
		</Switch.Thumb>
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
</script>

<Switch dir="rtl">
	<Switch.Control>
		<Switch.Thumb />
	</Switch.Control>
	<Switch.Label>Label</Switch.Label>
	<Switch.HiddenInput />
</Switch>

```

## Anatomy

Here's an overview of how the Switch component is structured in code:

```svelte
<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
</script>

<Switch>
	<Switch.Control>
		<Switch.Thumb />
	</Switch.Control>
	<Switch.Label />
	<Switch.HiddenInput />
</Switch>
```

## API Reference

### Root

| Prop            | Description                                                                                                                    | Type                                                                                                          | Default |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------- |
| ids             | The ids of the elements in the switch. Useful for composition.                                                                 | Partial\<\{ root: string; hiddenInput: string; control: string; label: string; thumb: string; }> \| undefined | -       |
| label           | Specifies the localized strings that identifies the accessibility elements and their states                                    | string \| undefined                                                                                           | -       |
| disabled        | Whether the switch is disabled.                                                                                                | boolean \| undefined                                                                                          | -       |
| invalid         | If \`true\`, the switch is marked as invalid.                                                                                  | boolean \| undefined                                                                                          | -       |
| required        | If \`true\`, the switch input is marked as required,                                                                           | boolean \| undefined                                                                                          | -       |
| readOnly        | Whether the switch is read-only                                                                                                | boolean \| undefined                                                                                          | -       |
| onCheckedChange | Function to call when the switch is clicked.                                                                                   | ((details: CheckedChangeDetails) => void) \| undefined                                                        | -       |
| checked         | The controlled checked state of the switch                                                                                     | boolean \| undefined                                                                                          | -       |
| defaultChecked  | The initial checked state of the switch when rendered.&#xA;Use when you don't need to control the checked state of the switch. | boolean \| undefined                                                                                          | -       |
| name            | The name of the input field in a switch&#xA;(Useful for form submission).                                                      | string \| undefined                                                                                           | -       |
| form            | The id of the form that the switch belongs to                                                                                  | string \| undefined                                                                                           | -       |
| value           | The value of switch input. Useful for form submission.                                                                         | string \| number \| undefined                                                                                 | "on"    |
| dir             | The document's text/writing direction.                                                                                         | "ltr" \| "rtl" \| undefined                                                                                   | "ltr"   |
| getRootNode     | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                     | (() => ShadowRoot \| Node \| Document) \| undefined                                                           | -       |
| element         | Render the element yourself                                                                                                    | Snippet\<\[HTMLAttributes\<"label">]> \| undefined                                                            | -       |

### Provider

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| value   | -                           | () => SwitchApi\<PropTypes>                        | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                     | Default |
| -------- | ----------- | ---------------------------------------- | ------- |
| children | -           | Snippet\<\[() => SwitchApi\<PropTypes>]> | -       |

### Control

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### Thumb

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### Label

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### HiddenInput

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

# Tabs

Use tabs to quickly switch between different views and pages.

```svelte
<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
</script>

<Tabs defaultValue="overview">
	<Tabs.List>
		<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger value="features">Key features</Tabs.Trigger>
		<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="overview">
		A concise overview of the project: usage, goals, and recent highlights. Use this area to orient readers with key metrics and links to
		deeper docs.
	</Tabs.Content>
	<Tabs.Content value="features">
		List the most important features here with short, pragmatic descriptions so readers can scan for what matters (accessibility, theming,
		integrations).
	</Tabs.Content>
	<Tabs.Content value="activity">
		Show recent activity or sample data: new releases, PRs merged, or notable user events. This helps examples feel realistic and
		actionable.
	</Tabs.Content>
</Tabs>

```

## Controlled

Use the `value` and `onValueChange` props to control state programmatically.

```svelte
<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let value = $state('overview');
</script>

<Tabs {value} onValueChange={(details) => (value = details.value)}>
	<Tabs.List>
		<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger value="features">Key features</Tabs.Trigger>
		<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="overview">
		A concise overview of the project: usage, goals, and recent highlights. Use this area to orient readers with key metrics and links to
		deeper docs.
	</Tabs.Content>
	<Tabs.Content value="features">
		List the most important features here with short, pragmatic descriptions so readers can scan for what matters (accessibility, theming,
		integrations).
	</Tabs.Content>
	<Tabs.Content value="activity">
		Show recent activity or sample data: new releases, PRs merged, or notable user events. This helps examples feel realistic and
		actionable.
	</Tabs.Content>
</Tabs>

```

## Navigation

Use the `element` slot to override the default `button` with an `a` tag for navigation tabs.

```svelte
<script lang="ts">
	/**
	 * Because demonstrating navigation inside a code snippet is not feasible, this example uses local state to simulate URL path changes.
	 *
	 * In a real application, you would:
	 * - Replace the `url` variable with the `url` of the current page.
	 * - Replace `onValueChange={(details) => setUrl(details.value)}` with `navigate((details) => navigate(details.value))` using your framework's navigation method.
	 */
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let url = $state.raw('#overview');
</script>

<Tabs value={url} onValueChange={(details) => (url = details.value)}>
	<Tabs.List>
		<Tabs.Trigger value="#overview">
			{#snippet element(attributes)}
				<a {...attributes as HTMLAnchorAttributes} href="#overview">Overview</a>
			{/snippet}
		</Tabs.Trigger>
		<Tabs.Trigger value="#key-features">
			{#snippet element(attributes)}
				<a {...attributes as HTMLAnchorAttributes} href="#key-features">Key Features</a>
			{/snippet}
		</Tabs.Trigger>
		<Tabs.Trigger value="#activity">
			{#snippet element(attributes)}
				<a {...attributes as HTMLAnchorAttributes} href="#activity">Activity</a>
			{/snippet}
		</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="#overview">
		A concise overview of the project: usage, goals, and recent highlights. Use this area to orient readers with key metrics and links to
		deeper docs.
	</Tabs.Content>
	<Tabs.Content value="#key-features">
		List the most important features here with short, pragmatic descriptions so readers can scan for what matters (accessibility, theming,
		integrations).
	</Tabs.Content>
	<Tabs.Content value="#activity">
		Show recent activity or sample data: new releases, PRs merged, or notable user events. This helps examples feel realistic and
		actionable.
	</Tabs.Content>
</Tabs>

```

## Fluid Width

Use `flex` utility classes to make the tabs stretch to fill the width of their container.

```svelte
<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
</script>

<Tabs defaultValue="overview">
	<Tabs.List>
		<Tabs.Trigger class="flex-1" value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger class="flex-1" value="features">Key features</Tabs.Trigger>
		<Tabs.Trigger class="flex-1" value="activity">Activity</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="overview">
		A concise overview of the project: usage, goals, and recent highlights. Use this area to orient readers with key metrics and links to
		deeper docs.
	</Tabs.Content>
	<Tabs.Content value="features">
		List the most important features here with short, pragmatic descriptions so readers can scan for what matters (accessibility, theming,
		integrations).
	</Tabs.Content>
	<Tabs.Content value="activity">
		Show recent activity or sample data: new releases, PRs merged, or notable user events. This helps examples feel realistic and
		actionable.
	</Tabs.Content>
</Tabs>

```

## Orientation

Using the `orientation` prop to control the layout.

```svelte
<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
</script>

<Tabs defaultValue="overview" orientation="vertical">
	<Tabs.List>
		<Tabs.Trigger value="overview" class="justify-start">Overview</Tabs.Trigger>
		<Tabs.Trigger value="features" class="justify-start">Key features</Tabs.Trigger>
		<Tabs.Trigger value="activity" class="justify-start">Activity</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="overview">
		A concise overview of the project: usage, goals, and recent highlights. Use this area to orient readers with key metrics and links to
		deeper docs.
	</Tabs.Content>
	<Tabs.Content value="features">
		List the most important features here with short, pragmatic descriptions so readers can scan for what matters (accessibility, theming,
		integrations).
	</Tabs.Content>
	<Tabs.Content value="activity">
		Show recent activity or sample data: new releases, PRs merged, or notable user events. This helps examples feel realistic and
		actionable.
	</Tabs.Content>
</Tabs>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
</script>

<Tabs defaultValue="overview" dir="rtl">
	<Tabs.List>
		<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
		<Tabs.Trigger value="features">Key features</Tabs.Trigger>
		<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="overview">
		A concise overview of the project: usage, goals, and recent highlights. Use this area to orient readers with key metrics and links to
		deeper docs.
	</Tabs.Content>
	<Tabs.Content value="features">
		List the most important features here with short, pragmatic descriptions so readers can scan for what matters (accessibility, theming,
		integrations).
	</Tabs.Content>
	<Tabs.Content value="activity">
		Show recent activity or sample data: new releases, PRs merged, or notable user events. This helps examples feel realistic and
		actionable.
	</Tabs.Content>
</Tabs>

```

## Anatomy

Here's an overview of how the Tabs component is structured in code:

```svelte
<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
</script>

<Tabs>
	<Tabs.List>
		<Tabs.Trigger />
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content />
</Tabs>
```

## API Reference

### Root

| Prop           | Description                                                                                                                                                                                                       | Type                                                                                                                                               | Default      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| ids            | The ids of the elements in the tabs. Useful for composition.                                                                                                                                                      | Partial\<\{ root: string; trigger: (value: string) => string; list: string; content: (value: string) => string; indicator: string; }> \| undefined | -            |
| translations   | Specifies the localized strings that identifies the accessibility elements and their states                                                                                                                       | IntlTranslations \| undefined                                                                                                                      | -            |
| loopFocus      | Whether the keyboard navigation will loop from last tab to first, and vice versa.                                                                                                                                 | boolean \| undefined                                                                                                                               | true         |
| value          | The controlled selected tab value                                                                                                                                                                                 | string \| null \| undefined                                                                                                                        | -            |
| defaultValue   | The initial selected tab value when rendered.&#xA;Use when you don't need to control the selected tab value.                                                                                                      | string \| null \| undefined                                                                                                                        | -            |
| orientation    | The orientation of the tabs. Can be \`horizontal\` or \`vertical\`&#xA;- \`horizontal\`: only left and right arrow key navigation will work.&#xA;- \`vertical\`: only up and down arrow key navigation will work. | "horizontal" \| "vertical" \| undefined                                                                                                            | "horizontal" |
| activationMode | The activation mode of the tabs. Can be \`manual\` or \`automatic\`&#xA;- \`manual\`: Tabs are activated when clicked or press \`enter\` key.&#xA;- \`automatic\`: Tabs are activated when receiving focus        | "manual" \| "automatic" \| undefined                                                                                                               | "automatic"  |
| onValueChange  | Callback to be called when the selected/active tab changes                                                                                                                                                        | ((details: ValueChangeDetails) => void) \| undefined                                                                                               | -            |
| onFocusChange  | Callback to be called when the focused tab changes                                                                                                                                                                | ((details: FocusChangeDetails) => void) \| undefined                                                                                               | -            |
| composite      | Whether the tab is composite                                                                                                                                                                                      | boolean \| undefined                                                                                                                               | -            |
| deselectable   | Whether the active tab can be deselected when clicking on it.                                                                                                                                                     | boolean \| undefined                                                                                                                               | -            |
| navigate       | Function to navigate to the selected tab when clicking on it.&#xA;Useful if tab triggers are anchor elements.                                                                                                     | ((details: NavigateDetails) => void) \| null \| undefined                                                                                          | -            |
| dir            | The document's text/writing direction.                                                                                                                                                                            | "ltr" \| "rtl" \| undefined                                                                                                                        | "ltr"        |
| getRootNode    | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                                                                                        | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                | -            |
| element        | Render the element yourself                                                                                                                                                                                       | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                   | -            |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => TabsApi\<PropTypes>                        | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                   | Default |
| -------- | ----------- | -------------------------------------- | ------- |
| children | -           | Snippet\<\[() => TabsApi\<PropTypes>]> | -       |

### List

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Trigger

| Prop     | Description                 | Type                                                | Default |
| -------- | --------------------------- | --------------------------------------------------- | ------- |
| value    | The value of the tab        | string                                              | -       |
| disabled | Whether the tab is disabled | boolean \| undefined                                | -       |
| element  | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Indicator

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | The value of the tab        | string                                           | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Tags Input

Allows input of multiple values.

```svelte
<script lang="ts">
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
</script>

<TagsInput defaultValue={['Vanilla', 'Chocolate', 'Strawberry']}>
	<TagsInput.Label>Flavors</TagsInput.Label>
	<TagsInput.Control>
		<TagsInput.Context>
			{#snippet children(tagsInput)}
				{#each tagsInput().value as value, index (index)}
					<TagsInput.Item {value} {index}>
						<TagsInput.ItemPreview>
							<TagsInput.ItemText>{value}</TagsInput.ItemText>
							<TagsInput.ItemDeleteTrigger />
						</TagsInput.ItemPreview>
						<TagsInput.ItemInput />
					</TagsInput.Item>
				{/each}
			{/snippet}
		</TagsInput.Context>
		<TagsInput.Input placeholder="Add a flavor..." />
	</TagsInput.Control>
	<TagsInput.ClearTrigger>Clear All</TagsInput.ClearTrigger>
	<TagsInput.HiddenInput />
</TagsInput>

```

> TIP: Double tap each tag to quickly and easily edit in place.

## Custom Icon

Implement any icon of your choosing for the remove action.

```svelte
<script lang="ts">
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
</script>

<TagsInput defaultValue={['Vanilla', 'Chocolate', 'Strawberry']}>
	<TagsInput.Control>
		<TagsInput.Context>
			{#snippet children(tagsInput)}
				{#each tagsInput().value as value, index (index)}
					<TagsInput.Item {value} {index}>
						<TagsInput.ItemPreview>
							<TagsInput.ItemText>{value}</TagsInput.ItemText>
							<TagsInput.ItemDeleteTrigger>
								<CircleXIcon class="size-4" />
							</TagsInput.ItemDeleteTrigger>
						</TagsInput.ItemPreview>
						<TagsInput.ItemInput />
					</TagsInput.Item>
				{/each}
			{/snippet}
		</TagsInput.Context>
		<TagsInput.Input placeholder="Add a flavor..." />
	</TagsInput.Control>
	<TagsInput.HiddenInput />
</TagsInput>

```

## Color

Change the tag color using utility classes or custom CSS variables to match your design system.

```svelte
<script lang="ts">
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
</script>

<TagsInput defaultValue={['Vanilla', 'Chocolate', 'Strawberry']}>
	<TagsInput.Control>
		<TagsInput.Context>
			{#snippet children(tagsInput)}
				{#each tagsInput().value as value, index (index)}
					<TagsInput.Item {value} {index}>
						<TagsInput.ItemPreview class="preset-filled-secondary-500">
							<TagsInput.ItemText>{value}</TagsInput.ItemText>
							<TagsInput.ItemDeleteTrigger />
						</TagsInput.ItemPreview>
						<TagsInput.ItemInput />
					</TagsInput.Item>
				{/each}
			{/snippet}
		</TagsInput.Context>
		<TagsInput.Input placeholder="Add a flavor..." />
	</TagsInput.Control>
	<TagsInput.HiddenInput />
</TagsInput>

```

## Provider Pattern

Use the [Provider Pattern](/docs/\[framework]/get-started/fundamentals#provider-pattern) to gain access to the inner component APIs.

```svelte
<script lang="ts">
	import { TagsInput, useTagsInput } from '@skeletonlabs/skeleton-svelte';

	const id = $props.id();
	const tagsInput = useTagsInput({
		id,
		defaultValue: ['Vanilla', 'Chocolate', 'Strawberry'],
	});
</script>

<div class="w-full space-y-4">
	<TagsInput.Provider value={tagsInput}>
		<TagsInput.Control>
			<TagsInput.Context>
				{#snippet children(tagsInput)}
					{#each tagsInput().value as value, index (index)}
						<TagsInput.Item {value} {index}>
							<TagsInput.ItemPreview>
								<TagsInput.ItemText>{value}</TagsInput.ItemText>
								<TagsInput.ItemDeleteTrigger />
							</TagsInput.ItemPreview>
							<TagsInput.ItemInput />
						</TagsInput.Item>
					{/each}
				{/snippet}
			</TagsInput.Context>
			<TagsInput.Input placeholder="Add a flavor..." />
		</TagsInput.Control>
		<TagsInput.HiddenInput />
	</TagsInput.Provider>

	<!-- Programmatic Controls -->
	<div class="card preset-outlined-surface-200-800 flex justify-center items-center py-4">
		<button class="btn preset-filled" onclick={() => tagsInput().clearValue()}>Clear Tags</button>
	</div>
</div>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
</script>

<TagsInput defaultValue={['Vanilla', 'Chocolate', 'Strawberry']} dir="rtl">
	<TagsInput.Label>Label</TagsInput.Label>
	<TagsInput.Control>
		<TagsInput.Context>
			{#snippet children(tagsInput)}
				{#each tagsInput().value as value, index (index)}
					<TagsInput.Item {value} {index}>
						<TagsInput.ItemPreview>
							<TagsInput.ItemText>{value}</TagsInput.ItemText>
							<TagsInput.ItemDeleteTrigger />
						</TagsInput.ItemPreview>
						<TagsInput.ItemInput />
					</TagsInput.Item>
				{/each}
			{/snippet}
		</TagsInput.Context>
		<TagsInput.Input placeholder="Add a flavor..." />
	</TagsInput.Control>
	<TagsInput.HiddenInput />
</TagsInput>

```

## Anatomy

Here's an overview of how the TagsInput component is structured in code:

```svelte
<script lang="ts">
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
</script>

<TagsInput>
	<TagsInput.Label />
	<TagsInput.Control>
		<TagsInput.Item>
			<TagsInput.ItemPreview>
				<TagsInput.ItemText />
				<TagsInput.ItemDeleteTrigger />
			</TagsInput.ItemPreview>
			<TagsInput.ItemInput />
		</TagsInput.Item>
		<TagsInput.Input />
	</TagsInput.Control>
	<TagsInput.HiddenInput />
	<TagsInput.ClearTrigger />
</TagsInput>
```

## API Reference

### Root

| Prop                 | Description                                                                                                                                         | Type                                                                                                                                                                                                                                                       | Default                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| ids                  | The ids of the elements in the tags input. Useful for composition.                                                                                  | Partial\<\{ root: string; input: string; hiddenInput: string; clearBtn: string; label: string; control: string; item: (opts: ItemProps) => string; itemDeleteTrigger: (opts: ItemProps) => string; itemInput: (opts: ItemProps) => string; }> \| undefined | -                       |
| translations         | Specifies the localized strings that identifies the accessibility elements and their states                                                         | IntlTranslations \| undefined                                                                                                                                                                                                                              | -                       |
| maxLength            | The max length of the input.                                                                                                                        | number \| undefined                                                                                                                                                                                                                                        | -                       |
| delimiter            | The character that serves has:&#xA;- event key to trigger the addition of a new tag&#xA;- character used to split tags when pasting into the input  | string \| RegExp \| undefined                                                                                                                                                                                                                              | ","                     |
| autoFocus            | Whether the input should be auto-focused                                                                                                            | boolean \| undefined                                                                                                                                                                                                                                       | -                       |
| disabled             | Whether the tags input should be disabled                                                                                                           | boolean \| undefined                                                                                                                                                                                                                                       | -                       |
| readOnly             | Whether the tags input should be read-only                                                                                                          | boolean \| undefined                                                                                                                                                                                                                                       | -                       |
| invalid              | Whether the tags input is invalid                                                                                                                   | boolean \| undefined                                                                                                                                                                                                                                       | -                       |
| required             | Whether the tags input is required                                                                                                                  | boolean \| undefined                                                                                                                                                                                                                                       | -                       |
| editable             | Whether a tag can be edited after creation, by pressing \`Enter\` or double clicking.                                                               | boolean \| undefined                                                                                                                                                                                                                                       | true                    |
| inputValue           | The controlled tag input's value                                                                                                                    | string \| undefined                                                                                                                                                                                                                                        | -                       |
| defaultInputValue    | The initial tag input value when rendered.&#xA;Use when you don't need to control the tag input value.                                              | string \| undefined                                                                                                                                                                                                                                        | -                       |
| value                | The controlled tag value                                                                                                                            | string\[] \| undefined                                                                                                                                                                                                                                     | -                       |
| defaultValue         | The initial tag value when rendered.&#xA;Use when you don't need to control the tag value.                                                          | string\[] \| undefined                                                                                                                                                                                                                                     | -                       |
| onValueChange        | Callback fired when the tag values is updated                                                                                                       | ((details: ValueChangeDetails) => void) \| undefined                                                                                                                                                                                                       | -                       |
| onInputValueChange   | Callback fired when the input value is updated                                                                                                      | ((details: InputValueChangeDetails) => void) \| undefined                                                                                                                                                                                                  | -                       |
| onHighlightChange    | Callback fired when a tag is highlighted by pointer or keyboard navigation                                                                          | ((details: HighlightChangeDetails) => void) \| undefined                                                                                                                                                                                                   | -                       |
| onValueInvalid       | Callback fired when the max tag count is reached or the \`validateTag\` function returns \`false\`                                                  | ((details: ValidityChangeDetails) => void) \| undefined                                                                                                                                                                                                    | -                       |
| validate             | Returns a boolean that determines whether a tag can be added.&#xA;Useful for preventing duplicates or invalid tag values.                           | ((details: ValidateArgs) => boolean) \| undefined                                                                                                                                                                                                          | -                       |
| allowDuplicates      | Whether to allow duplicate tags.                                                                                                                    | boolean \| undefined                                                                                                                                                                                                                                       | false                   |
| blurBehavior         | The behavior of the tags input when the input is blurred&#xA;- \`"add"\`: add the input value as a new tag&#xA;- \`"clear"\`: clear the input value | "clear" \| "add" \| undefined                                                                                                                                                                                                                              | -                       |
| addOnPaste           | Whether to add a tag when you paste values into the tag input                                                                                       | boolean \| undefined                                                                                                                                                                                                                                       | false                   |
| max                  | The max number of tags                                                                                                                              | number \| undefined                                                                                                                                                                                                                                        | Infinity                |
| allowOverflow        | Whether to allow tags to exceed max. In this case,&#xA;we'll attach \`data-invalid\` to the root                                                    | boolean \| undefined                                                                                                                                                                                                                                       | -                       |
| sanitizeValue        | Function to sanitize the tag value before adding.&#xA;Useful for trimming whitespace, normalizing case, or stripping special characters.            | ((value: string) => string) \| undefined                                                                                                                                                                                                                   | (value) => value.trim() |
| name                 | The name attribute for the input. Useful for form submissions                                                                                       | string \| undefined                                                                                                                                                                                                                                        | -                       |
| form                 | The associate form of the underlying input element.                                                                                                 | string \| undefined                                                                                                                                                                                                                                        | -                       |
| placeholder          | The placeholder text for the input                                                                                                                  | string \| undefined                                                                                                                                                                                                                                        | -                       |
| dir                  | The document's text/writing direction.                                                                                                              | "ltr" \| "rtl" \| undefined                                                                                                                                                                                                                                | "ltr"                   |
| getRootNode          | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                          | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                                                                                                                                        | -                       |
| onPointerDownOutside | Function called when the pointer is pressed down outside the component                                                                              | ((event: PointerDownOutsideEvent) => void) \| undefined                                                                                                                                                                                                    | -                       |
| onFocusOutside       | Function called when the focus is moved outside the component                                                                                       | ((event: FocusOutsideEvent) => void) \| undefined                                                                                                                                                                                                          | -                       |
| onInteractOutside    | Function called when an interaction happens outside the component                                                                                   | ((event: InteractOutsideEvent) => void) \| undefined                                                                                                                                                                                                       | -                       |
| element              | Render the element yourself                                                                                                                         | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                                                                                                                                                                           | -                       |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => TagsInputApi\<PropTypes>                   | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                        | Default |
| -------- | ----------- | ------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => TagsInputApi\<PropTypes>]> | -       |

### Label

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"label">]> \| undefined | -       |

### Control

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop     | Description                 | Type                                              | Default |
| -------- | --------------------------- | ------------------------------------------------- | ------- |
| index    | -                           | string \| number                                  | -       |
| value    | -                           | string                                            | -       |
| disabled | -                           | boolean \| undefined                              | -       |
| element  | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### ItemPreview

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ItemText

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### ItemDeleteTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### ItemInput

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

### Input

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

### ClearTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### HiddenInput

| Prop    | Description                 | Type                                               | Default |
| ------- | --------------------------- | -------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"input">]> \| undefined | -       |

# Toast

Display brief messages to users.

```svelte
<script lang="ts">
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster();
</script>

<button
	class="btn preset-filled"
	onclick={() =>
		toaster.info({
			title: 'Title',
			description: 'This is a description.',
		})}
>
	Toast
</button>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

```

## Usage

This component acts as a Singleton. Implement a single instance of `<Toast.Group>` in the root scope your application.

```svelte
<script lang="ts">
	import { toaster } from '/some/path/toaster.ts';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	const props: Props = $props();
</script>

{@render props.children?.()}

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast toast={toast}>
			<Toast.Message>
			<Toast.Title>{toast.title}</Toast.Title>
			<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>
```

Create a shared reference to the `createToaster()` instance. We'll call it `toaster` here.

```ts
<script lang="ts">
	import { createToaster } from '@skeletonlabs/skeleton-svelte';

	export const toaster = createToaster();
</script>
```

Use this shared reference to trigger messages on demand throughout your application.

```svelte
<script lang="ts">
	import { toaster } from '/some/path/toaster.ts';

	function onClickHandler() {
		toaster.info({ title: 'Example', description: 'This is a toast message.' });
	}

</script>
```

## Triggers

Shorthand methods are available for toast triggers, including: `info()`, `success()`, `warning()`, and `error()`.

```svelte
<script lang="ts">
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster();
</script>

<div class="grid grid-cols-2 gap-2">
	<button
		class="btn preset-filled"
		onclick={() =>
			toaster.info({
				title: 'Info',
				description: 'This is an info toast.',
			})}
	>
		Info
	</button>
	<button
		class="btn preset-filled-success-500"
		onclick={() =>
			toaster.success({
				title: 'Success',
				description: 'This is a success toast.',
			})}
	>
		Success
	</button>
	<button
		class="btn preset-filled-warning-500"
		onclick={() =>
			toaster.warning({
				title: 'Warning',
				description: 'This is a warning toast.',
			})}
	>
		Warning
	</button>
	<button
		class="btn preset-filled-error-500"
		onclick={() =>
			toaster.error({
				title: 'Error',
				description: 'This is an error toast.',
			})}
	>
		Error
	</button>
</div>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

```

Or use the generic `create()` method to trigger toasts of any type: `info|success|warning|error`.

```ts
toaster.create({
	type: 'info',
	title: 'This is a toast',
	description: 'This is a toast description.',
	duration: 4000, // Duration in milliseconds (default: 4000), use Infinity to prevent auto-close
	action: {
		label: 'Action',
		onClick: () => {
			// Handle action click
		},
	},
});
```

## Placement

Set the `placement` value in your `createToaster` instance to define the global screen position.

```svelte
<script lang="ts">
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster({
		placement: 'bottom-end',
	});
</script>

<button
	class="btn preset-filled"
	onclick={() =>
		toaster.info({
			title: 'Title',
			description: 'This is a description.',
		})}
>
	Toast
</button>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

```

## Overlap

Use the `overlap` option in your `createToaster` instance to enable overlapping toasts.

```svelte
<script lang="ts">
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster({
		overlap: true,
	});
</script>

<button
	class="btn preset-filled"
	onclick={() =>
		toaster.info({
			title: 'Title',
			description: 'This is a description.',
		})}
>
	Toast
</button>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

```

> Note: Hovering over the toast group will expand all the toasts.

## Closable

Use the `closable` prop to toggle display of the close button.

```svelte
<script lang="ts">
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster();
</script>

<button
	class="btn preset-filled"
	onclick={() =>
		toaster.info({
			title: 'Title',
			description: 'This is a description.',
			closable: false,
		})}
>
	Toast
</button>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			{#if toast.closable}
				<Toast.CloseTrigger />
			{/if}
		</Toast>
	{/snippet}
</Toast.Group>

```

## Action

Use the `action` key to add an interactive button to your toast. This is useful for actions like "Undo", "Retry", or other contextual operations.

```svelte
<script lang="ts">
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster();
</script>

<button
	class="btn preset-filled"
	onclick={() =>
		toaster.info({
			title: 'Toast',
			description: 'This is a toast message.',
			duration: Infinity,
			action: {
				label: 'Undo',
				onClick: () => {
					toaster.success({
						title: 'Task undone',
						description: 'The task has been undone.',
					});
				},
			},
		})}
>
	Toast
</button>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			{#if toast.action}
				<Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
			{/if}
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

```

## Meta

Use the `meta` key to pass arbitrary data along with the toast instance. This can be used to display an icon for example.

```svelte
<script lang="ts">
	import SkullIcon from '@lucide/svelte/icons/skull';
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster();
</script>

{#snippet skull()}
	<SkullIcon class="size-8" />
{/snippet}

<button
	class="btn preset-filled"
	onclick={() =>
		toaster.info({
			title: 'Title',
			description: 'This is a description.',
			meta: {
				icon: skull,
			},
		})}
>
	Toast
</button>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			{@render toast.meta!.icon()}
			<Toast.Message>
				<Toast.Title class="flex gap-2 items-center">{toast.title}</Toast.Title>
				<Toast.Description>{toast.description} {toast.meta?.foo}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

```

## Promise

Toasts support asynchronous updates using promises.

```svelte
<script lang="ts">
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster();

	function generatePositiveNumber() {
		return new Promise<number>((resolve, reject) => {
			setTimeout(() => {
				const number = Math.random() - 0.5;
				if (number > 0) {
					resolve(number);
				} else {
					reject(number);
				}
			}, 2000);
		});
	}
</script>

<button
	class="btn preset-filled"
	onclick={() =>
		toaster.promise(generatePositiveNumber(), {
			loading: {
				title: 'Loading...',
				description: 'Please wait while generating your number',
			},
			success: (number) => ({
				title: 'Success',
				description: `Your number is ${number}`,
			}),
			error: (number) => ({
				title: 'Error',
				description: `Your number is ${number}`,
			}),
		})}
>
	Toast
</button>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

```

## Anatomy

Here's an overview of how the Toast component is structured in code:

```svelte
<script lang="ts">
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
</script>

<Toast.Group>
	<Toast>
		<Toast.Message>
			<Toast.Title />
			<Toast.Description />
		</Toast.Message>
		<Toast.CloseTrigger />
	</Toast>
</Toast.Group>
```

## API Reference

### Root

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| toast   | -                           | ToastOptions\<any>                               | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                         | Default |
| -------- | ----------- | -------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => ToastApi\<PropTypes, any>]> | -       |

### Group

| Prop     | Description                 | Type                                             | Default |
| -------- | --------------------------- | ------------------------------------------------ | ------- |
| toaster  | -                           | ToastStore\<any>                                 | -       |
| children | -                           | Snippet\<\[any]> \| undefined                    | -       |
| element  | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Message

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Title

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Description

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ActionTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### CloseTrigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

# Toggle Group

Grouped buttons for toggling option states.

```svelte
<script lang="ts">
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import { ToggleGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<ToggleGroup defaultValue={['bold']} multiple>
	<ToggleGroup.Item value="bold">
		<BoldIcon class="size-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="italic">
		<ItalicIcon class="size-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="underline">
		<UnderlineIcon class="size-4" />
	</ToggleGroup.Item>
</ToggleGroup>

```

## Controlled

Use the `value` and `onValueChange` props to control state programmatically.

```svelte
<script lang="ts">
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import { ToggleGroup } from '@skeletonlabs/skeleton-svelte';

	let value = $state(['bold']);
</script>

<div class="flex flex-col items-center gap-4">
	<ToggleGroup {value} onValueChange={(details) => (value = details.value)} multiple>
		<ToggleGroup.Item value="bold">
			<BoldIcon class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="italic">
			<ItalicIcon class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="underline">
			<UnderlineIcon class="size-4" />
		</ToggleGroup.Item>
	</ToggleGroup>

	<!-- Message -->
	<p><span class="opacity-60">You selected</span> <code class="code">{value.length > 0 ? value.join(', ') : 'none'}</code></p>
</div>

```

## Orientation

Using the `orientation` prop to control the layout.

```svelte
<script lang="ts">
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import { ToggleGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="flex flex-col items-center gap-4">
	<p>Horizontal</p>
	<ToggleGroup defaultValue={['bold']} multiple orientation="horizontal">
		<ToggleGroup.Item value="bold">
			<BoldIcon class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="italic">
			<ItalicIcon class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="underline">
			<UnderlineIcon class="size-4" />
		</ToggleGroup.Item>
	</ToggleGroup>

	<p>Vertical</p>
	<ToggleGroup defaultValue={['bold']} multiple orientation="vertical" class="flex-col">
		<ToggleGroup.Item value="bold">
			<BoldIcon class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="italic">
			<ItalicIcon class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="underline">
			<UnderlineIcon class="size-4" />
		</ToggleGroup.Item>
	</ToggleGroup>
</div>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import { ToggleGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<ToggleGroup defaultValue={['bold']} multiple dir="rtl">
	<ToggleGroup.Item value="bold">
		<BoldIcon class="size-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="italic">
		<ItalicIcon class="size-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="underline">
		<UnderlineIcon class="size-4" />
	</ToggleGroup.Item>
</ToggleGroup>

```

## Anatomy

Here's an overview of how the ToggleGroup component is structured in code:

```svelte
<script lang="ts">
	import { ToggleGroup } from '@skeletonlabs/skeleton-svelte';
</script>

<ToggleGroup>
	<ToggleGroup.Item />
</ToggleGroup>
```

## API Reference

### Root

| Prop          | Description                                                                                                                                  | Type                                                                       | Default      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------ |
| ids           | The ids of the elements in the toggle. Useful for composition.                                                                               | Partial\<\{ root: string; item: (value: string) => string; }> \| undefined | -            |
| disabled      | Whether the toggle is disabled.                                                                                                              | boolean \| undefined                                                       | -            |
| value         | The controlled selected value of the toggle group.                                                                                           | string\[] \| undefined                                                     | -            |
| defaultValue  | The initial selected value of the toggle group when rendered.&#xA;Use when you don't need to control the selected value of the toggle group. | string\[] \| undefined                                                     | -            |
| onValueChange | Function to call when the toggle is clicked.                                                                                                 | ((details: ValueChangeDetails) => void) \| undefined                       | -            |
| loopFocus     | Whether to loop focus inside the toggle group.                                                                                               | boolean \| undefined                                                       | true         |
| rovingFocus   | Whether to use roving tab index to manage focus.                                                                                             | boolean \| undefined                                                       | true         |
| orientation   | The orientation of the toggle group.                                                                                                         | Orientation \| undefined                                                   | "horizontal" |
| multiple      | Whether to allow multiple toggles to be selected.                                                                                            | boolean \| undefined                                                       | -            |
| deselectable  | Whether the toggle group allows empty selection.&#xA;\*\*Note:\*\* This is ignored if \`multiple\` is \`true\`.                              | boolean \| undefined                                                       | true         |
| dir           | The document's text/writing direction.                                                                                                       | "ltr" \| "rtl" \| undefined                                                | "ltr"        |
| getRootNode   | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                   | (() => ShadowRoot \| Node \| Document) \| undefined                        | -            |
| element       | Render the element yourself                                                                                                                  | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                           | -            |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | () => ToggleGroupApi\<PropTypes>                 | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                          | Default |
| -------- | ----------- | --------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => ToggleGroupApi\<PropTypes>]> | -       |

### Item

| Prop     | Description                 | Type                                                | Default |
| -------- | --------------------------- | --------------------------------------------------- | ------- |
| value    | -                           | string                                              | -       |
| disabled | -                           | boolean \| undefined                                | -       |
| element  | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

# Tooltip

A floating label that appears on hover or focus, providing additional context.

```svelte
<script lang="ts">
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
</script>

<Tooltip positioning={{ placement: 'top' }}>
	<Tooltip.Trigger>Hover</Tooltip.Trigger>
	<Portal>
		<Tooltip.Positioner>
			<Tooltip.Content class="card p-2 preset-filled-surface-950-50">
				<span>Hello Skeleton</span>
				<Tooltip.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-950-50)]">
					<Tooltip.ArrowTip />
				</Tooltip.Arrow>
			</Tooltip.Content>
		</Tooltip.Positioner>
	</Portal>
</Tooltip>

```

Breaking convention in Skeleton, this component is provided "headless". Meaning no default styles are applied out of the box. This ensures you retain full control of all styling for maximum flexibility.

## Arrow

Visually connects the popover content to the trigger element. Will automatically align based on the selected side.

```svelte
<script lang="ts">
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
</script>

<Tooltip>
	<Tooltip.Trigger>Hover</Tooltip.Trigger>
	<Portal>
		<Tooltip.Positioner>
			<Tooltip.Content class="card bg-surface-100-900 p-2 shadow-xl">
				<span>Hello Skeleton</span>
				<Tooltip.Arrow class="[--arrow-size:--spacing(2)] [--arrow-background:var(--color-surface-100-900)]">
					<Tooltip.ArrowTip />
				</Tooltip.Arrow>
			</Tooltip.Content>
		</Tooltip.Positioner>
	</Portal>
</Tooltip>

```

## Z-Index

By default Skeleton does not take an opinionated stance regarding z-index stacking. The result is the component can sometimes be occluded beneath other elements with a higher index. The Z-Index can controlled by applying a utility class to the `Positioner` component.

```svelte
<script lang="ts">
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="grid grid-cols-2 gap-4">
	<Tooltip>
		<Tooltip.Trigger>Default (auto)</Tooltip.Trigger>
		<Portal>
			<Tooltip.Positioner>
				<Tooltip.Content class="card bg-surface-100-900 p-2  shadow-xl">This example will be below the sibling.</Tooltip.Content>
			</Tooltip.Positioner>
		</Portal>
	</Tooltip>

	<Tooltip>
		<Tooltip.Trigger>Above (20)</Tooltip.Trigger>
		<Portal>
			<Tooltip.Positioner class="z-20!">
				<Tooltip.Content class="card bg-surface-100-900 p-2  shadow-xl">This example will be above the sibling.</Tooltip.Content>
			</Tooltip.Positioner>
		</Portal>
	</Tooltip>

	<div class="col-span-2 h-[100px] relative">
		<div class="rounded bg-primary-200-800/75 w-full h-full z-10 flex justify-center items-center absolute">Sibling (10)</div>
	</div>
</div>

```

## Provider Pattern

Use the [Provider Pattern](/docs/\[framework]/get-started/fundamentals#provider-pattern) to gain access to the inner component APIs.

```svelte
<script lang="ts">
	import { Portal, Tooltip, useTooltip } from '@skeletonlabs/skeleton-svelte';

	const id = $props.id();
	const tooltip = useTooltip({ id });
</script>

<div class="grid gap-4">
	<button class="btn preset-filled w-[150px]" onclick={() => tooltip().setOpen(!tooltip().open)}>Trigger</button>
	<Tooltip.Provider value={tooltip}>
		<Tooltip.Trigger>Anchor ({tooltip().open ? 'open' : 'closed'})</Tooltip.Trigger>
		<Portal>
			<Tooltip.Positioner>
				<Tooltip.Content class="card bg-surface-100-900 p-2  shadow-xl">Hello Skeleton</Tooltip.Content>
			</Tooltip.Positioner>
		</Portal>
	</Tooltip.Provider>
</div>

```

## Direction

Set the text direction (`ltr` or `rtl`) using the `dir` prop.

```svelte
<script lang="ts">
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
</script>

<Tooltip dir="rtl">
	<Tooltip.Trigger>Hover</Tooltip.Trigger>
	<Portal>
		<Tooltip.Positioner>
			<Tooltip.Content class="card bg-surface-100-900 p-2  shadow-xl">Hello Skeleton</Tooltip.Content>
		</Tooltip.Positioner>
	</Portal>
</Tooltip>

```

## Anatomy

Here's an overview of how the Tooltip component is structured in code:

```svelte
<script lang="ts">
	import { Tooltip, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Tooltip>
	<Tooltip.Trigger />
	<Portal>
		<Tooltip.Positioner>
			<Tooltip.Content>
				<Tooltip.Arrow>
					<Tooltip.ArrowTip />
				</Tooltip.Arrow>
			</Tooltip.Content>
		</Tooltip.Positioner>
	</Portal>
</Tooltip>
```

## API Reference

### Root

| Prop                 | Description                                                                                                                     | Type                                                                                                                                          | Default |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| ids                  | The ids of the elements in the tooltip. Useful for composition.                                                                 | Partial\<\{ trigger: string \| ((value?: string \| undefined) => string); content: string; arrow: string; positioner: string; }> \| undefined | -       |
| openDelay            | The open delay of the tooltip.                                                                                                  | number \| undefined                                                                                                                           | 400     |
| closeDelay           | The close delay of the tooltip.                                                                                                 | number \| undefined                                                                                                                           | 150     |
| closeOnPointerDown   | Whether to close the tooltip on pointerdown.                                                                                    | boolean \| undefined                                                                                                                          | true    |
| closeOnEscape        | Whether to close the tooltip when the Escape key is pressed.                                                                    | boolean \| undefined                                                                                                                          | true    |
| closeOnScroll        | Whether the tooltip should close on scroll                                                                                      | boolean \| undefined                                                                                                                          | true    |
| closeOnClick         | Whether the tooltip should close on click                                                                                       | boolean \| undefined                                                                                                                          | true    |
| interactive          | Whether the tooltip's content is interactive.&#xA;In this mode, the tooltip will remain open when user hovers over the content. | boolean \| undefined                                                                                                                          | false   |
| onOpenChange         | Function called when the tooltip is opened.                                                                                     | ((details: OpenChangeDetails) => void) \| undefined                                                                                           | -       |
| aria-label           | Custom label for the tooltip.                                                                                                   | string \| undefined                                                                                                                           | -       |
| positioning          | The user provided options used to position the popover content                                                                  | PositioningOptions \| undefined                                                                                                               | -       |
| disabled             | Whether the tooltip is disabled                                                                                                 | boolean \| undefined                                                                                                                          | -       |
| open                 | The controlled open state of the tooltip                                                                                        | boolean \| undefined                                                                                                                          | -       |
| defaultOpen          | The initial open state of the tooltip when rendered.&#xA;Use when you don't need to control the open state of the tooltip.      | boolean \| undefined                                                                                                                          | -       |
| triggerValue         | The controlled trigger value                                                                                                    | string \| null \| undefined                                                                                                                   | -       |
| defaultTriggerValue  | The initial trigger value when rendered.&#xA;Use when you don't need to control the trigger value.                              | string \| null \| undefined                                                                                                                   | -       |
| onTriggerValueChange | Function called when the trigger value changes.                                                                                 | ((details: TriggerValueChangeDetails) => void) \| undefined                                                                                   | -       |
| dir                  | The document's text/writing direction.                                                                                          | "ltr" \| "rtl" \| undefined                                                                                                                   | "ltr"   |
| getRootNode          | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                      | (() => ShadowRoot \| Node \| Document) \| undefined                                                                                           | -       |
| children             | The default slot content to be rendered within the component.                                                                   | Snippet\<\[]> \| undefined                                                                                                                    | -       |

### Provider

| Prop     | Description                                                   | Type                       | Default |
| -------- | ------------------------------------------------------------- | -------------------------- | ------- |
| value    | -                                                             | any                        | -       |
| children | The default slot content to be rendered within the component. | Snippet\<\[]> \| undefined | -       |

### Context

| Prop     | Description | Type                                      | Default |
| -------- | ----------- | ----------------------------------------- | ------- |
| children | -           | Snippet\<\[() => TooltipApi\<PropTypes>]> | -       |

### Trigger

| Prop    | Description                 | Type                                                | Default |
| ------- | --------------------------- | --------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"button">]> \| undefined | -       |

### Positioner

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Content

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Arrow

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### ArrowTip

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

# Tree View

Used to display hierarchical data.

```svelte
<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import { TreeView, createTreeViewCollection } from '@skeletonlabs/skeleton-svelte';

	interface Node {
		id: string;
		name: string;
		children?: Node[];
	}

	const collection = createTreeViewCollection<Node>({
		nodeToValue: (node) => node.id,
		nodeToString: (node) => node.name,
		rootNode: {
			id: 'root',
			name: '',
			children: [
				{
					id: 'node_modules',
					name: 'node_modules',
					children: [
						{
							id: 'node_modules/@skeletonlabs',
							name: '@skeletonlabs',
							children: [
								{
									id: 'node_modules/@skeletonlabs/skeleton',
									name: 'skeleton',
								},
							],
						},
					],
				},
				{
					id: 'package.json',
					name: 'package.json',
				},
			],
		},
	});
</script>

<TreeView {collection}>
	<TreeView.Label>File System</TreeView.Label>
	<TreeView.Tree>
		{#each collection.rootNode.children || [] as node, index (node)}
			{@render treeNode(node, [index])}
		{/each}
	</TreeView.Tree>
</TreeView>

{#snippet treeNode(node: Node, indexPath: number[])}
	<TreeView.NodeProvider value={{ node, indexPath }}>
		{#if node.children}
			<TreeView.Branch>
				<TreeView.BranchControl>
					<TreeView.BranchIndicator />
					<TreeView.BranchText>
						<FolderIcon class="size-4" />
						{node.name}
					</TreeView.BranchText>
				</TreeView.BranchControl>
				<TreeView.BranchContent>
					<TreeView.BranchIndentGuide />
					{#each node.children as childNode, childIndex (childNode)}
						{@render treeNode(childNode, [...indexPath, childIndex])}
					{/each}
				</TreeView.BranchContent>
			</TreeView.Branch>
		{:else}
			<TreeView.Item>
				<FileIcon class="size-4" />
				{node.name}
			</TreeView.Item>
		{/if}
	</TreeView.NodeProvider>
{/snippet}

```

## Controlled

Reactively set and control the state values.

```svelte
<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import { TreeView, createTreeViewCollection } from '@skeletonlabs/skeleton-svelte';

	interface Node {
		id: string;
		name: string;
		children?: Node[];
	}

	const collection = createTreeViewCollection<Node>({
		nodeToValue: (node) => node.id,
		nodeToString: (node) => node.name,
		rootNode: {
			id: 'root',
			name: '',
			children: [
				{
					id: 'node_modules',
					name: 'node_modules',
					children: [
						{
							id: 'node_modules/@skeletonlabs',
							name: '@skeletonlabs',
							children: [
								{
									id: 'node_modules/@skeletonlabs/skeleton',
									name: 'skeleton',
								},
							],
						},
					],
				},
				{
					id: 'package.json',
					name: 'package.json',
				},
			],
		},
	});
</script>

<TreeView {collection}>
	<TreeView.Label>File System</TreeView.Label>
	<TreeView.Tree>
		{#each collection.rootNode.children || [] as node, index (node)}
			{@render treeNode(node, [index])}
		{/each}
	</TreeView.Tree>
</TreeView>

{#snippet treeNode(node: Node, indexPath: number[])}
	<TreeView.NodeProvider value={{ node, indexPath }}>
		{#if node.children}
			<TreeView.Branch>
				<TreeView.BranchControl>
					<TreeView.BranchIndicator />
					<TreeView.BranchText>
						<FolderIcon class="size-4" />
						{node.name}
					</TreeView.BranchText>
				</TreeView.BranchControl>
				<TreeView.BranchContent>
					<TreeView.BranchIndentGuide />
					{#each node.children as childNode, childIndex (childNode)}
						{@render treeNode(childNode, [...indexPath, childIndex])}
					{/each}
				</TreeView.BranchContent>
			</TreeView.Branch>
		{:else}
			<TreeView.Item>
				<FileIcon class="size-4" />
				{node.name}
			</TreeView.Item>
		{/if}
	</TreeView.NodeProvider>
{/snippet}

```

## Multiple Selection

* Windows: Hold <kbd class="kbd">Ctrl</kbd> + left click with mouse.
* MacOS: Hold <kbd class="kbd">⌘</kbd> + left click with mouse.

```svelte
<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import { TreeView, createTreeViewCollection } from '@skeletonlabs/skeleton-svelte';

	interface Node {
		id: string;
		name: string;
		children?: Node[];
	}

	const collection = createTreeViewCollection<Node>({
		nodeToValue: (node) => node.id,
		nodeToString: (node) => node.name,
		rootNode: {
			id: 'root',
			name: '',
			children: [
				{
					id: 'node_modules',
					name: 'node_modules',
					children: [
						{
							id: 'node_modules/@skeletonlabs',
							name: '@skeletonlabs',
							children: [
								{
									id: 'node_modules/@skeletonlabs/skeleton',
									name: 'skeleton',
								},
							],
						},
					],
				},
				{
					id: 'package.json',
					name: 'package.json',
				},
			],
		},
	});
</script>

<TreeView {collection} selectionMode="multiple">
	<TreeView.Label>File System</TreeView.Label>
	<TreeView.Tree>
		{#each collection.rootNode.children || [] as node, index (node)}
			{@render treeNode(node, [index])}
		{/each}
	</TreeView.Tree>
</TreeView>

{#snippet treeNode(node: Node, indexPath: number[])}
	<TreeView.NodeProvider value={{ node, indexPath }}>
		{#if node.children}
			<TreeView.Branch>
				<TreeView.BranchControl>
					<TreeView.BranchIndicator />
					<TreeView.BranchText>
						<FolderIcon class="size-4" />
						{node.name}
					</TreeView.BranchText>
				</TreeView.BranchControl>
				<TreeView.BranchContent>
					<TreeView.BranchIndentGuide />
					{#each node.children as childNode, childIndex (childNode)}
						{@render treeNode(childNode, [...indexPath, childIndex])}
					{/each}
				</TreeView.BranchContent>
			</TreeView.Branch>
		{:else}
			<TreeView.Item>
				<FileIcon class="size-4" />
				{node.name}
			</TreeView.Item>
		{/if}
	</TreeView.NodeProvider>
{/snippet}

```

## Provider Pattern

Use the [Provider Pattern](/docs/\[framework]/get-started/fundamentals#provider-pattern) to gain access to the `collapse` and `expand` methods on the `TreeView` instance.

```svelte
<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import { TreeView, createTreeViewCollection, useTreeView } from '@skeletonlabs/skeleton-svelte';

	interface Node {
		id: string;
		name: string;
		children?: Node[];
	}

	const collection = createTreeViewCollection<Node>({
		nodeToValue: (node) => node.id,
		nodeToString: (node) => node.name,
		rootNode: {
			id: 'root',
			name: '',
			children: [
				{
					id: 'node_modules',
					name: 'node_modules',
					children: [
						{
							id: 'node_modules/@skeletonlabs',
							name: '@skeletonlabs',
							children: [
								{
									id: 'node_modules/@skeletonlabs/skeleton',
									name: 'skeleton',
								},
							],
						},
					],
				},
				{
					id: 'package.json',
					name: 'package.json',
				},
			],
		},
	});

	const id = $props.id();
	const treeView = useTreeView({
		id: id,
		collection: collection,
	});
</script>

<div class="w-full flex flex-col items-center gap-4">
	<TreeView.Provider value={treeView}>
		<TreeView.Label>File System</TreeView.Label>
		<TreeView.Tree>
			{#each collection.rootNode.children || [] as node, index (node)}
				{@render treeNode(node, [index])}
			{/each}
		</TreeView.Tree>
	</TreeView.Provider>

	<div class="flex gap-2">
		<button class="btn preset-filled" onclick={() => treeView().collapse()}> Collapse </button>
		<button class="btn preset-filled" onclick={() => treeView().expand()}> Expand </button>
	</div>
</div>

{#snippet treeNode(node: Node, indexPath: number[])}
	<TreeView.NodeProvider value={{ node, indexPath }}>
		{#if node.children}
			<TreeView.Branch>
				<TreeView.BranchControl>
					<TreeView.BranchIndicator />
					<TreeView.BranchText>
						<FolderIcon class="size-4" />
						{node.name}
					</TreeView.BranchText>
				</TreeView.BranchControl>
				<TreeView.BranchContent>
					<TreeView.BranchIndentGuide />
					{#each node.children as childNode, childIndex (childNode)}
						{@render treeNode(childNode, [...indexPath, childIndex])}
					{/each}
				</TreeView.BranchContent>
			</TreeView.Branch>
		{:else}
			<TreeView.Item>
				<FileIcon class="size-4" />
				{node.name}
			</TreeView.Item>
		{/if}
	</TreeView.NodeProvider>
{/snippet}

```

## Lazy Loading

Utilize promises to asynchronously load large node lists.

```svelte
<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import { TreeView, createTreeViewCollection, type TreeViewRootProps } from '@skeletonlabs/skeleton-svelte';

	interface Node {
		id: string;
		name: string;
		children?: Node[];
		childrenCount?: number;
	}

	const response: Record<string, Node[]> = {
		node_modules: [
			{
				id: 'node_modules/@skeletonlabs',
				name: '@skeletonlabs',
				childrenCount: 3,
			},
		],
		'node_modules/@skeletonlabs': [
			{
				id: 'node_modules/@skeletonlabs/skeleton',
				name: 'skeleton',
			},
			{
				id: 'node_modules/@skeletonlabs/skeleton-react',
				name: 'skeleton-react',
			},
			{
				id: 'node_modules/@skeletonlabs/skeleton-svelte',
				name: 'skeleton-svelte',
			},
		],
	};

	let collection = $state(
		createTreeViewCollection<Node>({
			nodeToValue: (node) => node.id,
			nodeToString: (node) => node.name,
			rootNode: {
				id: 'root',
				name: '',
				children: [
					{
						id: 'node_modules',
						name: 'node_modules',
						childrenCount: 1,
					},
					{
						id: 'package.json',
						name: 'package.json',
					},
				],
			},
		}),
	);

	const loadChildren: TreeViewRootProps['loadChildren'] = async (details) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return response[details.node.id] || [];
	};

	const onLoadChildrenComplete: TreeViewRootProps['onLoadChildrenComplete'] = (details) => {
		collection = details.collection;
	};
</script>

<TreeView {collection} {loadChildren} {onLoadChildrenComplete}>
	<TreeView.Label>File System</TreeView.Label>
	<TreeView.Tree>
		{#each collection.rootNode.children || [] as node, index (node)}
			{@render treeNode(node, [index])}
		{/each}
	</TreeView.Tree>
</TreeView>

{#snippet treeNode(node: Node, indexPath: number[])}
	<TreeView.NodeProvider value={{ node, indexPath }}>
		{#if node.children || node.childrenCount}
			<TreeView.Branch>
				<TreeView.BranchControl>
					<TreeView.BranchIndicator class="data-loading:hidden" />
					<TreeView.BranchIndicator class="hidden data-loading:inline animate-spin">
						<LoaderIcon class="size-4" />
					</TreeView.BranchIndicator>
					<TreeView.BranchText>
						<FolderIcon class="size-4" />
						{node.name}
					</TreeView.BranchText>
				</TreeView.BranchControl>
				<TreeView.BranchContent>
					<TreeView.BranchIndentGuide />
					{#each node.children ?? [] as childNode, childIndex (childNode)}
						{@render treeNode(childNode, [...indexPath, childIndex])}
					{/each}
				</TreeView.BranchContent>
			</TreeView.Branch>
		{:else}
			<TreeView.Item>
				<FileIcon class="size-4" />
				{node.name}
			</TreeView.Item>
		{/if}
	</TreeView.NodeProvider>
{/snippet}

```

## Anatomy

Here's an overview of how the TreeView component is structured in code:

```svelte
<script lang="ts">
	import { TreeView } from '@skeletonlabs/skeleton-svelte';
</script>

<TreeView>
	<TreeView.Label />
	<TreeView.Tree>
		<TreeView.Branch>
			<TreeView.BranchControl>
				<TreeView.BranchTrigger />
				<TreeView.BranchIndicator />
				<TreeView.BranchText />
			</TreeView.BranchControl>
			<TreeView.BranchContent>
				<TreeView.Item>
					<TreeView.ItemText />
				</TreeView.Item>
			</TreeView.BranchContent>
		</TreeView.Branch>
	</TreeView.Tree>
</TreeView>
```

## API Reference

### NodeContext

| Prop     | Description | Type                         | Default |
| -------- | ----------- | ---------------------------- | ------- |
| children | -           | Snippet\<\[() => NodeProps]> | -       |

### Root

| Prop                   | Description                                                                                                                                 | Type                                                                                                    | Default  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------- |
| translations           | Specifies the localized strings that identifies the accessibility elements and their states                                                 | IntlTranslations \| undefined                                                                           | -        |
| collection             | The tree collection data                                                                                                                    | TreeCollection\<T> \| undefined                                                                         | -        |
| ids                    | The ids of the tree elements. Useful for composition.                                                                                       | Partial\<\{ root: string; tree: string; label: string; node: (value: string) => string; }> \| undefined | -        |
| expandedValue          | The controlled expanded node ids                                                                                                            | string\[] \| undefined                                                                                  | -        |
| defaultExpandedValue   | The initial expanded node ids when rendered.&#xA;Use when you don't need to control the expanded node value.                                | string\[] \| undefined                                                                                  | -        |
| selectedValue          | The controlled selected node value                                                                                                          | string\[] \| undefined                                                                                  | -        |
| defaultSelectedValue   | The initial selected node value when rendered.&#xA;Use when you don't need to control the selected node value.                              | string\[] \| undefined                                                                                  | -        |
| defaultCheckedValue    | The initial checked node value when rendered.&#xA;Use when you don't need to control the checked node value.                                | string\[] \| undefined                                                                                  | -        |
| checkedValue           | The controlled checked node value                                                                                                           | string\[] \| undefined                                                                                  | -        |
| defaultFocusedValue    | The initial focused node value when rendered.&#xA;Use when you don't need to control the focused node value.                                | string \| null \| undefined                                                                             | -        |
| focusedValue           | The value of the focused node                                                                                                               | string \| null \| undefined                                                                             | -        |
| selectionMode          | Whether the tree supports multiple selection&#xA;- "single": only one node can be selected&#xA;- "multiple": multiple nodes can be selected | "single" \| "multiple" \| undefined                                                                     | "single" |
| onExpandedChange       | Called when the tree is opened or closed                                                                                                    | ((details: ExpandedChangeDetails\<T>) => void) \| undefined                                             | -        |
| onSelectionChange      | Called when the selection changes                                                                                                           | ((details: SelectionChangeDetails\<T>) => void) \| undefined                                            | -        |
| onFocusChange          | Called when the focused node changes                                                                                                        | ((details: FocusChangeDetails\<T>) => void) \| undefined                                                | -        |
| onCheckedChange        | Called when the checked value changes                                                                                                       | ((details: CheckedChangeDetails) => void) \| undefined                                                  | -        |
| canRename              | Function to determine if a node can be renamed                                                                                              | ((node: T, indexPath: IndexPath) => boolean) \| undefined                                               | -        |
| onRenameStart          | Called when a node starts being renamed                                                                                                     | ((details: RenameStartDetails\<T>) => void) \| undefined                                                | -        |
| onBeforeRename         | Called before a rename is completed. Return false to prevent the rename.                                                                    | ((details: RenameCompleteDetails) => boolean) \| undefined                                              | -        |
| onRenameComplete       | Called when a node label rename is completed                                                                                                | ((details: RenameCompleteDetails) => void) \| undefined                                                 | -        |
| onLoadChildrenComplete | Called when a node finishes loading children                                                                                                | ((details: LoadChildrenCompleteDetails\<T>) => void) \| undefined                                       | -        |
| onLoadChildrenError    | Called when loading children fails for one or more nodes                                                                                    | ((details: LoadChildrenErrorDetails\<T>) => void) \| undefined                                          | -        |
| expandOnClick          | Whether clicking on a branch should open it or not                                                                                          | boolean \| undefined                                                                                    | true     |
| typeahead              | Whether the tree supports typeahead search                                                                                                  | boolean \| undefined                                                                                    | true     |
| loadChildren           | Function to load children for a node asynchronously.&#xA;When provided, branches will wait for this promise to resolve before expanding.    | ((details: LoadChildrenDetails\<T>) => Promise\<T\[]>) \| undefined                                     | -        |
| scrollToIndexFn        | Function to scroll to a specific index.&#xA;Useful for virtualized tree views.                                                              | ((details: ScrollToIndexDetails\<T>) => void) \| undefined                                              | -        |
| dir                    | The document's text/writing direction.                                                                                                      | "ltr" \| "rtl" \| undefined                                                                             | "ltr"    |
| getRootNode            | A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.                                                  | (() => ShadowRoot \| Node \| Document) \| undefined                                                     | -        |
| element                | Render the element yourself                                                                                                                 | Snippet\<\[HTMLAttributes\<"div">]> \| undefined                                                        | -        |

### Provider

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| value   | -                           | any                                              | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Context

| Prop     | Description | Type                                            | Default |
| -------- | ----------- | ----------------------------------------------- | ------- |
| children | -           | Snippet\<\[() => TreeViewApi\<PropTypes, any>]> | -       |

### Tree

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Label

| Prop    | Description                 | Type                                            | Default |
| ------- | --------------------------- | ----------------------------------------------- | ------- |
| level   | The level of the heading.   | 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined         | -       |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"h3">]> \| undefined | -       |

### NodeProvider

| Prop     | Description                                                   | Type                       | Default |
| -------- | ------------------------------------------------------------- | -------------------------- | ------- |
| value    | -                                                             | NodeProps                  | -       |
| children | The default slot content to be rendered within the component. | Snippet\<\[]> \| undefined | -       |

### Branch

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### BranchControl

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### BranchText

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### BranchIndicator

| Prop    | Description                 | Type                                              | Default |
| ------- | --------------------------- | ------------------------------------------------- | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"span">]> \| undefined | -       |

### BranchContent

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### BranchIndentGuide

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

### Item

| Prop    | Description                 | Type                                             | Default |
| ------- | --------------------------- | ------------------------------------------------ | ------- |
| element | Render the element yourself | Snippet\<\[HTMLAttributes\<"div">]> \| undefined | -       |

## Integrations

# Code Block

Learn how to integrate Shiki, a beautiful yet powerful syntax highlighter.

Shiki (式, a Japanese word for "Style") is a beautiful and powerful syntax highlighter based on TextMate grammar and themes, the same engine as VS Code's syntax highlighting. It provides accurate and fast syntax highlighting for almost any mainstream programming language.

<figure class="card-filled-enhanced flex justify-center gap-4 p-8">
  <a href="https://shiki.style/" target="_blank" class="btn preset-filled">
    Shiki Documentation →
  </a>
</figure>

## Installation

[Install Shiki](https://shiki.style/guide/install) with your preferred package manager.

```bash
npm install -D shiki
```

## Create a Component

A reusable component should suffice in most projects. Follow the steps below.

1. Implement a new `<CodeBlock>` component in `/src/lib/components/code-block.svelte`.
2. Implement several variations of our `<CodeBlock>` component in any SvelteKit route `+page.svelte`.

```svelte
<script lang="ts">
	import CodeBlock from './code-block.svelte';
</script>

<div class="p-10 space-y-4">
	<CodeBlock code="npx sv create my-skeleton-app" lang="bash" />
	<CodeBlock code="<div class=&quot;bg-green-500&quot;" lang="html" />
	<CodeBlock code=".foobar &#123; background: green; &#125;" lang="css" />
	<CodeBlock code="const foot = 'bar';" lang="js" />
</div>

```

```svelte
<script lang="ts" module>
	import { createHighlighterCore } from 'shiki/core';
	import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

	const highlighter = await createHighlighterCore({
		langs: [
			import('@shikijs/langs/bash'),
			import('@shikijs/langs/css'),
			import('@shikijs/langs/html'),
			import('@shikijs/langs/javascript'),
		],
		themes: [import('@shikijs/themes/github-dark')],
		engine: createJavaScriptRegexEngine(),
	});

	interface CodeBlockProps {
		code: Parameters<typeof highlighter.codeToHtml>[0];
		lang?: Parameters<typeof highlighter.codeToHtml>[1]['lang'];
		// Base Style Props
		base?: string;
		background?: string;
		rounded?: string;
		shadow?: string;
		classes?: string;
		// Pre Style Props
		preBase?: string;
		prePadding?: string;
		preClasses?: string;
	}
</script>

<script lang="ts">
	const {
		code = '',
		lang = 'txt',
		// Base Style Props
		base = ' overflow-hidden',
		rounded = 'rounded-container',
		shadow = '',
		classes = '',
		// Pre Style Props
		preBase = '',
		prePadding = '',
		preClasses = '',
	}: CodeBlockProps = $props();

	const generatedHtml = highlighter.codeToHtml(code, {
		lang,
		theme: 'github-dark',
	});
</script>

<div class="{base} {rounded} {shadow} {classes} {preBase} {prePadding} {preClasses}">
	<!-- Output Shiki's Generated HTML -->
	{@html generatedHtml}
</div>

```

A few things of note about this component:

* You will need to import and configure any number of [Shiki themes](https://shiki.style/themes).
* You will need to import and configure any number of [supported languages](https://shiki.style/languages).
* The component has been implemented using Skeleton's [component style guidelines](/docs/\[framework]/resources/contribute/components).
* This provides a number of style props for easy customization via Skeleton's standard conventions.
* The component exposes `code`, `lang`, and `theme` properties to configure on-the-fly.
* The Code Block `<pre>` tag is auto-generated by Shiki; target utility classes with: `[&>pre]:myClassHere`.

## Programmatic Usage

<Alert type="warning">
  <p>This use case falls outside the scope of Skeleton. The following is provided merely as guidance.</p>
</Alert>

In some cases you may not have direct access to the source code, such as content from a blog posts or CMS pages. In fact the code may even come pre-baked with surrounding `<pre>` or `<code>` elements. For this, you'll need to follow the general steps below. Specific implementation may differ based on your app and framework.

1. Query all `<pre>` or `<code>` blocks using Javascript tools like `document.querySelectorAll()`. Be as specific as possible.
2. Ensure you have a clean instance of the source code itself, with no extra markup injected within.
3. Use Shiki's [codeToHtml](https://shiki.style/guide/install#shorthands) feature to parse the code as styled HTML markup.
4. Then append each instance of the code blocks in your DOM.

## Custom Themes

Shiki provides support for generating a custom highlighter theme:

* [Loading Custom Themes](https://shiki.style/guide/load-theme)
* [List of Bundled Themes](https://shiki.style/themes)

Shiki theme values can be defined using Skeleton custom theme properties, such as `rgba(--color-primary-500)`.

## Accessibility

See [Salma Alam-Naylor's](https://whitep4nth3r.com/about/) guidelines for [creating accessible code blocks](https://whitep4nth3r.com/blog/how-to-make-your-code-blocks-accessible-on-your-website/) that meet WGAC standards.


---

