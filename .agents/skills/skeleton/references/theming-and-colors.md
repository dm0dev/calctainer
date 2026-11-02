# Themes

The Skeleton theme system.

Skeleton themes utilize CSS custom properties to define core settings for your design system. A number of preset themes are offered out of the box. As well as access to a powerful theme generator to create your own. Enable one or more and quickly switch on-demand.

## How Themes Work

Skeleton themes are CSS files you import into your global stylesheet. They contain a number of [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) (aka variables). Skeleton's core package and CSS import sets the default values for the [Tailwind @theme directive](https://tailwindcss.com/docs/functions-and-directives#theme-directive), while themes override the defined values using your active theme.

## Preset Themes

Skeleton ships with an an array of hand curated themes. Tap the themes below to preview it live.

<ThemeList />

```css
/* @import '@skeletonlabs/skeleton'; */
@import '@skeletonlabs/skeleton/themes/{theme-name}';
```

> Make sure to replace `{theme-name}` with your desired theme names. Set all lower-case, such as `cerberus`.

## Custom Themes

Use our powerful Theme Generator to create your own themes.

<figure class="linker bg-noise">
  <a href="https://themes.skeleton.dev/" target="_blank" class="btn preset-filled">
    Theme Generator
  </a>
</figure>

1. Open the Theme Generator and customize to your preference.
2. Make sure to set a unique name for your theme.
3. Tap the "code" view from the menu at top-right corner.
4. Tap the "copy" button just above the code block.
5. Paste the contents into a new file at your project root, such as `my-theme-name.css` (any name is fine).
6. Proceed below to learn how to register and activate each theme.

## Register Themes

You may register any number of themes by including multiple imports to your global stylesheet. Please note that each theme will slightly increase your project's CSS bundle size, so avoid including unused themes.

```css
/* @import '@skeletonlabs/skeleton'; */

/* Register Preset Themes */
@import '@skeletonlabs/skeleton/themes/cerberus';
@import '@skeletonlabs/skeleton/themes/mona';
@import '@skeletonlabs/skeleton/themes/vox';

/* Register a Custom Themes */
/* Make sure to resolve the relative path. */
/* Note the .css extension is optional. */
@import '../{my-theme-name}';
```

## Activate a Theme

You may define the active theme using the `data-theme` attribute on your `<html>` element.

```html
<html data-theme="cerberus">
	...
</html>
```

> TIP: If you wish to create a [theme switcher](/docs/guides/cookbook/dynamic-theming), this is the value you should aim to modify.

***

## Customize and Extend

### Modify Properties

You can modify any preset theme's [CSS custom properties](/docs/\[framework]/get-started/core-api) on demand using the following technique. Simply add this to your global stylesheet. For custom themes, modify each property directly in the theme file.

```css
[data-theme='cerberus'] {
	--spacing: 0.22rem;
	--radius-container: 0.375rem;
	--typo-heading--font-weight: bolder;
}
```

### Target Themes

If your application supports multiple themes, you may isolate selection using the `data-theme` attribute. Just make sure to account for light and dark mode color values using [Tailwind @variant directives](https://tailwindcss.com/docs/functions-and-directives#variant-directive).

```css title="app.css"
/** Target only Cerberus .h1 elements. */
[data-theme='cerberus'] .h1 {
	color: red;
	@variant dark {
		color: green;
	}
}
/** Target only Mona .h1 elements. */
[data-theme='mona'] .h1 {
	color: blue;
	@variant dark {
		color: yellow;
	}
}
```

### Backgrounds

Your app's light and dark mode background color values can be adjusted using the following [theme properties](/docs/\[framework]/get-started/core-api#colors).

```css
[data-theme='cerberus'] {
	--color-root-bg-light: pink;
	--color-root-bg-dark: green;
}
```

Background images are supported, including mesh gradients. The following example is shown using theme-specific colors.

```css
[data-theme='cerberus'] body {
	background-image:
		radial-gradient(at 24% 25%, color-mix(in oklab, var(--color-primary-500) 30%, transparent) 0px, transparent 30%),
		radial-gradient(at 35% 13%, color-mix(in oklab, var(--color-success-500) 18%, transparent) 0px, transparent 30%),
		radial-gradient(at 100% 64%, color-mix(in oklab, var(--color-error-500) 3%, transparent) 0px, transparent 40%);
	background-attachment: fixed;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
```

We recommend Mesher for generating custom mesh gradients. This will generate colors using an RGB color format, but can be migrated to utilize `var()` for colors and `color-mix()` for transparency, per the example above.

<figure class="linker bg-noise">
  <a class="btn preset-filled" href="https://csshero.org/mesher/" target="_blank">
    Mesher by CSS Hero
  </a>
</figure>

### Custom Fonts

Skeleton recommends the use of [Fontsource](https://fontsource.org/) for installing and managing custom fonts.

<figure class="linker bg-noise">
  <a class="btn preset-filled" href="https://fontsource.org/" target="_blank">
    Browse Fontsource
  </a>
</figure>

Install your font of choice.

```bash
npm install @fontsource/open-sans
```

Then import each font at the top of your global stylesheet, but below your Tailwind configuration.

```css
@import '@fontsource/open-sans';
```

Finally, use the following [theme properties](/docs/\[framework]/get-started/core-api#base-1) to set each respective font-family property. Note that for custom themes, these settings are can be defined directly within each respective theme file.

```css
[data-theme='cerberus'] {
	--typo-heading--font-family: 'Open Sans', sans-serif;
	--typo-base--font-family: 'Open Sans', sans-serif;
	--typo-anchor--font-family: 'inherit';
}
```

## Core API

For more information on theme properties, please refer to the [Core API](/docs/\[framework]/get-started/core-api) documentation.


---

# Colors

The Skeleton color system.

Skeleton provides guardrails and utilities to help you craft your custom color system. This includes a number of colors, shades, and contrast values that work together seamlessly, providing a visually appealing and accessible palette for each theme.

## Color Palette

<Default />

Supports <u>all</u> Tailwind color utility classes using the following pattern.

```txt
{property}-{color}-{shade}
```

\| Key      | Accepted Values                                                                                                  |
\| -------- | ---------------------------------------------------------------------------------------------------------------- |
\| Property | `accent`, `bg`, `border`, `caret`, `decoration`, `divide`, `fill`, `outline`, `ring`, `shadow`, `stroke`, `text` |
\| Color    | `primary`, `secondary`, `tertiary`, `success`, `warning`, `error`, `surface`                                     |
\| Shade    | `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950`                                       |

```html
<div class="bg-primary-500">...</div>
<div class="border border-secondary-600">...</div>
<svg class="fill-surface-950">...</svg>
```

***

## Contrast Colors

Test the following with different themes and dark mode combinations.

```astro
---
import { SwatchBookIcon } from 'lucide-react';
---

<section class="space-y-8">
	<div class="grid grid-cols-3 gap-6">
		<!-- Standard Colors -->
		<div class="flex flex-col space-y-2">
			<p class="text-xs">Direct Use</p>
			<div class="badge justify-start bg-primary-500 text-primary-contrast-500">
				<SwatchBookIcon className="size-4" />
				<span>Primary</span>
			</div>
			<div class="badge justify-start bg-secondary-500 text-secondary-contrast-500">
				<SwatchBookIcon className="size-4" />
				<span>Secondary</span>
			</div>
			<div class="badge justify-start bg-tertiary-500 text-tertiary-contrast-500">
				<SwatchBookIcon className="size-4" />
				<span>Tertiary</span>
			</div>
		</div>
		<!-- Presets -->
		<div class="flex flex-col space-y-2">
			<p class="text-xs">Presets</p>
			<div class="badge justify-start preset-filled-primary-950-50">
				<SwatchBookIcon className="size-4" />
				<span>Primary</span>
			</div>
			<div class="badge justify-start preset-filled-secondary-950-50">
				<SwatchBookIcon className="size-4" />
				<span>Secondary</span>
			</div>
			<div class="badge justify-start preset-filled-tertiary-950-50">
				<SwatchBookIcon className="size-4" />
				<span>Tertiary</span>
			</div>
		</div>
		<!-- Preset + Pairings -->
		<div class="flex flex-col space-y-2">
			<p class="text-xs">Preset + Pairings</p>
			<div class="badge justify-start preset-filled-primary-50-950">
				<SwatchBookIcon className="size-4" />
				<span>Primary</span>
			</div>
			<div class="badge justify-start preset-filled-secondary-50-950">
				<SwatchBookIcon className="size-4" />
				<span>Secondary</span>
			</div>
			<div class="badge justify-start preset-filled-tertiary-50-950">
				<SwatchBookIcon className="size-4" />
				<span>Tertiary</span>
			</div>
		</div>
	</div>
</section>

```

Contrast color values are available for every shade in the color ramp. Use these to set accessible text color and icon fill values. You may also refer to the [Preset system](/docs/\[framework]/tailwind-utilities/presets) for utility classes that automatically mix each color and contrast tone.

```txt
{property}-{color}-contrast-{shade}
```

***

## Color Pairings

<Pairings />

Provides a condensed syntax for dual-tone color values, evenly balanced to swap between light and dark mode. Pairings are supported for all Tailwind utility color classes (`bg`, `border`, `fill`, etc).

```txt
{property}-{color}-{lightModeShade}-{darkModeShade}
```

```html
<div class="bg-surface-200-800">...</div>
<div class="border border-secondary-400-600">...</div>
<svg class="fill-secondary-50-950">...</svg>
```

### How Pairings Work

Color Pairings are enabled through the use of the CSS [light-dark](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) function. This means instead of writing the standard light/dark syntax with Tailwind utilities:

```html
<div class="text-primary-300 dark:text-primary-700">...</div>
```

Skeleton provides utility classes that condense this into a single class:

```html
<div class="text-primary-300-700">...</div>
```

When implemented in your CSS bundle, this will be generated as follows:

```css
.text-primary-300-700 {
	color: light-dark(var(--color-primary-300), var(--color-primary-700));
}
```

The use of the CSS `light-dark()` function enables use of [Tailwind's Color Scheme](https://tailwindcss.com/docs/color-scheme) utilities. Refer to [Color Scheme](/docs/guides/mode#color-scheme) to learn how to use this within your Skeleton application.

### When to Use Pairings

Color Pairings are useful for generating a hierarchy of visual layers, ranging from foreground to background elements. Each reuse the same color ramp, but invert the order when switching from light to dark mode.

<PairingsStack />

* We can use shade `950` for light mode and `50` for dark mode to represent our body text color.
* Then use shade `50` for light mode and `950` for dark mode to represent our app background.
* Use the static `500` shade for key branding elements, such as buttons or banners.
* Then reserve multiple layers between for elements such as cards, inputs, and more.

***

## Brand Color

A variable accent color for your design system. Use this as the default color value when styling elements and components.

> TIP: The **Nouveau** theme makes use of variable brand color for light and dark modes.

```astro
---
import { SwatchBookIcon } from 'lucide-react';
---

<div class="w-full grid grid-cols-[1fr_auto_auto_auto] items-stretch gap-4">
	<div class="card p-4 text-center bg-brand-light dark:bg-brand-dark text-brand-contrast-light dark:text-brand-contrast-dark">
		<div class="flex justify-center items-center gap-2">
			<SwatchBookIcon className="size-4" />
			<span>Brand Color</span>
		</div>
	</div>
	<span class="vr"></span>
	<div class="card p-4 text-center bg-brand-light text-brand-contrast-light">Light</div>
	<div class="card p-4 text-center bg-brand-dark text-brand-contrast-dark">Dark</div>
</div>

```

### Benefits

* Brand utilizes any color from your theme palette (ex: primary/secondary/tertiary).
* Brand can use any shade from 50-950; it is not limited to shade 500.
* Brand color/shade can be tailored for light and dark mode independently.
* Brand includes a contrast color for foreground elements.
* Brand supports all standard [presets](/docs/svelte/tailwind-utilities/presets) (`preset-filled-brand`, `preset-outlined-brand`, `preset-tonal-brand`)

***

## Transparency

All available Skeleton Colors and Color Pairings support Tailwind's color transparency syntax.

```html
<div class="bg-primary-500/25">Primary Color @ 25% transparency</div>
<div class="bg-surface-50-950/60">Surface Pairing 50/950 @ 60% transparency</div>
```

***

## Core API

For more information on theme properties, please refer to the [Core API](/docs/\[framework]/get-started/core-api) documentation.


---

# Typography

The Skeleton typography system.

Skeleton provides an array of opt-in utility classes for common typographic elements, as well as a fully functional typography scale based on theme settings, with guidance on crafting a custom semantic typography set tailored for your project's individual needs.

## Global Styles

The default base typography styles are applied as [globals](/docs/design/globals).

## Native Element Styles

Skeleton provides the following utility classes for styling semantic native HTML elements. All styles are opt-in by default, providing an escape hatch when you need to break from convention.

### Headings

Represents six levels of section headings.

```astro
<div class="space-y-4">
	<h1 class="h1">Heading 1</h1>
	<h2 class="h2">Heading 2</h2>
	<h3 class="h3">Heading 3</h3>
	<h4 class="h4">Heading 4</h4>
	<h5 class="h5">Heading 5</h5>
	<h6 class="h6">Heading 6</h6>
</div>

```

### Paragraphs

Represents a block of running text.

```astro
<p>The quick brown fox jumps over the lazy dog</p>

```

### Anchor

Creates a hyperlink to other pages, files, or locations within the same page.

```astro
<a href="/" class="anchor">Anchor</a>

```

### Pre-Formatted

Displays preformatted text exactly as written, preserving whitespace and line breaks.

```astro
<pre class="pre">The quick brown fox jumps over the lazy dog.</pre>

```

### Code

Displays an inline fragment of computer code. Provides support for [Presets](/docs/\[framework]/tailwind-utilities/presets).

```astro
<div class="space-y-4">
	<p>Use <code class="code">.code</code> to highlight partials.</p>
	<hr class="hr" />
	<p>Use <code class="code preset-filled-primary-500">.code</code> to highlight partials.</p>
	<p>Use <code class="code preset-filled-secondary-500">.code</code> to highlight partials.</p>
	<p>Use <code class="code preset-filled-tertiary-500">.code</code> to highlight partials.</p>
</div>

```

### Keyboard

Represents textual user input from a keyboard, voice, or other input device.

```astro
<div class="flex flex-col items-center gap-4">
	<div>Press <kbd class="kbd">⌘</kbd> + <kbd class="kbd">c</kbd> to copy.</div>

	<hr class="hr" />

	<div class="space-y-1">
		<div class="flex w-full justify-center gap-1">
			<kbd class="kbd">q</kbd>
			<kbd class="kbd">w</kbd>
			<kbd class="kbd">e</kbd>
			<kbd class="kbd">r</kbd>
			<kbd class="kbd">t</kbd>
			<kbd class="kbd">y</kbd>
			<kbd class="kbd">u</kbd>
			<kbd class="kbd">i</kbd>
			<kbd class="kbd">o</kbd>
			<kbd class="kbd">p</kbd>
		</div>
		<div class="flex w-full justify-center gap-1">
			<kbd class="kbd">a</kbd>
			<kbd class="kbd">s</kbd>
			<kbd class="kbd">d</kbd>
			<kbd class="kbd">f</kbd>
			<kbd class="kbd">g</kbd>
			<kbd class="kbd">h</kbd>
			<kbd class="kbd">j</kbd>
			<kbd class="kbd">k</kbd>
			<kbd class="kbd">l</kbd>
		</div>
		<div class="flex w-full justify-center gap-1">
			<kbd class="kbd">z</kbd>
			<kbd class="kbd">x</kbd>
			<kbd class="kbd">c</kbd>
			<kbd class="kbd">v</kbd>
			<kbd class="kbd">b</kbd>
			<kbd class="kbd">n</kbd>
			<kbd class="kbd">m</kbd>
		</div>
	</div>
</div>

```

### Insert & Delete

Marks text that has been added to or removed from a document.

```astro
<div class="w-full">
	<del class="del"><s>Always</s> Gonna Give You Up</del>
	<ins class="ins" cite="https://youtu.be/dQw4w9WgXcQ" datetime="10-31-2022"> Never Gonna Give You Up </ins>
</div>

```

### Abbreviation

Represents an abbreviation or acronym, optionally paired with its full expansion.

```astro
<p>
	The <abbr class="abbr" title="HyperText Markup Language">HTML</abbr> standard is maintained by the
	<abbr class="abbr" title="World Wide Web Consortium">W3C</abbr>.
</p>

```

### Blockquotes

Indicates an extended quotation set apart from surrounding content.

```astro
<blockquote class="blockquote">
	<p>
		"The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of
		the heart, you'll know when you find it. And, like any great relationship, it just gets better and better as the years roll on."
	</p>
	<cite class="cite">&mdash; Steve Jobs</cite>
</blockquote>

```

### Citation

References the title of a creative work, such as a book, article, or film.

```astro
<p>
	One of the most influential novels of the 20th century is
	<cite class="cite"><a class="anchor" href="https://en.wikipedia.org/wiki/The_Great_Gatsby">The Great Gatsby</a></cite>
	by F. Scott Fitzgerald, often studied alongside <cite class="cite">To Kill a Mockingbird</cite>.
</p>

```

### Mark

Highlights text of relevance or importance within the surrounding context.

```astro
<p>
	The quick brown <mark class="mark">fox</mark> jumps over the lazy <mark class="mark">dog</mark>.
</p>

```

### Quotation

Represents a short inline quotation.

```astro
<p>The lead said, <q class="quote">we ship when ready</q>.</p>

```

### Subscript

Renders text in subscript, typically lowered and reduced in size.

```astro
<p>The chemical formula for water is H<sub class="sub">2</sub>O, and table salt is Na<sub class="sub">1</sub>Cl<sub class="sub">1</sub>.</p>

```

### Superscript

Renders text in superscript, typically raised and reduced in size.

```astro
<p>
	Einstein's mass-energy equivalence is expressed as E = mc<sup class="sup">2</sup>, and the area of a circle is &pi;r<sup class="sup"
		>2</sup
	>.
</p>

```

### Time

Represents a specific period in time or a machine-readable date.

```astro
<p>
	Apollo 11 landed on the Moon on <time class="time" datetime="1969-07-20">July 20, 1969</time>.
</p>

```

### Lists

Represents ordered and unordered lists of items. Skeleton defers to Tailwind's built-in utility classes for common list styles.

```astro
<div class="w-full space-y-4">
	<!-- Basic List -->
	<section class="space-y-4">
		<p class="text-lg font-bold">Basic List</p>
		<ul class="list-inside list-none space-y-2">
			<li>Skeleton is an adaptive design system powered by the Tailwind CSS framework.</li>
			<li>Compatible with Svelte, React, Astro, and many other popular frameworks.</li>
			<li>Theming is driven by CSS custom properties for quick color customization.</li>
		</ul>
	</section>

	<hr class="hr" />

	<!-- Unordered List -->
	<section class="space-y-4">
		<p class="text-lg font-bold">Unordered List</p>
		<ul class="list-inside list-disc space-y-2">
			<li>Skeleton is an adaptive design system powered by the Tailwind CSS framework.</li>
			<li>Compatible with Svelte, React, Astro, and many other popular frameworks.</li>
			<li>Theming is driven by CSS custom properties for quick color customization.</li>
		</ul>
	</section>

	<hr class="hr" />

	<!-- Ordered List -->
	<section class="space-y-4">
		<p class="text-lg font-bold">Ordered List</p>
		<ol class="list-inside list-decimal space-y-2">
			<li>Skeleton is an adaptive design system powered by the Tailwind CSS framework.</li>
			<li>Compatible with Svelte, React, Astro, and many other popular frameworks.</li>
			<li>Theming is driven by CSS custom properties for quick color customization.</li>
		</ol>
	</section>

	<hr class="hr" />

	<!-- Description List -->
	<section class="space-y-4">
		<p class="text-lg font-bold">Description List</p>
		<dl class="space-y-2">
			<div>
				<dt class="font-bold">Item A</dt>
				<dd class="opacity-60">Skeleton is an adaptive design system powered by the Tailwind CSS framework.</dd>
			</div>
			<div>
				<dt class="font-bold">Item B</dt>
				<dd class="opacity-60">Compatible with Svelte, React, Astro, and many other popular frameworks.</dd>
			</div>
			<div>
				<dt class="font-bold">Item C</dt>
				<dd class="opacity-60">Theming is driven by CSS custom properties for quick color customization.</dd>
			</div>
		</dl>
	</section>

	<hr class="hr" />

	<!-- Navigation List -->
	<nav class="space-y-2">
		<!-- Optional Heading -->
		<p class="text-lg font-bold">Navigation List</p>
		<!-- / -->
		<ul class="space-y-2">
			<li>
				<a class="anchor" href="#">Home</a>
			</li>
			<li>
				<a class="anchor" href="#">About</a>
			</li>
			<li>
				<a class="anchor" href="#">Blog</a>
			</li>
		</ul>
	</nav>
</div>

```

## Advanced Features

The following features are optional and intended for professionals with moderate understanding of web-based typography. If you're unfamiliar with these concepts, feel free to skip them and use the friendly defaults Skeleton provides out of the box.

### Typographic Scale

Skeleton augments [Tailwind's font-size](https://tailwindcss.com/docs/font-size) utilities to support a customizable [Typographic Scale](https://designcode.io/typographic-scales). Put simply, by modifying your theme's `--text-scaling` property, you can control the overall scale of text sizing globally throughout your application. See the [Core API](/docs/get-started/core-api#typography) to review the scaling formula.

<Preview client:visible>
  <Typescale client:visible />
</Preview>

> TIP: the base scale size is `1.0` for `100%`

### Semantic Typography

When working with a designer, they may craft a semantic set of typography for your project. These might include semantic names, canned sizes, and pre-configured styling. To handle this in Skeleton, we recommend following best practices for [User Generated Presets](/docs/\[framework]/tailwind-utilities/presets#user-generated), while mixing CSS primitives with semantic HTML elements to replicate all required styles.

We've provided a boilerplate below to help you get started. Implement in your global stylesheet, and customize as needed.

```svelte
<div class="table-wrap">
	<table class="table">
		<thead>
			<tr>
				<th>Class</th>
				<th>Preview</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code class="code">preset-typo-display-4</code></td>
				<td><h1 class="preset-typo-display-4">Aa</h1></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-display-3</code></td>
				<td><h2 class="preset-typo-display-3">Aa</h2></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-display-2</code></td>
				<td><h3 class="preset-typo-display-2">Aa</h3></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-display-1</code></td>
				<td><h4 class="preset-typo-display-1">Aa</h4></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-headline</code></td>
				<td><p class="preset-typo-headline">Headline</p></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-title</code></td>
				<td><p class="preset-typo-title">Title</p></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-subtitle</code></td>
				<td><p class="preset-typo-subtitle">Subtitle</p></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-body-1</code></td>
				<td>
					<p class="preset-typo-body-1">Body 1</p>
				</td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-body-2</code></td>
				<td>
					<p class="preset-typo-body-2">Body 2</p>
				</td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-caption</code></td>
				<td><span class="preset-typo-caption">Caption</span></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-menu</code></td>
				<td><span class="preset-typo-menu">Menu</span></td>
			</tr>
			<!-- --- -->
			<tr>
				<td><code class="code">preset-typo-button</code></td>
				<td><span class="preset-typo-button">Button</span></td>
			</tr>
		</tbody>
	</table>
</div>

<style>
	/* IGNORE THIS: this is only required for our example <style> block. */
	/* https://tailwindcss.com/docs/functions-and-directives#reference-directive */
	@reference "../../../../app.css";

	/*
		In a real world project, copy the following into your global stylesheet.
		Then rename, adjust the styles, and otherwise modify as desired.

		For a quick reference for these theme variables, see the Core API:
		http://skeleton.dev/docs/get-started/core-api#typography
	*/

	/* Headings */
	.preset-typo-display-4,
	.preset-typo-display-3,
	.preset-typo-display-2,
	.preset-typo-display-1,
	.preset-typo-headline,
	.preset-typo-title,
	.preset-typo-subtitle,
	.preset-typo-caption,
	.preset-typo-menu,
	.preset-typo-button {
		color: var(--typo-heading--color-light);
		font-family: var(--typo-heading--font-family);
		font-weight: var(--typo-heading--font-weight);
		@variant dark {
			color: var(--typo-heading--color-dark);
		}
	}

	/* Body */
	.preset-typo-body-1,
	.preset-typo-body-2,
	.preset-typo-caption,
	.preset-typo-menu,
	.preset-typo-button {
		color: var(--typo-heading--color-light);
		@variant dark {
			color: var(--typo-heading--color-dark);
		}
	}

	/* Unique Properties */
	.preset-typo-display-4 {
		font-size: var(--text-7xl);
		@variant lg {
			font-size: var(--text-9xl);
		}
	}
	.preset-typo-display-3 {
		font-size: var(--text-6xl);
		@variant lg {
			font-size: var(--text-8xl);
		}
	}
	.preset-typo-display-2 {
		font-size: var(--text-5xl);
		@variant lg {
			font-size: var(--text-7xl);
		}
	}
	.preset-typo-display-1 {
		font-size: var(--text-4xl);
		@variant lg {
			font-size: var(--text-6xl);
		}
	}
	.preset-typo-headline {
		font-size: var(--text-2xl);
		@variant lg {
			font-size: var(--text-4xl);
		}
	}
	.preset-typo-title {
		font-size: var(--text-xl);
		@variant lg {
			font-size: var(--text-3xl);
		}
	}
	.preset-typo-subtitle {
		font-size: var(--text-base);
		font-family: var(--typo-heading--font-family);
		color: var(--color-surface-700-300);
		@variant lg {
			font-size: var(--text-xl);
		}
	}
	.preset-typo-body-1 {
		font-size: var(--text-xl);
		@variant lg {
			font-size: var(--text-3xl);
		}
	}
	.preset-typo-body-2 {
		font-size: var(--text-lg);
		@variant lg {
			font-size: var(--text-xl);
		}
	}
	.preset-typo-caption {
		font-size: var(--text-sm);
		color: var(--color-surface-700-300);
	}
	.preset-typo-menu {
		font-weight: bold;
	}
	.preset-typo-button {
		font-weight: bold;
	}
</style>

```

## Core API

For more information on theme properties, please refer to the [Core API](/docs/\[framework]/get-started/core-api) documentation.


---

# Presets

Canned styles for your interface elements.

Presets are pre-defined utility classes that allow you to quickly and easily style buttons, badges, cards, and more. They are implemented using a combination of Skeleton and Tailwind primitives. A number of presets are available out of the box, with guidelines provided for crafting your own.

## Skeleton Presets

The following Presets are available to you when using Skeleton. Each comes with a shorthand neutral option.

```astro
---
const diagramCircle = 'preset-tonal w-8 aspect-square flex justify-center items-center rounded-full';
---

<div class="grid grid-cols-3 gap-10">
	<!-- Preset: Filled -->
	<div class="flex flex-col items-center gap-4">
		<button type="button" class="btn preset-filled-brand">Filled</button>
		<div class={diagramCircle}>1</div>
	</div>
	<!-- Preset: Tonal -->
	<div class="flex flex-col items-center gap-4">
		<button type="button" class="btn preset-tonal-brand">Tonal</button>
		<div class={diagramCircle}>2</div>
	</div>
	<!-- Preset: Outlined -->
	<div class="flex flex-col items-center gap-4">
		<button type="button" class="btn preset-outlined-brand">Outlined</button>
		<div class={diagramCircle}>3</div>
	</div>
</div>

```

1. **Filled** - a filled preset of the primary brand color.
2. **Tonal** - a tonal preset of the primary brand color.
3. **Outlined** - an outlined preset of the primary brand color.

### Filled

Has a wide variety of use cases and automatically implements [color pairings](/docs/design/colors#color-pairings) and [contrast colors](/docs/design/colors#contrast-colors) automatically.

```txt
preset-filled
preset-filled-{color}-{lightModeShade}-{darkModeShade}
```

```astro
<div class="w-full space-y-2">
	<div class="grid grid-cols-2 gap-2">
		{/* Neutral */}
		<div class="card p-2 text-center preset-filled">(neutral)</div>
		{/* Brand */}
		<div class="card p-2 text-center preset-filled-brand">Brand</div>
	</div>

	<hr class="hr" />

	{/* Color Pairings */}
	<div class="grid grid-cols1 md:grid-cols-3 2xl:grid-cols-7 gap-2">
		<div class="space-y-2">
			<div class="card p-2 text-center preset-filled-primary-950-50">950-50</div>
			<div class="card p-2 text-center preset-filled-primary-900-100">900-100</div>
			<div class="card p-2 text-center preset-filled-primary-800-200">800-200</div>
			<div class="card p-2 text-center preset-filled-primary-700-300">700-300</div>
			<div class="card p-2 text-center preset-filled-primary-600-400">600-400</div>
			<div class="card p-2 text-center preset-filled-primary-500">500</div>
			<div class="card p-2 text-center preset-filled-primary-400-600">400-600</div>
			<div class="card p-2 text-center preset-filled-primary-300-700">300-700</div>
			<div class="card p-2 text-center preset-filled-primary-200-800">200-800</div>
			<div class="card p-2 text-center preset-filled-primary-100-900">100-900</div>
			<div class="card p-2 text-center preset-filled-primary-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-filled-secondary-950-50">950-50</div>
			<div class="card p-2 text-center preset-filled-secondary-900-100">900-100</div>
			<div class="card p-2 text-center preset-filled-secondary-800-200">800-200</div>
			<div class="card p-2 text-center preset-filled-secondary-700-300">700-300</div>
			<div class="card p-2 text-center preset-filled-secondary-600-400">600-400</div>
			<div class="card p-2 text-center preset-filled-secondary-500">500</div>
			<div class="card p-2 text-center preset-filled-secondary-400-600">400-600</div>
			<div class="card p-2 text-center preset-filled-secondary-300-700">300-700</div>
			<div class="card p-2 text-center preset-filled-secondary-200-800">200-800</div>
			<div class="card p-2 text-center preset-filled-secondary-100-900">100-900</div>
			<div class="card p-2 text-center preset-filled-secondary-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-filled-tertiary-950-50">950-50</div>
			<div class="card p-2 text-center preset-filled-tertiary-900-100">900-100</div>
			<div class="card p-2 text-center preset-filled-tertiary-800-200">800-200</div>
			<div class="card p-2 text-center preset-filled-tertiary-700-300">700-300</div>
			<div class="card p-2 text-center preset-filled-tertiary-600-400">600-400</div>
			<div class="card p-2 text-center preset-filled-tertiary-500">500</div>
			<div class="card p-2 text-center preset-filled-tertiary-400-600">400-600</div>
			<div class="card p-2 text-center preset-filled-tertiary-300-700">300-700</div>
			<div class="card p-2 text-center preset-filled-tertiary-200-800">200-800</div>
			<div class="card p-2 text-center preset-filled-tertiary-100-900">100-900</div>
			<div class="card p-2 text-center preset-filled-tertiary-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-filled-success-950-50">950-50</div>
			<div class="card p-2 text-center preset-filled-success-900-100">900-100</div>
			<div class="card p-2 text-center preset-filled-success-800-200">800-200</div>
			<div class="card p-2 text-center preset-filled-success-700-300">700-300</div>
			<div class="card p-2 text-center preset-filled-success-600-400">600-400</div>
			<div class="card p-2 text-center preset-filled-success-500">500</div>
			<div class="card p-2 text-center preset-filled-success-400-600">400-600</div>
			<div class="card p-2 text-center preset-filled-success-300-700">300-700</div>
			<div class="card p-2 text-center preset-filled-success-200-800">200-800</div>
			<div class="card p-2 text-center preset-filled-success-100-900">100-900</div>
			<div class="card p-2 text-center preset-filled-success-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-filled-warning-950-50">950-50</div>
			<div class="card p-2 text-center preset-filled-warning-900-100">900-100</div>
			<div class="card p-2 text-center preset-filled-warning-800-200">800-200</div>
			<div class="card p-2 text-center preset-filled-warning-700-300">700-300</div>
			<div class="card p-2 text-center preset-filled-warning-600-400">600-400</div>
			<div class="card p-2 text-center preset-filled-warning-500">500</div>
			<div class="card p-2 text-center preset-filled-warning-400-600">400-600</div>
			<div class="card p-2 text-center preset-filled-warning-300-700">300-700</div>
			<div class="card p-2 text-center preset-filled-warning-200-800">200-800</div>
			<div class="card p-2 text-center preset-filled-warning-100-900">100-900</div>
			<div class="card p-2 text-center preset-filled-warning-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-filled-error-950-50">950-50</div>
			<div class="card p-2 text-center preset-filled-error-900-100">900-100</div>
			<div class="card p-2 text-center preset-filled-error-800-200">800-200</div>
			<div class="card p-2 text-center preset-filled-error-700-300">700-300</div>
			<div class="card p-2 text-center preset-filled-error-600-400">600-400</div>
			<div class="card p-2 text-center preset-filled-error-500">500</div>
			<div class="card p-2 text-center preset-filled-error-400-600">400-600</div>
			<div class="card p-2 text-center preset-filled-error-300-700">300-700</div>
			<div class="card p-2 text-center preset-filled-error-200-800">200-800</div>
			<div class="card p-2 text-center preset-filled-error-100-900">100-900</div>
			<div class="card p-2 text-center preset-filled-error-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-filled-surface-950-50">950-50</div>
			<div class="card p-2 text-center preset-filled-surface-900-100">900-100</div>
			<div class="card p-2 text-center preset-filled-surface-800-200">800-200</div>
			<div class="card p-2 text-center preset-filled-surface-700-300">700-300</div>
			<div class="card p-2 text-center preset-filled-surface-600-400">600-400</div>
			<div class="card p-2 text-center preset-filled-surface-500">500</div>
			<div class="card p-2 text-center preset-filled-surface-400-600">400-600</div>
			<div class="card p-2 text-center preset-filled-surface-300-700">300-700</div>
			<div class="card p-2 text-center preset-filled-surface-200-800">200-800</div>
			<div class="card p-2 text-center preset-filled-surface-100-900">100-900</div>
			<div class="card p-2 text-center preset-filled-surface-50-950">50-950</div>
		</div>
	</div>
</div>

```

### Tonal

Ideal for alerts and axillary buttons and actions.

```txt
preset-tonal
preset-tonal-{color}
```

```astro
<div class="w-full space-y-2">
	<div class="grid grid-cols-2 gap-2">
		{/* Neutral */}
		<div class="card p-2 text-center preset-tonal">(neutral)</div>
		{/* Brand */}
		<div class="card p-2 text-center preset-tonal-brand">Brand</div>
	</div>

	<hr class="hr" />

	{/* Color Pairings */}
	<div class="grid grid-cols1 md:grid-cols-3 2xl:grid-cols-7 gap-2">
		<div class="card p-2 text-center preset-tonal-primary">primary</div>
		<div class="card p-2 text-center preset-tonal-secondary">secondary</div>
		<div class="card p-2 text-center preset-tonal-tertiary">tertiary</div>
		<div class="card p-2 text-center preset-tonal-success">success</div>
		<div class="card p-2 text-center preset-tonal-warning">warning</div>
		<div class="card p-2 text-center preset-tonal-error">error</div>
		<div class="card p-2 text-center preset-tonal-surface">surface</div>
	</div>
</div>

```

### Outlined

Ideal when for minimal interfaces, such as a surrounding card.

```txt
preset-outlined
preset-outlined-{color}-{shade}-{shade}
```

```astro
<div class="w-full space-y-2">
	<div class="grid grid-cols-2 gap-2">
		{/* Neutral */}
		<div class="card p-2 text-center preset-outlined">(neutral)</div>
		{/* Brand */}
		<div class="card p-2 text-center preset-outlined-brand">Brand</div>
	</div>

	<hr class="hr" />

	{/* Color Pairings */}
	<div class="grid grid-cols1 md:grid-cols-3 2xl:grid-cols-7 gap-2">
		<div class="space-y-2">
			<div class="card p-2 text-center preset-outlined-primary-950-50">950-50</div>
			<div class="card p-2 text-center preset-outlined-primary-900-100">900-100</div>
			<div class="card p-2 text-center preset-outlined-primary-800-200">800-200</div>
			<div class="card p-2 text-center preset-outlined-primary-700-300">700-300</div>
			<div class="card p-2 text-center preset-outlined-primary-600-400">600-400</div>
			<div class="card p-2 text-center preset-outlined-primary-500">500</div>
			<div class="card p-2 text-center preset-outlined-primary-400-600">400-600</div>
			<div class="card p-2 text-center preset-outlined-primary-300-700">300-700</div>
			<div class="card p-2 text-center preset-outlined-primary-200-800">200-800</div>
			<div class="card p-2 text-center preset-outlined-primary-100-900">100-900</div>
			<div class="card p-2 text-center preset-outlined-primary-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-outlined-secondary-950-50">950-50</div>
			<div class="card p-2 text-center preset-outlined-secondary-900-100">900-100</div>
			<div class="card p-2 text-center preset-outlined-secondary-800-200">800-200</div>
			<div class="card p-2 text-center preset-outlined-secondary-700-300">700-300</div>
			<div class="card p-2 text-center preset-outlined-secondary-600-400">600-400</div>
			<div class="card p-2 text-center preset-outlined-secondary-500">500</div>
			<div class="card p-2 text-center preset-outlined-secondary-400-600">400-600</div>
			<div class="card p-2 text-center preset-outlined-secondary-300-700">300-700</div>
			<div class="card p-2 text-center preset-outlined-secondary-200-800">200-800</div>
			<div class="card p-2 text-center preset-outlined-secondary-100-900">100-900</div>
			<div class="card p-2 text-center preset-outlined-secondary-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-outlined-tertiary-950-50">950-50</div>
			<div class="card p-2 text-center preset-outlined-tertiary-900-100">900-100</div>
			<div class="card p-2 text-center preset-outlined-tertiary-800-200">800-200</div>
			<div class="card p-2 text-center preset-outlined-tertiary-700-300">700-300</div>
			<div class="card p-2 text-center preset-outlined-tertiary-600-400">600-400</div>
			<div class="card p-2 text-center preset-outlined-tertiary-500">500</div>
			<div class="card p-2 text-center preset-outlined-tertiary-400-600">400-600</div>
			<div class="card p-2 text-center preset-outlined-tertiary-300-700">300-700</div>
			<div class="card p-2 text-center preset-outlined-tertiary-200-800">200-800</div>
			<div class="card p-2 text-center preset-outlined-tertiary-100-900">100-900</div>
			<div class="card p-2 text-center preset-outlined-tertiary-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-outlined-success-950-50">950-50</div>
			<div class="card p-2 text-center preset-outlined-success-900-100">900-100</div>
			<div class="card p-2 text-center preset-outlined-success-800-200">800-200</div>
			<div class="card p-2 text-center preset-outlined-success-700-300">700-300</div>
			<div class="card p-2 text-center preset-outlined-success-600-400">600-400</div>
			<div class="card p-2 text-center preset-outlined-success-500">500</div>
			<div class="card p-2 text-center preset-outlined-success-400-600">400-600</div>
			<div class="card p-2 text-center preset-outlined-success-300-700">300-700</div>
			<div class="card p-2 text-center preset-outlined-success-200-800">200-800</div>
			<div class="card p-2 text-center preset-outlined-success-100-900">100-900</div>
			<div class="card p-2 text-center preset-outlined-success-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-outlined-warning-950-50">950-50</div>
			<div class="card p-2 text-center preset-outlined-warning-900-100">900-100</div>
			<div class="card p-2 text-center preset-outlined-warning-800-200">800-200</div>
			<div class="card p-2 text-center preset-outlined-warning-700-300">700-300</div>
			<div class="card p-2 text-center preset-outlined-warning-600-400">600-400</div>
			<div class="card p-2 text-center preset-outlined-warning-500">500</div>
			<div class="card p-2 text-center preset-outlined-warning-400-600">400-600</div>
			<div class="card p-2 text-center preset-outlined-warning-300-700">300-700</div>
			<div class="card p-2 text-center preset-outlined-warning-200-800">200-800</div>
			<div class="card p-2 text-center preset-outlined-warning-100-900">100-900</div>
			<div class="card p-2 text-center preset-outlined-warning-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-outlined-error-950-50">950-50</div>
			<div class="card p-2 text-center preset-outlined-error-900-100">900-100</div>
			<div class="card p-2 text-center preset-outlined-error-800-200">800-200</div>
			<div class="card p-2 text-center preset-outlined-error-700-300">700-300</div>
			<div class="card p-2 text-center preset-outlined-error-600-400">600-400</div>
			<div class="card p-2 text-center preset-outlined-error-500">500</div>
			<div class="card p-2 text-center preset-outlined-error-400-600">400-600</div>
			<div class="card p-2 text-center preset-outlined-error-300-700">300-700</div>
			<div class="card p-2 text-center preset-outlined-error-200-800">200-800</div>
			<div class="card p-2 text-center preset-outlined-error-100-900">100-900</div>
			<div class="card p-2 text-center preset-outlined-error-50-950">50-950</div>
		</div>
		<div class="space-y-2">
			<div class="card p-2 text-center preset-outlined-surface-950-50">950-50</div>
			<div class="card p-2 text-center preset-outlined-surface-900-100">900-100</div>
			<div class="card p-2 text-center preset-outlined-surface-800-200">800-200</div>
			<div class="card p-2 text-center preset-outlined-surface-700-300">700-300</div>
			<div class="card p-2 text-center preset-outlined-surface-600-400">600-400</div>
			<div class="card p-2 text-center preset-outlined-surface-500">500</div>
			<div class="card p-2 text-center preset-outlined-surface-400-600">400-600</div>
			<div class="card p-2 text-center preset-outlined-surface-300-700">300-700</div>
			<div class="card p-2 text-center preset-outlined-surface-200-800">200-800</div>
			<div class="card p-2 text-center preset-outlined-surface-100-900">100-900</div>
			<div class="card p-2 text-center preset-outlined-surface-50-950">50-950</div>
		</div>
	</div>
</div>

```

***

## User Generated

In a nutshell, Presets are a resuable combination of styles that mix Skeleton and Tailwind primitives. This means you can create as many combinations as you wish to help control the aesthetic of your application. All custom presets should be implemented in your application's global stylesheet. See our reference examples below.

```astro
---
const presets = [
	{
		label: 'Glass',
		class: 'preset-glass-brand',
	},
	{
		label: 'Elevated',
		class: 'preset-filled-surface-100-900 shadow-xl',
	},
	{
		label: 'Ghost',
		class: 'hover:preset-tonal',
	},
	{
		label: 'Gradient',
		class: 'preset-gradient-secondary-primary',
	},
];
const cell = 'flex flex-col items-center gap-4';
const diagramCircle = 'preset-tonal w-8 aspect-square flex justify-center items-center rounded-full';
---

<div class="grid grid-cols-2 md:grid-cols-4 gap-10">
	{
		presets.map((preset, index) => (
			<div class={cell}>
				<button type="button" class={`btn ${preset.class}`}>
					{preset.label}
				</button>
				<div class={diagramCircle}>{index + 1}</div>
			</div>
		))
	}
</div>

<style>
	/* TIP: In a real world project you would implement the following in your global stylesheet. */
	.preset-gradient-secondary-primary {
		background-image: linear-gradient(-45deg, var(--color-secondary-500), var(--color-primary-500));
		color: var(--color-primary-contrast-500);
	}
	.preset-glass-brand {
		background: color-mix(in oklab, light-dark(var(--color-brand-light), var(--color-brand-dark)) 40%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, light-dark(var(--color-brand-light), var(--color-brand-dark)) 50%, transparent) inset;
		backdrop-filter: blur(16px);
	}
</style>

```

1. **Glass** - a custom preset using background transparency and backdrop blur.
2. **Elevated** - mixes a filled preset with a shadow.
3. **Ghost** - has no style by default, but shows a tonal preset on hover.
4. **Gradient** - a custom preset generated using Tailwind gradient primitives.

### Examples

#### Input Presets

Use Presets to generate your own custom validation classes for inputs.

```astro
<div class="w-full max-w-[320px] grid grid-rows-3 gap-4">
	<input type="text" class="input" value="Default Input State!" />
	<input type="text" class="input preset-input-success" value="Valid Input State!" />
	<input type="text" class="input preset-input-error" value="Invalid Input State!" />
</div>

<style>
	/* Add each custom preset to your global stylesheet. */
	.preset-input-success {
		background-color: var(--color-success-100);
		color: var(--color-success-900);
	}
	.preset-input-error {
		background-color: var(--color-error-100);
		color: var(--color-error-900);
	}
</style>

```

#### Gradient Presets

Utilize [Tailwind Gradient](https://tailwindcss.com/docs/gradient-color-stops) utility classes to create fancy buttons or cards.

```astro
<div class="w-full space-y-4">
	<div class="grid grid-cols-3 gap-4">
		<button class="btn preset-gradient-one">Button</button>
		<button class="btn preset-gradient-two">Button</button>
		<button class="btn preset-gradient-three">Button</button>
	</div>
	<div class="grid grid-cols-3 gap-4 text-center">
		<div class="card p-4 preset-gradient-one">Card</div>
		<div class="card p-4 preset-gradient-two">Card</div>
		<div class="card p-4 preset-gradient-three">Card</div>
	</div>
</div>

<style>
	/* Create a custom preset in your global stylesheet */
	.preset-gradient-one {
		background-image: linear-gradient(45deg, var(--color-primary-500), var(--color-tertiary-500));
		color: var(--color-primary-contrast-500);
	}
	.preset-gradient-two {
		background-image: linear-gradient(45deg, var(--color-error-500), var(--color-warning-500));
		color: var(--color-error-contrast-500);
	}
	.preset-gradient-three {
		background-image: linear-gradient(45deg, var(--color-success-500), var(--color-warning-500));
		color: var(--color-success-contrast-500);
	}
</style>

```

#### Glass Presets

Fine tune your Presets with special effects, such as the [Tailwind Backdrop Blur](https://tailwindcss.com/docs/backdrop-filter-blur) for a glass-like effect.

```astro
---
const baseClasses = 'card p-4 text-white text-center flex justify-start items-center';
---

<div
	class="w-full space-y-4 bg-[url(https://picsum.photos/id/249/1024/1024)] bg-center bg-no-repeat bg-cover rounded-container flex justify-center items-center p-4"
>
	<div class="w-full grid grid-cols-1 gap-2">
		<div class:list={`${baseClasses} preset-glass-neutral`}>Neutral</div>
		<div class:list={`${baseClasses} preset-glass-brand`}>Brand</div>
		<hr class="hr" />
		<div class:list={`${baseClasses} preset-glass-primary`}>Primary</div>
		<div class:list={`${baseClasses} preset-glass-secondary`}>Secondary</div>
		<div class:list={`${baseClasses} preset-glass-tertiary`}>Tertiary</div>
		<div class:list={`${baseClasses} preset-glass-success`}>Success</div>
		<div class:list={`${baseClasses} preset-glass-warning`}>Warning</div>
		<div class:list={`${baseClasses} preset-glass-error`}>Error</div>
		<div class:list={`${baseClasses} preset-glass-surface`}>Surface</div>
	</div>
</div>

<style>
	/* Create a custom preset in your global stylesheet */
	.preset-glass-neutral {
		background: color-mix(in oklab, var(--color-surface-50-950) 30%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, var(--color-surface-50-950) 30%, transparent) inset;
		backdrop-filter: blur(16px);
	}
	.preset-glass-brand {
		background: color-mix(in oklab, light-dark(var(--color-brand-light), var(--color-brand-dark)) 30%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, light-dark(var(--color-brand-light), var(--color-brand-dark)) 30%, transparent) inset;
		backdrop-filter: blur(16px);
	}
	.preset-glass-primary {
		background: color-mix(in oklab, var(--color-primary-500) 40%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, var(--color-primary-500) 50%, transparent) inset;
		backdrop-filter: blur(16px);
	}
	.preset-glass-secondary {
		background: color-mix(in oklab, var(--color-secondary-500) 40%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, var(--color-secondary-500) 50%, transparent) inset;
		backdrop-filter: blur(16px);
	}
	.preset-glass-tertiary {
		background: color-mix(in oklab, var(--color-tertiary-500) 40%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, var(--color-tertiary-500) 50%, transparent) inset;
		backdrop-filter: blur(16px);
	}
	.preset-glass-success {
		background: color-mix(in oklab, var(--color-success-500) 40%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, var(--color-success-500) 50%, transparent) inset;
		backdrop-filter: blur(16px);
	}
	.preset-glass-warning {
		background: color-mix(in oklab, var(--color-warning-500) 40%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, var(--color-warning-500) 50%, transparent) inset;
		backdrop-filter: blur(16px);
	}
	.preset-glass-error {
		background: color-mix(in oklab, var(--color-error-500) 40%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, var(--color-error-500) 50%, transparent) inset;
		backdrop-filter: blur(16px);
	}
	.preset-glass-surface {
		background: color-mix(in oklab, var(--color-surface-500) 40%, transparent);
		box-shadow: 0 0px 30px color-mix(in oklab, var(--color-surface-500) 50%, transparent) inset;
		backdrop-filter: blur(16px);
	}
</style>

```

### Guidelines

* When creating custom Presets, you're only limited by your imagination.
* Use any combination of Skeleton or Tailwind primitives to generate a Preset.
* Apply Presets to any relevant element, including: buttons, badges, chips, cards, inputs, and more.
* Use a set naming convention, such as `preset-{foo}-{bar}` to keep things standardized.
* Consider implementing Presets using Tailwind's [@utility directive](https://tailwindcss.com/docs/functions-and-directives#utility-directive) in your stylesheet.
* Abstrast Presets to a stylesheet or NPM package for shared used between projects.
* Use Presets to apply styling for your components via the `class` attribute.

## Tailwind Components


---

