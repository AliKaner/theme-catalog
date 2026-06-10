# theme-catalog-kit

> Pick a preset palette or craft a custom one, then generate ready-to-paste theme code for your framework.

`theme-catalog-kit` is a dependency-free toolkit (no React required) that ships **233+ curated themes** across **10 surface variants**, and turns any theme — preset or custom — into framework-ready files: CSS variables, matching button styles, Tailwind config, and more.

There is also an interactive showcase app in this repo (the catalog with a 3D jukebox, grid view, live preview, and an in-app **Docs** page).

---

## Install

```bash
npm install theme-catalog-kit
```

## Quick start

### 1. Use a preset

Every theme in the catalog is available from the package and ready to export.

```ts
import { themes, getTheme, generateThemeCode } from 'theme-catalog-kit';

console.log(themes.length); // 233+

const theme = getTheme('ocean-breeze');
const files = generateThemeCode(theme, 'nextjs');

files.forEach((f) => {
  console.log(f.path);    // app/globals.css
  console.log(f.content); // :root { --color-primary: ... } + button styles
});
```

### 2. Customize your own

Pass just a name and two base colors — the kit derives the light/dark shades,
applies a default font, and tags the surface variant.

```ts
import { createTheme, generateThemeCode } from 'theme-catalog-kit';

const theme = createTheme({
  name: 'Midnight Citrus',
  primary: '#ff9f1c',
  secondary: '#1c2541',
  variant: 'glass', // optional
});

const [file] = generateThemeCode(theme, 'scss');
// → src/styles/global.scss
```

Or do it in one call:

```ts
import { generateCustomThemeCode } from 'theme-catalog-kit';

const files = generateCustomThemeCode(
  { name: 'My Brand', primary: '#6c5ce7', secondary: '#00cec9' },
  'tailwind',
);
```

### 3. Write the files (e.g. a small script / CLI)

```ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { getTheme, generateThemeCode } from 'theme-catalog-kit';

for (const file of generateThemeCode(getTheme('cyberpunk-neon'), 'tailwind')) {
  mkdirSync(dirname(file.path), { recursive: true });
  writeFileSync(file.path, file.content);
}
```

---

## Frameworks

`generateThemeCode(theme, framework)` returns the files you need, each with the
right filename and project path:

| Framework  | Output |
| ---------- | ------ |
| `css`      | `src/styles/global.css` |
| `scss`     | `src/styles/global.scss` (+ `$` variables) |
| `tailwind` | `tailwind.config.js` + `src/globals.css` |
| `nextjs`   | `app/globals.css` |
| `nuxtjs`   | `assets/css/main.css` + `nuxt.config.ts` |
| `json`     | `src/theme.json` |

The generated stylesheet bundles the theme's CSS variables **and** button styles
(`.btn`, `.btn-primary`, `.btn-outline`) in a single global file. The button
borders, corners and edges are tailored to the theme's surface variant.

## Surface variants

Each theme renders one of 10 preview surfaces; the generated button styles match it:

`gradient` · `flat` · `glass` · `neu` · `outline` · `mesh` · `grid` · `duotone` · `scanline` · `spotlight`

```ts
import { getThemesByVariant } from 'theme-catalog-kit';

getThemesByVariant('flat'); // brutalist / anti-design presets
```

---

## API

| Export | Description |
| ------ | ----------- |
| `themes` | Array of all preset `ThemeConfig`s |
| `variants` | All 10 surface variant names |
| `frameworks` | All 6 framework target names |
| `getTheme(id)` | Find a preset by id |
| `getThemesByVariant(variant)` | Filter presets by surface |
| `createTheme(input)` | Build a full theme from a minimal custom config |
| `generateThemeCode(theme, framework?)` | Get framework-ready files |
| `generateCustomThemeCode(input, framework?)` | `createTheme` + `generateThemeCode` |
| `lighten(hex, amount?)` / `darken(hex, amount?)` | Shade helpers |

### Types

```ts
type ThemeColorConfig = {
  primary: string; primaryLight: string; primaryDark: string;
  secondary: string; secondaryLight: string; secondaryDark: string;
};

type ThemeConfig = {
  id: string; name: string;
  fontFamily: string; fontUrl: string;
  colors: ThemeColorConfig;
  tagline: string; desc: string;
  variant?: ThemeVariant; // defaults to 'gradient'
};

type Framework = 'css' | 'scss' | 'tailwind' | 'nextjs' | 'nuxtjs' | 'json';
type GeneratedFile = { filename: string; path: string; language: string; content: string };
```

---

## Showcase app (this repo)

```bash
npm install
npm run dev          # run the interactive catalog
npm run build        # build the showcase site -> site-dist/
npm run build:lib    # build the publishable library -> dist/
```

The catalog includes a 3D jukebox, a grid view, a live full-page theme apply,
a VSCode-style export panel with the framework picker, and an in-app Docs page.

## License

MIT
