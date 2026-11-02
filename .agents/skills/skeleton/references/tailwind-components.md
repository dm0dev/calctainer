# Badges

Show notifications, counts, or status information on navigation and icons

```astro
---
import { HeartIcon } from 'lucide-react';
---

<div class="flex items-center gap-2">
	<!-- A standard badge -->
	<span class="badge preset-filled-brand">Badge</span>

	<!-- A badge + icon -->
	<span class="badge preset-filled-brand">
		<HeartIcon className="fill-current stroke-0" size={10} />
		<span>Badge</span>
	</span>

	<!-- An icon badge -->
	<span class="badge-icon preset-filled-brand">
		<HeartIcon className="fill-current stroke-0" size={10} />
	</span>

	<!-- A badge dot -->
	<span class="badge-dot preset-filled-brand"> Badge </span>
</div>

```

## Inline

Display badges inline within buttons or list items.

```astro
---
import { HeartIcon } from 'lucide-react';
---

<div class="flex flex-col items-center gap-4">
	<btn class="btn btn-xs preset-tonal-brand">
		<HeartIcon />
		<span>Favorites</span>
		<span class="badge preset-filled-brand">64</span>
	</btn>
	<btn class="btn btn-sm preset-tonal-brand">
		<HeartIcon />
		<span>Favorites</span>
		<span class="badge preset-filled-brand">64</span>
	</btn>
	<btn class="btn btn-base preset-tonal-brand">
		<HeartIcon />
		<span>Favorites</span>
		<span class="badge preset-filled-brand">64</span>
	</btn>
	<btn class="btn btn-lg preset-tonal-brand">
		<HeartIcon />
		<span>Favorites</span>
		<span class="badge preset-filled-brand">64</span>
	</btn>
	<btn class="btn btn-xl preset-tonal-brand">
		<HeartIcon />
		<span>Favorites</span>
		<span class="badge preset-filled-brand">64</span>
	</btn>
</div>

```

## Overlapped

Create overlapping numeric or icon badge display.

```astro
---
import { HeartIcon } from 'lucide-react';

const imgSrc =
	'https://images.unsplash.com/photo-1620122303020-87ec826cf70d?q=80&w=256&h=256&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
---

<div class="flex items-center gap-4">
	<!-- A badge dot -->
	<div class="relative inline-block">
		<span class="badge-dot preset-filled-success-500 absolute right-1.5 top-1.5 z-10">Badge</span>
		<img class="size-20 overflow-hidden rounded-full grayscale" src={imgSrc} alt="Avatar" />
	</div>

	<!-- A standard badge -->
	<div class="relative inline-block">
		<span class="badge preset-filled-warning-500 absolute right-0 top-0 z-10">10</span>
		<img class="size-20 overflow-hidden rounded-full grayscale" src={imgSrc} alt="Avatar" />
	</div>

	<!-- An icon badge -->
	<div class="relative inline-block">
		<span class="badge-icon preset-filled-error-500 absolute right-0 top-0 z-10">
			<HeartIcon className="fill-current stroke-0" />
		</span>
		<img class="size-20 overflow-hidden rounded-full grayscale" src={imgSrc} alt="Avatar" />
	</div>
</div>

```

## Presets

Provides full support of [Presets](/docs/\[framework]/tailwind-utilities/presets).

```astro
---
import { HeartIcon } from 'lucide-react';
---

<div class="space-y-4">
	<div class="flex gap-4">
		<span class="badge-icon preset-filled"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled">Badge</span>
		<span class="badge preset-tonal">Badge</span>
		<span class="badge preset-outlined">Badge</span>
	</div>
	<div class="flex gap-4">
		<span class="badge-icon preset-filled-brand"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled-brand">Badge</span>
		<span class="badge preset-tonal-brand">Badge</span>
		<span class="badge preset-outlined-brand">Badge</span>
	</div>
	<hr class="hr" />
	<div class="flex gap-4">
		<span class="badge-icon preset-filled-primary-500"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled-primary-500">Badge</span>
		<span class="badge preset-tonal-primary">Badge</span>
		<span class="badge preset-outlined-primary-500">Badge</span>
	</div>
	<div class="flex gap-4">
		<span class="badge-icon preset-filled-secondary-500"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled-secondary-500">Badge</span>
		<span class="badge preset-tonal-secondary">Badge</span>
		<span class="badge preset-outlined-secondary-500">Badge</span>
	</div>
	<div class="flex gap-4">
		<span class="badge-icon preset-filled-tertiary-500"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled-tertiary-500">Badge</span>
		<span class="badge preset-tonal-tertiary">Badge</span>
		<span class="badge preset-outlined-tertiary-500">Badge</span>
	</div>
	<div class="flex gap-4">
		<span class="badge-icon preset-filled-success-500"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled-success-500">Badge</span>
		<span class="badge preset-tonal-success">Badge</span>
		<span class="badge preset-outlined-success-500">Badge</span>
	</div>
	<div class="flex gap-4">
		<span class="badge-icon preset-filled-warning-500"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled-warning-500">Badge</span>
		<span class="badge preset-tonal-warning">Badge</span>
		<span class="badge preset-outlined-warning-500">Badge</span>
	</div>
	<div class="flex gap-4">
		<span class="badge-icon preset-filled-error-500"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled-error-500">Badge</span>
		<span class="badge preset-tonal-error">Badge</span>
		<span class="badge preset-outlined-error-500">Badge</span>
	</div>
	<div class="flex gap-4">
		<span class="badge-icon preset-filled-surface-500"><HeartIcon className="fill-current stroke-0" /></span>
		<span class="badge preset-filled-surface-500">Badge</span>
		<span class="badge preset-tonal-surface">Badge</span>
		<span class="badge preset-outlined-surface-500">Badge</span>
	</div>
</div>

```

# Buttons

Provide a variety of button, including customizable sizes and types.

```astro
---
import { ArrowUpRightIcon } from 'lucide-react';
---

<div class="flex items-center gap-4">
	<!-- A standard button -->
	<button type="button" class="btn preset-filled">Button</button>
	<!-- A button + icon -->
	<button type="button" class="btn preset-filled">
		<span>Button</span>
		<ArrowUpRightIcon size={16} />
	</button>
	<!-- An icon button -->
	<button type="button" class="btn-icon preset-filled" title="Go" aria-label="Go">
		<ArrowUpRightIcon size={16} />
	</button>
</div>

```

## Sizes

Use `btn-{size}` paired with: `xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl`

```astro
---
import { ArrowUpRightIcon, PlusIcon } from 'lucide-react';
---

<div class="flex flex-col items-center gap-4">
	<div class="flex items-center gap-4">
		<button type="button" class="btn btn-xs preset-filled">Button</button>
		<button type="button" class="btn-icon btn-icon-xs preset-filled" title="Go" aria-label="Go">
			<ArrowUpRightIcon />
		</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn btn-sm preset-filled">Button</button>
		<button type="button" class="btn-icon btn-icon-sm preset-filled" title="Go" aria-label="Go">
			<ArrowUpRightIcon />
		</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn btn-base preset-filled">Button</button>
		<button type="button" class="btn-icon btn-icon-base preset-filled" title="Go" aria-label="Go">
			<ArrowUpRightIcon />
		</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn btn-lg preset-filled">Button</button>
		<button type="button" class="btn-icon btn-icon-lg preset-filled" title="Go" aria-label="Go">
			<ArrowUpRightIcon />
		</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn btn-xl preset-filled">Button</button>
		<button type="button" class="btn-icon btn-icon-xl preset-filled" title="Go" aria-label="Go">
			<ArrowUpRightIcon />
		</button>
	</div>

	<!-- NOTE: 2x|3xl|4xl|5xl|6xl|7xl|8xl|9xl tructated for space -->

	<hr class="hr" />

	<!-- Floating Action Buttons -->
	<div class="flex items-center gap-4">
		<!-- Shaped -->
		<button type="button" class="btn-icon btn-icon-2xl preset-filled" title="Go" aria-label="Go">
			<PlusIcon />
		</button>
		<!-- Circular -->
		<button type="button" class="btn-icon btn-icon-2xl preset-filled rounded-full" title="Go" aria-label="Go">
			<PlusIcon />
		</button>
	</div>
</div>

```

## Disabled

When applied to a `<button>` element you can use the `disabled` attribute.

```astro
---
import { ArrowUpRightIcon } from 'lucide-react';
---

<div class="flex items-center gap-4">
	<!-- A standard button -->
	<button type="button" class="btn preset-filled" disabled>Button</button>
	<!-- A button + icon -->
	<button type="button" class="btn preset-filled" disabled>
		<span>Button</span>
		<ArrowUpRightIcon size={16} />
	</button>
	<!-- An icon button -->
	<button type="button" class="btn-icon preset-filled" title="Go" aria-label="Go" disabled>
		<ArrowUpRightIcon size={16} />
	</button>
</div>

```

## Presets

Provides full support of [Presets](/docs/\[framework]/tailwind-utilities/presets).

```astro
---
import { ArrowUpRightIcon } from 'lucide-react';
---

<div class="space-y-4">
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled">Button</button>
		<button type="button" class="btn preset-tonal">Button</button>
		<button type="button" class="btn preset-outlined">Button</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled-brand" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled-brand">Button</button>
		<button type="button" class="btn preset-tonal-brand">Button</button>
		<button type="button" class="btn preset-outlined-brand">Button</button>
	</div>
	<hr class="hr" />
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled-primary-500" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled-primary-500">Button</button>
		<button type="button" class="btn preset-tonal-primary">Button</button>
		<button type="button" class="btn preset-outlined-primary-500">Button</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled-secondary-500" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled-secondary-500">Button</button>
		<button type="button" class="btn preset-tonal-secondary">Button</button>
		<button type="button" class="btn preset-outlined-secondary-500">Button</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled-tertiary-500" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled-tertiary-500">Button</button>
		<button type="button" class="btn preset-tonal-tertiary">Button</button>
		<button type="button" class="btn preset-outlined-tertiary-500">Button</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled-success-500" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled-success-500">Button</button>
		<button type="button" class="btn preset-tonal-success">Button</button>
		<button type="button" class="btn preset-outlined-success-500">Button</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled-warning-500" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled-warning-500">Button</button>
		<button type="button" class="btn preset-tonal-warning">Button</button>
		<button type="button" class="btn preset-outlined-warning-500">Button</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled-error-500" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled-error-500">Button</button>
		<button type="button" class="btn preset-tonal-error">Button</button>
		<button type="button" class="btn preset-outlined-error-500">Button</button>
	</div>
	<div class="flex items-center gap-4">
		<button type="button" class="btn-icon preset-filled-surface-500" title="Go" aria-label="Go"><ArrowUpRightIcon size={16} /></button>
		<button type="button" class="btn preset-filled-surface-500">Button</button>
		<button type="button" class="btn preset-tonal-surface">Button</button>
		<button type="button" class="btn preset-outlined-surface-500">Button</button>
	</div>
</div>

```

## Group

```svelte
<script lang="ts">
	let active = $state('january');
	const months = ['january', 'february', 'march'];
</script>

<nav class="btn-group preset-outlined-surface-200-800 flex-col md:flex-row">
	{#each months as month (month)}
		<button type="button" class="btn capitalize {month === active ? 'preset-filled' : 'preset-tonal'}" onclick={() => (active = month)}>
			{month}
		</button>
	{/each}
</nav>

```

# Cards

Provides container elements that wrap and separate content.

```astro
<div class="card w-full max-w-md preset-filled-surface-100-900 p-4 text-center">
	<p>Card</p>
</div>

```

## Hover

Hover styles are applied when the card is an `anchor` or `button` element.

```astro
---
const unsplashId = 'photo-1598305758677-7548ff30583b';
const imgSrc = `https://images.unsplash.com/${unsplashId}?q=80&w=450&h=190&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
---

<a href="#" class="card preset-filled-surface-100-900 divide-y divide-surface-200-800 max-w-md overflow-hidden">
	<!-- Header -->
	<header>
		<img src={imgSrc} class="aspect-21/9 w-full grayscale hue-rotate-90" alt="banner" />
	</header>

	<!-- Article -->
	<article class="space-y-4 p-4">
		<div>
			<h2 class="h6">Announcements</h2>
			<h3 class="h3">Skeleton is Awesome</h3>
		</div>
		<p class="opacity-60">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam aspernatur provident eveniet eligendi cumque consequatur tempore sint
			nisi sapiente. Iste beatae laboriosam iure molestias cum expedita architecto itaque quae rem.
		</p>
	</article>

	<!-- Footer -->
	<footer class="flex items-center justify-between gap-4 p-4">
		<small class="opacity-60">By Alex</small>
		<small class="opacity-60">On {new Date().toLocaleDateString()}</small>
	</footer>
</a>

```

## Presets

Provides full support of [Presets](/docs/\[framework]/tailwind-utilities/presets).

```astro
<div class="w-full space-y-4">
	<div class="grid grid-cols-3 gap-4">
		<div class="card p-4 preset-filled">Card</div>
		<div class="card p-4 preset-tonal">Card</div>
		<div class="card p-4 preset-outlined">Card</div>

		<div class="card p-4 preset-filled-brand">Card</div>
		<div class="card p-4 preset-tonal-brand">Card</div>
		<div class="card p-4 preset-outlined-brand">Card</div>
	</div>
	<hr class="hr" />
	<div class="grid grid-cols-3 gap-4">
		<div class="card p-4 preset-filled-primary-500">Card</div>
		<div class="card p-4 preset-tonal-primary">Card</div>
		<div class="card p-4 preset-outlined-primary-500">Card</div>

		<div class="card p-4 preset-filled-secondary-500">Card</div>
		<div class="card p-4 preset-tonal-secondary">Card</div>
		<div class="card p-4 preset-outlined-secondary-500">Card</div>

		<div class="card p-4 preset-filled-tertiary-500">Card</div>
		<div class="card p-4 preset-tonal-tertiary">Card</div>
		<div class="card p-4 preset-outlined-tertiary-500">Card</div>

		<div class="card p-4 preset-filled-success-500">Card</div>
		<div class="card p-4 preset-tonal-success">Card</div>
		<div class="card p-4 preset-outlined-success-500">Card</div>

		<div class="card p-4 preset-filled-warning-500">Card</div>
		<div class="card p-4 preset-tonal-warning">Card</div>
		<div class="card p-4 preset-outlined-warning-500">Card</div>

		<div class="card p-4 preset-filled-error-500">Card</div>
		<div class="card p-4 preset-tonal-error">Card</div>
		<div class="card p-4 preset-outlined-error-500">Card</div>

		<div class="card p-4 preset-filled-surface-500">Card</div>
		<div class="card p-4 preset-tonal-surface">Card</div>
		<div class="card p-4 preset-outlined-surface-500">Card</div>
	</div>
</div>

```

# Chips

Use chips to enter information, make selections, filter content, or trigger actions.

```astro
---
import { CheckIcon } from 'lucide-react';
---

<div class="flex items-center gap-2">
	<!-- A standard chip -->
	<button type="button" class="chip preset-outlined-surface-400-600 hover:preset-tonal">Chip</button>

	<!-- A chip + icon -->
	<button type="button" class="chip preset-outlined-surface-400-600 hover:preset-tonal">
		<span>Chip</span>
		<CheckIcon size={14} />
	</button>

	<!-- A simple icon chip -->
	<button type="button" class="chip-icon preset-outlined-surface-400-600 hover:preset-tonal">
		<CheckIcon size={14} />
	</button>
</div>

```

## Assist Chips

Represent a group of related contextual choices.

```svelte
<script lang="ts">
	import AlarmClockIcon from '@lucide/svelte/icons/alarm-clock';
	import AppWindowIcon from '@lucide/svelte/icons/app-window';
	import SunIcon from '@lucide/svelte/icons/sun';
</script>

<div class="card preset-filled-surface-100-900 p-4 space-y-4 w-full max-w-md overflow-hidden">
	<header>
		<h2 class="h6">Home Automation</h2>
	</header>
	<article class="space-y-4">
		<p class="opacity-60">Control your smart home with a single tap. Choose one of the quick actions below to get started.</p>
	</article>
	<hr class="hr" />
	<footer class="flex items-center justify-start gap-2 overflow-x-auto [scrollbar-width:none]">
		<button type="button" class="chip preset-outlined-surface-400-600">
			<SunIcon size={14} />
			<span>Turn on lights</span>
		</button>
		<button type="button" class="chip preset-outlined-surface-400-600">
			<AlarmClockIcon size={14} />
			<span>Set alarm</span>
		</button>
		<button type="button" class="chip preset-outlined-surface-400-600">
			<AppWindowIcon size={14} />
			<span>Close blinds</span>
		</button>
	</footer>
</div>

```

## Filter Chips

Represent a canned selection of options to choose from.

```svelte
<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';

	const colors = ['red', 'green', 'blue'];
	let color = $state(colors[0]);

	function setColor(selectedColor: string) {
		color = selectedColor;
	}
</script>

<div class="card preset-filled-surface-100-900 w-full max-w-md p-4">
	<div class="flex justify-center items-center gap-2">
		<span class="text-sm opacity-60">Favorite Color</span>
		<!-- --- -->
		{#each colors as c (c)}
			<button
				class={`chip capitalize preset-outlined-surface-400-600 ${color === c ? 'preset-tonal-primary' : ''}`}
				onclick={() => setColor(c)}
			>
				{#if color === c}<CheckIcon size={14} />{/if}
				<span>{c}</span>
			</button>
		{/each}
		<!-- --- -->
	</div>
</div>

```

## Input Chips

Represent user input values such as contacts or search terms.

```svelte
<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
</script>

<div class="card preset-filled-surface-100-900 w-full max-w-md p-4">
	<div class="flex justify-center items-center gap-2">
		<span class="text-sm opacity-60">To</span>
		<!-- --- -->
		<button class="chip preset-outlined-surface-400-600">
			<span>jane@email.com</span>
			<XIcon size={14} />
		</button>
		<button class="chip preset-outlined-surface-400-600">
			<span>dave@email.com</span>
			<XIcon size={14} />
		</button>
		<!-- --- -->
	</div>
</div>

```

## Suggestion Chips

Represent a canned set of suggested options for a user to choose from.

```svelte
<div class="card preset-filled-surface-100-900 w-full max-w-md p-4">
	<div class="flex justify-center items-center gap-2">
		<span class="text-sm opacity-60">Rating</span>
		<!-- --- -->
		<button class="chip preset-outlined-surface-400-600">
			<span>Bad</span>
		</button>
		<button class="chip preset-outlined-surface-400-600">
			<span>Good</span>
		</button>
		<button class="chip preset-outlined-surface-400-600">
			<span>Awesome</span>
		</button>
		<!-- --- -->
	</div>
</div>

```

## Disabled

When applied to a `<button>` element, you can use the `disabled` attribute.

```astro
<button type="button" class="chip preset-outlined-surface-400-600 hover:preset-tonal" disabled>Chip</button>

```

## Presets

Provides full support of [Presets](/docs/\[framework]/tailwind-utilities/presets).

```astro
<div class="space-y-4">
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled">Chip</button>
		<button type="button" class="chip preset-tonal">Chip</button>
		<button type="button" class="chip preset-outlined">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-brand">Chip</button>
		<button type="button" class="chip preset-tonal-brand">Chip</button>
		<button type="button" class="chip preset-outlined-brand">Chip</button>
	</div>
	<hr class="hr" />
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-primary-500">Chip</button>
		<button type="button" class="chip preset-tonal-primary">Chip</button>
		<button type="button" class="chip preset-outlined-primary-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-secondary-500">Chip</button>
		<button type="button" class="chip preset-tonal-secondary">Chip</button>
		<button type="button" class="chip preset-outlined-secondary-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-tertiary-500">Chip</button>
		<button type="button" class="chip preset-tonal-tertiary">Chip</button>
		<button type="button" class="chip preset-outlined-tertiary-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-success-500">Chip</button>
		<button type="button" class="chip preset-tonal-success">Chip</button>
		<button type="button" class="chip preset-outlined-success-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-warning-500">Chip</button>
		<button type="button" class="chip preset-tonal-warning">Chip</button>
		<button type="button" class="chip preset-outlined-warning-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-error-500">Chip</button>
		<button type="button" class="chip preset-tonal-error">Chip</button>
		<button type="button" class="chip preset-outlined-error-500">Chip</button>
	</div>
	<div class="flex gap-4">
		<button type="button" class="chip preset-filled-surface-500">Chip</button>
		<button type="button" class="chip preset-tonal-surface">Chip</button>
		<button type="button" class="chip preset-outlined-surface-500">Chip</button>
	</div>
</div>

```

# Dialogs

Display modal popups using the native HTML dialog element.

```svelte
<script lang="ts">
	let dialogRef: HTMLDialogElement;

	function showModal() {
		dialogRef?.showModal();
	}

	function closeModal() {
		dialogRef?.close();
	}
</script>

<!-- Dialog -->
<dialog bind:this={dialogRef} class="dialog preset-filled-surface-100-900 animate-dialog">
	<header>
		<h2 class="h3">Hello world!</h2>
	</header>
	<article>
		<p>This is an example modal created using the native Dialog element.</p>
	</article>
	<footer class="flex justify-end">
		<form method="dialog">
			<button type="button" class="btn preset-tonal" onclick={closeModal}>Close</button>
		</form>
	</footer>
</dialog>

<!-- Trigger -->
<button class="btn preset-filled" onclick={showModal}>Open Dialog</button>

```

## Alert Dialog

Set [`role="alertdialog"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alertdialog_role) for dialogs that interrupt the user with a message requiring a response.

```svelte
<script lang="ts">
	let dialogRef: HTMLDialogElement;

	function showModal() {
		dialogRef?.showModal();
	}

	function closeModal() {
		dialogRef?.close();
	}
</script>

<!-- Dialog -->
<dialog
	bind:this={dialogRef}
	role="alertdialog"
	aria-labelledby="alertdialog-title"
	aria-describedby="alertdialog-description"
	class="dialog animate-dialog preset-filled-error-500 [--dialog-backdrop:color-mix(in_oklab,var(--color-error-50-950)_75%,transparent)]"
>
	<header>
		<h2 id="alertdialog-title" class="h3">Discard changes?</h2>
	</header>
	<article>
		<p id="alertdialog-description">You have unsaved changes that will be lost. This action cannot be undone.</p>
	</article>
	<footer class="flex justify-end gap-2">
		<button type="button" class="btn preset-tonal" onclick={closeModal}>Cancel</button>
		<button type="button" class="btn preset-filled" onclick={closeModal}>Discard</button>
	</footer>
</dialog>

<!-- Trigger -->
<button class="btn preset-filled" onclick={showModal}>Open Dialog</button>

```

## Non-Modal

Call [`show()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show) instead of `showModal()` to open a dialog without a backdrop or top-layer placement. Similar to a tooltip.

```svelte
<script lang="ts">
	let dialogRef: HTMLDialogElement;

	function toggle() {
		if (!dialogRef) return;
		if (dialogRef.open) {
			dialogRef.close();
		} else {
			dialogRef.show();
		}
	}
</script>

<div class="relative">
	<!-- Dialog -->
	<dialog
		bind:this={dialogRef}
		closedby="any"
		class="dialog preset-filled-surface-100-900 animate-dialog [--dialog-top:auto] [--dialog-left:50%] [--dialog-translate:-50%_0] bottom-full mb-2 whitespace-nowrap"
	>
		<p>This acts as a tooltip.</p>
	</dialog>

	<!-- Trigger -->
	<button class="btn preset-filled" onclick={toggle}>Toggle Dialog</button>
</div>

```

## Fullscreen

Add `dialog-fullscreen` to expand the dialog to the full viewport.

```svelte
<script lang="ts">
	let dialogRef: HTMLDialogElement;

	function showModal() {
		document.body.style.overflow = 'hidden';
		dialogRef?.showModal();
	}

	function closeModal() {
		dialogRef?.close();
	}

	function onClose() {
		document.body.style.overflow = '';
	}
</script>

<!-- Dialog -->
<dialog bind:this={dialogRef} onclose={onClose} class="dialog dialog-fullscreen preset-filled-surface-100-900 animate-dialog">
	<header>
		<h2 class="h3">Hello world!</h2>
	</header>
	<article>
		<p>This dialog expands to fill the entire viewport and locks page scrolling while open.</p>
	</article>
	<footer class="flex justify-end">
		<form method="dialog">
			<button type="button" class="btn preset-tonal" onclick={closeModal}>Close</button>
		</form>
	</footer>
</dialog>

<!-- Trigger -->
<button class="btn preset-filled" onclick={showModal}>Open Dialog</button>

```

## Animation

Add `animate-dialog` to opt into a fade transition for the dialog and its backdrop.

```svelte
<script lang="ts">
	let dialogRef: HTMLDialogElement;

	function showModal() {
		dialogRef?.showModal();
	}

	function closeModal() {
		dialogRef?.close();
	}
</script>

<!-- Dialog -->
<dialog bind:this={dialogRef} class="dialog animate-dialog preset-filled-surface-100-900">
	<header>
		<h2 class="h3">Hello world!</h2>
	</header>
	<article>
		<p>Opening and closing this dialog fades the surface and backdrop.</p>
	</article>
	<footer class="flex justify-end">
		<form method="dialog">
			<button type="button" class="btn preset-tonal" onclick={closeModal}>Close</button>
		</form>
	</footer>
</dialog>

<!-- Trigger -->
<button class="btn preset-filled" onclick={showModal}>Open Dialog</button>

```

## Interaction

### Light Dismiss

Set [`closedby="any"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby) to allow the user to close the dialog by clicking the backdrop or pressing Esc.

```svelte
<script lang="ts">
	let dialogRef: HTMLDialogElement;

	function showModal() {
		dialogRef?.showModal();
	}

	function closeModal() {
		dialogRef?.close();
	}
</script>

<!-- Dialog -->
<dialog bind:this={dialogRef} closedby="any" class="dialog preset-filled-surface-100-900 animate-dialog">
	<header>
		<h2 class="h3">Click outside to close</h2>
	</header>
	<article>
		<p>This dialog supports light dismiss. Click the backdrop or press Esc to close.</p>
	</article>
	<footer class="flex justify-end">
		<form method="dialog">
			<button type="button" class="btn preset-tonal" onclick={closeModal}>Close</button>
		</form>
	</footer>
</dialog>

<!-- Trigger -->
<button class="btn preset-filled" onclick={showModal}>Open Dialog</button>

```

<details class="disclosure">
  <summary>⚠️ View Browser Support</summary>

  <div class="disclosure-content">
    \| Browser             | Minimum Version | Released      |
    \| ------------------- | --------------- | ------------- |
    \| Safari              | 18.2            | December 2024 |
    \| Safari on iOS       | 18.2            | December 2024 |
    \| Chrome              | 134             | March 2025    |
    \| Edge                | 134             | March 2025    |
    \| Chrome for Android  | 134             | March 2025    |
    \| Firefox             | 136             | March 2025    |
    \| Firefox for Android | 136             | March 2025    |
  </div>
</details>

### Result Handling

Wrap controls in a [`<form method="dialog">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#usage_notes), then read each submit button's `value` from `dialog.returnValue` on [`close`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event).

```svelte
<script lang="ts">
	let dialogRef: HTMLDialogElement;
	let result = $state('—');

	function showModal() {
		dialogRef?.showModal();
	}

	function onClose() {
		result = dialogRef.returnValue || '(dismissed)';
	}
</script>

<!-- Dialog -->
<dialog bind:this={dialogRef} onclose={onClose} class="dialog preset-filled-surface-100-900 animate-dialog">
	<header>
		<h2 class="h3">Confirm action</h2>
	</header>
	<article>
		<p>Submitting either button closes the dialog and exposes its value via the dialog's returnValue.</p>
	</article>
	<footer class="flex justify-end gap-2">
		<form method="dialog" class="flex gap-2">
			<button type="submit" value="cancel" class="btn preset-tonal">Cancel</button>
			<button type="submit" value="confirm" class="btn preset-filled">Confirm</button>
		</form>
	</footer>
</dialog>

<!-- Trigger -->
<div class="flex flex-col items-center gap-3">
	<button class="btn preset-filled" onclick={showModal}>Open Dialog</button>
	<p class="text-sm opacity-75">Last result: <code>{result}</code></p>
</div>

```

### Invoker Commands

Use the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#modal_dialogs_using_invoker_commands) to control state with pure HTML.

```astro
<!-- Dialog -->
<dialog id="invoker-dialog" class="dialog preset-filled-surface-100-900 animate-dialog">
	<header>
		<h2 class="h3">Hello world!</h2>
	</header>
	<article>
		<p>This modal is controlled using HTML invoker commands &mdash; no JavaScript required.</p>
	</article>
	<footer class="flex justify-end">
		<button type="button" class="btn preset-tonal" command="close" commandfor="invoker-dialog">Close</button>
	</footer>
</dialog>

<!-- Trigger -->
<button type="button" class="btn preset-filled" command="show-modal" commandfor="invoker-dialog">Open Dialog</button>

```

<details class="disclosure">
  <summary>⚠️ View Browser Support</summary>

  <div class="disclosure-content">
    \| Browser             | Minimum Version | Released      |
    \| ------------------- | --------------- | ------------- |
    \| Chrome              | 135             | April 2025    |
    \| Edge                | 135             | April 2025    |
    \| Chrome for Android  | 135             | April 2025    |
    \| Firefox             | 144             | October 2025  |
    \| Firefox for Android | 144             | October 2025  |
    \| Safari              | 26.2            | December 2025 |
    \| Safari on iOS       | 26.2            | December 2025 |
  </div>
</details>

***

## Alternatives

Explore Skeleton's framework components for more advanced features and control:

* [Dialog](/docs/\[framework]/framework-components/dialog)
* [Popover](/docs/\[framework]/framework-components/popover)
* [Portal](/docs/\[framework]/framework-components/portal)

# Disclosures

Toggle the visibility of collapsible content using the native HTML details element.

```astro
<details class="disclosure">
	<summary>How long does shipping take?</summary>
	<div class="disclosure-content">
		<p>
			Standard orders ship within 1-2 business days and arrive in 3-5 business days. Expedited shipping is available at checkout for
			next-day delivery in most regions.
		</p>
	</div>
</details>

```

## Group

Wrap with `disclosure-group` and share a [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name) attribute so only one item stays open at a time.

```astro
<div class="disclosure-group">
	<details class="disclosure" name="faq">
		<summary>How long does shipping take?</summary>
		<div class="disclosure-content">
			<p>
				Standard orders ship within 1-2 business days and arrive in 3-5 business days. Expedited shipping is available at checkout for
				next-day delivery in most regions.
			</p>
		</div>
	</details>
	<hr class="hr" />
	<details class="disclosure" name="faq">
		<summary>What is your return policy?</summary>
		<div class="disclosure-content">
			<p>
				Returns are accepted within 30 days of delivery. Items must be unused and in their original packaging. We provide a prepaid return
				label for orders over $50.
			</p>
		</div>
	</details>
	<hr class="hr" />
	<details class="disclosure" name="faq">
		<summary><span>Do you ship internationally?</span></summary>
		<div class="disclosure-content">
			<p>
				Yes, we ship to over 60 countries. International orders typically arrive within 7-14 business days, and any applicable customs fees
				are calculated at checkout.
			</p>
		</div>
	</details>
</div>

```

## Open

Add the `open` attribute to render a disclosure expanded by default.

```astro
<details class="disclosure" open>
	<summary>How long does shipping take?</summary>
	<div class="disclosure-content">
		<p>
			Standard orders ship within 1-2 business days and arrive in 3-5 business days. Expedited shipping is available at checkout for
			next-day delivery in most regions.
		</p>
	</div>
</details>

```

## Animation

The slide animation is a progressive enhancement via [::details-content](https://developer.mozilla.org/en-US/docs/Web/CSS/::details-content) and [interpolate-size: allow-keywords](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size). For unsupported browsers this will fall back to the native instant toggle.

# Dividers

Horizontal and vertical rule styling.

```astro
<div class="card preset-filled-surface-100-900 w-full max-w-md p-4 space-y-4 text-center">
	<p class="opacity-60">Above the divider.</p>
	<!-- - -->
	<hr class="hr" />
	<!-- - -->
	<p class="opacity-60">Below the divider.</p>
</div>

```

## Vertical

Apply `vr` to a `<span>` for a vertical variant.

```astro
<div class="card preset-filled-surface-100-900 grid grid-cols-[1fr_auto_1fr] gap-4 w-full max-w-md p-4 text-center">
	<p class="opacity-60">Left Side</p>
	<!-- - -->
	<span class="vr"></span>
	<!-- - -->
	<p class="opacity-60">Right Side</p>
</div>

```

## Size

Use Tailwind's [border width](https://tailwindcss.com/docs/border-width) utilities to adjust thickness.

* Use `border-t` (top) for horizontal
* Use `border-l` (left) for vertical

```astro
<div class="w-full grid grid-cols-1 gap-4">
	<p>Default</p>
	<hr class="hr" />

	<p>border-t-2</p>
	<hr class="hr border-t-2" />

	<p>border-t-4</p>
	<hr class="hr border-t-4" />

	<p>border-t-8</p>
	<hr class="hr border-t-8" />
</div>

```

## Style

Use Tailwind's [border style](https://tailwindcss.com/docs/border-style) utilities to adjust visual style.

```astro
<div class="w-full grid grid-cols-1 gap-4">
	<p>border-solid</p>
	<hr class="hr border-solid" />

	<p>border-dashed</p>
	<hr class="hr border-dashed" />

	<p>border-dotted</p>
	<hr class="hr border-dotted" />

	<p>border-double</p>
	<hr class="hr border-4 border-double" />
</div>

```

## Colors

Use any Tailwind or Skeleton [colors or pairing](/docs/\[framework]/design/colors).

```astro
<div class="w-full grid grid-cols-1 gap-4">
	<p>border-brand</p>
	<hr class="hr border-brand" />

	<p>border-primary-500</p>
	<hr class="hr border-primary-500" />

	<p>border-secondary-500</p>
	<hr class="hr border-secondary-500" />

	<p>border-tertiary-500</p>
	<hr class="hr border-tertiary-500" />

	<p>border-success-500</p>
	<hr class="hr border-success-500" />

	<p>border-warning-500</p>
	<hr class="hr border-warning-500" />

	<p>border-error-500</p>
	<hr class="hr border-error-500" />

	<p>border-surface-950-50</p>
	<hr class="hr border-surface-950-50" />
</div>

```

# Forms and Inputs

Various form and input styles.

```astro
<form class="card bg-surface-100-900 p-4 w-full max-w-md mx-auto space-y-4">
	<header>
		<h3 class="h3">Account</h3>
	</header>
	<fieldset class="fieldset space-y-2">
		<legend class="legend">Account Details</legend>
		<label class="label">
			<span class="label-text">Email</span>
			<input class="input" type="email" placeholder="you@example.com" />
		</label>
	</fieldset>
	<fieldset class="fieldset space-y-2">
		<legend class="legend">Shipping Address</legend>
		<label class="label">
			<span class="label-text">Street</span>
			<input class="input" type="text" placeholder="123 Main St" />
		</label>
		<label class="label">
			<span class="label-text">City</span>
			<select class="select">
				<option disabled selected>Select a city</option>
				<option value="nyc">New York</option>
				<option value="la">Los Angeles</option>
				<option value="chi">Chicago</option>
			</select>
		</label>
	</fieldset>
	<fieldset class="fieldset space-y-2">
		<legend class="legend">Notes</legend>
		<label class="label">
			<span class="label-text">Delivery Instructions</span>
			<textarea class="textarea" rows="3" placeholder="Delivery instructions..."></textarea>
		</label>
	</fieldset>
	<footer class="flex justify-end">
		<button type="submit" class="btn preset-filled">Submit</button>
	</footer>
</form>

```

## Requirements

Skeleton relies on the official [Tailwind Forms](https://github.com/tailwindlabs/tailwindcss-forms) plugin to normalize form styling, also known as a reset. This plugin is <u>required</u> if you wish to use any form utility classes provided on this page.

<figure class="card-filled-enhanced flex justify-center gap-4 p-8">
  <a class="btn preset-filled" href="https://github.com/tailwindlabs/tailwindcss-forms" target="_blank">
    View on Github
  </a>
</figure>

Install the `@tailwindcss/forms` package, then implement the `@plugin` directive in your global stylesheet.

```sh
npm install -D @tailwindcss/forms
```

```css
@import 'tailwindcss';
@plugin '@tailwindcss/forms';

/* ...Skeleton config here... */
```

## Browser Support

The quality and appearance of native and semantic HTML form elements can vary between both operating systems and browser vendors. Skeleton does its best to adhere to progressive enhancement best practices. However, we advise you validate support for each element per your target audience.

***

## Fieldsets

Use the optional `.fieldset` and `.legend` classes to group related form controls with an accessible title.

```astro
<form class="w-full max-w-md mx-auto space-y-4">
	<fieldset class="fieldset space-y-2">
		<legend class="legend">Account Details</legend>
		<label class="label">
			<span class="label-text">Email</span>
			<input class="input" type="email" placeholder="you@example.com" />
		</label>
		<label class="label">
			<span class="label-text">Password</span>
			<input class="input" type="password" placeholder="••••••••" />
		</label>
	</fieldset>
</form>

```

## Labels

Use `.label` and `.label-text` for styling the visible label text.

```astro
<form class="mx-auto w-full max-w-md space-y-4">
	<!-- Wrapped -->
	<label class="label">
		<span class="label-text">First Name</span>
		<input class="input" type="text" placeholder="Jane" />
	</label>
	<!-- Siblings -->
	<div class="space-y-1">
		<label class="label label-text" for="lastname">Last Name</label>
		<input class="input" type="text" id="lastname" name="lastname" placeholder="Doe" />
	</div>
</form>

```

## Input

Apply the `.input` class to all standard box-shaped [input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types).

```astro
<div class="mx-auto w-full max-w-md space-y-4">
	<!-- Standard Inputs -->
	<form class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- text -->
		<label class="label">
			<span class="label-text">Input</span>
			<input class="input" type="text" placeholder="Input" />
		</label>
		<!-- password -->
		<label class="label">
			<span class="label-text">Input: password</span>
			<input class="input" type="password" placeholder="Input" />
		</label>
		<!-- email -->
		<label class="label">
			<span class="label-text">Input: email</span>
			<input class="input" type="email" placeholder="Input" />
		</label>
		<!-- url -->
		<label class="label">
			<span class="label-text">Input: url</span>
			<input class="input" type="url" placeholder="Input" />
		</label>
		<!-- tel -->
		<label class="label">
			<span class="label-text">Input: tel</span>
			<input class="input" type="tel" placeholder="Input" />
		</label>
		<!-- search -->
		<label class="label">
			<span class="label-text">Input: search</span>
			<input class="input" type="search" placeholder="Input" />
		</label>
		<!-- number -->
		<label class="label">
			<span class="label-text">Input: number</span>
			<input class="input" type="number" placeholder="Input" />
		</label>
	</form>

	<hr class="hr col-span-2" />

	<!-- File Input -->
	<form class="col-span-2">
		<label class="label">
			<span class="label-text">File Input</span>
			<input class="input" type="file" />
		</label>
	</form>

	<hr class="hr col-span-2" />

	<!-- Date/Time Inputs -->
	<form class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- date -->
		<label class="label">
			<span class="label-text">Input: date</span>
			<input class="input" type="date" placeholder="Input" />
		</label>
		<!-- datetime-local -->
		<label class="label">
			<span class="label-text">Input: datetime-local</span>
			<input class="input" type="datetime-local" placeholder="Input" />
		</label>
		<!-- month -->
		<label class="label">
			<span class="label-text">Input: month</span>
			<input class="input" type="month" placeholder="Input" />
		</label>
		<!-- time -->
		<label class="label">
			<span class="label-text">Input: time</span>
			<input class="input" type="time" placeholder="Input" />
		</label>
		<!-- week -->
		<label class="label">
			<span class="label-text">Input: week</span>
			<input class="input" type="week" placeholder="Input" />
		</label>
	</form>
</div>

```

## Select

Apply the `.select` class to `<select>` elements for single or multiple option menus.

```astro
<form class="mx-auto w-full max-w-md space-y-4">
	<!-- Basic Placeholder -->
	<label class="label">
		<span class="label-text">Basic Placeholder</span>
		<select class="select">
			<option disabled selected>Preferred Flavor</option>
			<option value="1">Strawberry</option>
			<option value="2">Grape</option>
			<option value="3">Watermelon</option>
			<option value="4">Apple</option>
			<option value="5">Mango</option>
		</select>
	</label>
	<!-- Optgroup -->
	<label class="label">
		<span class="label-text">Optgroup</span>
		<select class="select">
			<optgroup label="Berries">
				<option value="strawberry">Strawberry</option>
				<option value="blueberry">Blueberry</option>
				<option value="raspberry">Raspberry</option>
			</optgroup>
			<optgroup label="Citrus">
				<option value="orange">Orange</option>
				<option value="lemon">Lemon</option>
				<option value="lime">Lime</option>
			</optgroup>
			<optgroup label="Tropical">
				<option value="mango">Mango</option>
				<option value="pineapple">Pineapple</option>
				<option value="coconut">Coconut</option>
			</optgroup>
		</select>
	</label>
	<!-- Using Divider -->
	<label class="label">
		<span class="label-text">Using Divider</span>
		<select class="select">
			<option value="strawberry">Strawberry</option>
			<option value="grape">Grape</option>
			<option value="watermelon">Watermelon</option>
			<hr />
			<option value="dragonfruit">Dragonfruit</option>
			<option value="lychee">Lychee</option>
			<option value="passionfruit">Passionfruit</option>
		</select>
	</label>
</form>

```

## Textarea

Apply the `.textarea` class to `<textarea>` elements for multi-line text input.

```astro
<form class="mx-auto w-full max-w-md space-y-4">
	<textarea class="textarea" rows="4" placeholder="Tell us more..."></textarea>
</form>

```

## Checkboxes

Use `type="checkbox"` for inputs that allow one or more independent options to be toggled on or off.

```astro
<form class="space-y-2">
	<label class="flex items-center space-x-2">
		<input class="checkbox" type="checkbox" checked />
		<p>Option 1</p>
	</label>
	<label class="flex items-center space-x-2">
		<input class="checkbox" type="checkbox" />
		<p>Option 2</p>
	</label>
	<label class="flex items-center space-x-2">
		<input class="checkbox" type="checkbox" />
		<p>Option 3</p>
	</label>
</form>

```

## Radio Groups

Use `type="radio"` to present a set of mutually exclusive options where only one can be selected.

```astro
<form class="space-y-2">
	<label class="flex items-center space-x-2">
		<input class="radio" type="radio" checked name="radio-direct" value="1" />
		<p>Option 1</p>
	</label>
	<label class="flex items-center space-x-2">
		<input class="radio" type="radio" name="radio-direct" value="2" />
		<p>Option 2</p>
	</label>
	<label class="flex items-center space-x-2">
		<input class="radio" type="radio" name="radio-direct" value="3" />
		<p>Option 3</p>
	</label>
</form>

```

## Range

Use `type="range"` to allow selection of a numeric value from a continuous or stepped range via a slider.

```astro
<form class="mx-auto w-full max-w-md">
	<label class="label">
		<span class="label-text">Range</span>
		<input class="input" type="range" value="75" max="100" />
	</label>
</form>

```

## Progress

Use `<progress>` to indicate the completion status of a task, such as a file upload or loading operation.

```astro
<form class="mx-auto w-full max-w-md">
	<label class="label">
		<span class="label-text">Progress</span>
		<progress class="progress" value="50" max="100"></progress>
	</label>
</form>

```

## Meter

Use `<meter>` to represent a scalar value within a known range, such as disk usage, battery level, or a score.

```astro
<form class="mx-auto flex w-full max-w-md flex-col gap-4">
	<label class="label">
		<span class="label-text">Optimum</span>
		<meter class="meter" value="80" min="0" max="100" low="33" high="66" optimum="80"></meter>
	</label>
	<label class="label">
		<span class="label-text">Suboptimum</span>
		<meter class="meter" value="50" min="0" max="100" low="33" high="66" optimum="80"></meter>
	</label>
	<label class="label">
		<span class="label-text">Even Less Good</span>
		<meter class="meter" value="20" min="0" max="100" low="33" high="66" optimum="80"></meter>
	</label>
</form>

```

## Color

Use `type="color"` to provide a native color picker for selecting a single color value.

```astro
<form class="mx-auto w-full max-w-md">
	<div class="grid grid-cols-[auto_1fr] gap-2">
		<input class="input" type="color" value="#bada55" />
		<input class="input" type="text" value="#bada55" readonly tabindex="-1" />
	</div>
</form>

```

***

## Field Sizes

Use `field-{size}` paired with: `xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl`

```astro
<form class="mx-auto w-full max-w-md grid grid-cols-[auto_1fr_auto] items-center gap-4">
	<!-- xs -->
	<span class="label-text text-right">xs</span>
	<input class="input field-xs" type="text" placeholder="Input" />
	<button class="btn btn-xs preset-filled">Button</button>

	<!-- sm -->
	<span class="label-text text-right">sm</span>
	<input class="input field-sm" type="text" placeholder="Input" />
	<button class="btn btn-sm preset-filled">Button</button>

	<!-- base -->
	<span class="label-text text-right">base</span>
	<input class="input field-base" type="text" placeholder="Input" />
	<button class="btn btn-base preset-filled">Button</button>

	<!-- lg -->
	<span class="label-text text-right">lg</span>
	<input class="input field-lg" type="text" placeholder="Input" />
	<button class="btn btn-lg preset-filled">Button</button>

	<!-- xl -->
	<span class="label-text text-right">xl</span>
	<input class="input field-xl" type="text" placeholder="Input" />
	<button class="btn btn-xl preset-filled">Button</button>

	<!-- NOTE: 2x|3xl|4xl|5xl|6xl|7xl|8xl|9xl tructated for space -->
</form>

```

## Field Groups

Apply `field-group` to create a grouping of related box-shaped fields or buttons. This acts as a [grid](https://tailwindcss.com/docs/display#grid) container, allowing for column configuration. Make use of [Presets](/docs/\[framework]/tailwind-utilities/presets) to style label columns.

```astro
---
import { CheckIcon, CircleDollarSignIcon, SearchIcon } from 'lucide-react';
---

<form class="w-full space-y-8">
	<!-- Website -->
	<div class="field-group grid-cols-[auto_1fr_auto]">
		<label class="label label-text preset-tonal" for="url">https://</label>
		<input class="input" type="text" name="url" id="url" placeholder="www.example.com" />
	</div>

	<!-- Amount -->
	<div class="field-group grid-cols-[auto_1fr_auto]">
		<label class="label label-text preset-tonal-primary" for="amount" title="Money" aria-label="Money">
			<CircleDollarSignIcon size={16} />
		</label>
		<input class="input" type="text" name="amount" id="amount" placeholder="Amount" />
		<select class="select" name="currency" id="currency">
			<option>USD</option>
			<option>CAD</option>
			<option>EUR</option>
		</select>
	</div>

	<!-- Username -->
	<div class="field-group grid-cols-[auto_1fr_auto]">
		<label class="label label-text preset-tonal-secondary" for="username">Username</label>
		<input class="input" type="text" name="username" id="username" placeholder="Enter Username..." />
		<button class="btn preset-filled" title="Username already in use.">
			<CheckIcon size={16} />
		</button>
	</div>

	<!-- Search -->
	<!-- NOTE: Supports field and button sizes -->
	<div class="field-group grid-cols-[auto_1fr_auto]">
		<label class="label label-text preset-tonal-tertiary" for="search">
			<SearchIcon size={16} />
		</label>
		<input class="input field-xl" type="search" name="search" id="search" placeholder="Search..." />
		<button class="btn btn-xl preset-filled">Submit</button>
	</div>
</form>

```

# Placeholders

Provides "skeleton" placeholders that can display while content loads.

```astro
<div class="w-full space-y-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center justify-center space-x-4">
			<div class="placeholder-circle size-16 animate-pulse [animation-duration:4s]"></div>
			<div class="placeholder-circle size-14 animate-pulse [animation-duration:4s]"></div>
			<div class="placeholder-circle size-10 animate-pulse [animation-duration:4s]"></div>
		</div>
	</div>
	<div class="space-y-4">
		<div class="placeholder animate-pulse [animation-duration:4s]"></div>
		<div class="grid grid-cols-4 gap-4">
			<div class="placeholder animate-pulse [animation-duration:4s]"></div>
			<div class="placeholder animate-pulse [animation-duration:4s]"></div>
			<div class="placeholder animate-pulse [animation-duration:4s]"></div>
			<div class="placeholder animate-pulse [animation-duration:4s]"></div>
		</div>
		<div class="placeholder animate-pulse [animation-duration:4s]"></div>
		<div class="placeholder animate-pulse [animation-duration:4s]"></div>
	</div>
</div>

```

## Animation

Use Tailwind's [animate-pulse](https://tailwindcss.com/docs/animation) animation paired with any arbitrary duration.

```html
<div class="placeholder animate-pulse [animation-duration:4s]">...</div>
```

# Tables

Provides a set of styles for native HTML table elements.

```astro
---
const tableData = [
	{ position: '0', name: 'Iron', symbol: 'Fe', atomic_no: '26' },
	{ position: '1', name: 'Rhodium', symbol: 'Rh', atomic_no: '45' },
	{ position: '2', name: 'Iodine', symbol: 'I', atomic_no: '53' },
	{ position: '3', name: 'Radon', symbol: 'Rn', atomic_no: '86' },
	{ position: '4', name: 'Technetium', symbol: 'Tc', atomic_no: '43' },
];
---

<div class="card bg-surface-100-900 p-4 table-wrap">
	<!-- - -->
	<table class="table caption-bottom">
		<tbody class="[&>tr]:hover:preset-tonal-brand">
			{
				tableData.map((row) => (
					<tr>
						<td>{row.position}</td>
						<td>{row.symbol}</td>
						<td>{row.name}</td>
						<td class="text-right">{row.atomic_no}</td>
					</tr>
				))
			}
		</tbody>
	</table>
	<!-- - -->
</div>

```

## Zebra Striping

Apply the `table-zebra` class to add alternating row background colors.

```astro
---
const tableData = [
	{ position: '0', name: 'Iron', symbol: 'Fe', atomic_no: '26' },
	{ position: '1', name: 'Rhodium', symbol: 'Rh', atomic_no: '45' },
	{ position: '2', name: 'Iodine', symbol: 'I', atomic_no: '53' },
	{ position: '3', name: 'Radon', symbol: 'Rn', atomic_no: '86' },
	{ position: '4', name: 'Technetium', symbol: 'Tc', atomic_no: '43' },
];
---

<div class="table-wrap">
	<table class="table table-zebra caption-bottom">
		<tbody class="[&>tr]:hover:preset-tonal-brand">
			{
				tableData.map((row) => (
					<tr>
						<td>{row.position}</td>
						<td>{row.symbol}</td>
						<td>{row.name}</td>
						<td class="text-right">{row.atomic_no}</td>
					</tr>
				))
			}
		</tbody>
	</table>
</div>

```

## Extras

Optionally add a header, footer, and caption.

```astro
---
const tableData = [
	{ position: '0', name: 'Iron', symbol: 'Fe', atomic_no: '26' },
	{ position: '1', name: 'Rhodium', symbol: 'Rh', atomic_no: '45' },
	{ position: '2', name: 'Iodine', symbol: 'I', atomic_no: '53' },
	{ position: '3', name: 'Radon', symbol: 'Rn', atomic_no: '86' },
	{ position: '4', name: 'Technetium', symbol: 'Tc', atomic_no: '43' },
];
---

<div class="table-wrap">
	<table class="table caption-bottom">
		<caption class="pt-4">A list of elements from the periodic table.</caption>
		<thead>
			<tr>
				<th>Position</th>
				<th>Symbol</th>
				<th>Name</th>
				<th class="text-right!">Weight</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-brand">
			{
				tableData.map((row) => (
					<tr>
						<td>{row.position}</td>
						<td>{row.symbol}</td>
						<td>{row.name}</td>
						<td class="text-right">{row.atomic_no}</td>
					</tr>
				))
			}
		</tbody>
		<tfoot>
			<tr>
				<td colspan="3">Total</td>
				<td class="text-right">{tableData.length} Elements</td>
			</tr>
		</tfoot>
	</table>
</div>

```

## Navigation

Note that table rows and cells are [not interactive](https://www.w3.org/WAI/ARIA/apg/patterns/table/). Instead, use anchors or buttons within the last cell.

```astro
---
const tableData = [
	{ first: 'Liam', last: 'Steele', email: 'liam@email.com' },
	{ first: 'Athena', last: 'Marks', email: 'athena@email.com' },
	{ first: 'Angela', last: 'Rivers', email: 'angela@email.com' },
];
---

<div class="table-wrap">
	<table class="table caption-bottom">
		<tbody>
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
					<th>&nbsp;</th>
				</tr>
			</thead>
			{
				tableData.map((row) => (
					<tr>
						<td>{row.first}</td>
						<td>{row.last}</td>
						<td>{row.email}</td>
						<td class="text-right">
							<a class="btn btn-xs preset-tonal" href="#">
								View &rarr;
							</a>
						</td>
					</tr>
				))
			}
		</tbody>
	</table>
</div>

```

## Layout

See [Tailwind's utility classes](https://tailwindcss.com/docs/table-layout) for adjusting the table layout algorithm. Apply this to the Table element.

\| Class         | Styles               |
\| ------------- | -------------------- |
\| `table-auto`  | table-layout: auto;  |
\| `table-fixed` | table-layout: fixed; |

## Hover Rows

Add a visual hover effect using the following Tailwind syntax.

```html
<tbody class="[&>tr]:hover:preset-tonal-primary">
	...
</tbody>
```

## Pagination

Pair with the Skeleton [Pagination](/docs/\[framework]/framework-components/pagination/) component for large data sets.

## Framework Components


---

