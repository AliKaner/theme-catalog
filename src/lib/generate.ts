import type { Framework, GeneratedFile, ThemeConfig, ThemeVariant } from './types.js';

export const resolveVariant = (theme: ThemeConfig): ThemeVariant =>
  theme.variant ?? (theme.flat ? 'flat' : 'gradient');

// :root custom properties block shared by every CSS-based target.
const rootVars = (theme: ThemeConfig): string => {
  const c = theme.colors;
  return `:root {
  --color-primary: ${c.primary};
  --color-primary-light: ${c.primaryLight};
  --color-primary-dark: ${c.primaryDark};
  --color-secondary: ${c.secondary};
  --color-secondary-light: ${c.secondaryLight};
  --color-secondary-dark: ${c.secondaryDark};
  --font-family: ${theme.fontFamily};
}`;
};

// Button rules whose borders / corners / edges match the theme's variant.
const buttonRules = (variant: ThemeVariant): string => {
  const base = `.btn {
  font-family: var(--font-family);
  font-weight: 600;
  padding: 10px 22px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:active { transform: translateY(1px); }`;

  switch (variant) {
    case 'flat':
      return `${base}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-secondary-light);
  border: 2px solid #14151b;       /* hard edge */
  border-radius: 0;                /* sharp corners */
  box-shadow: 4px 4px 0 var(--color-primary-dark);
}
.btn-primary:hover { box-shadow: 6px 6px 0 var(--color-primary-dark); }

.btn-outline {
  background: transparent;
  color: var(--color-primary-dark);
  border: 2px solid var(--color-primary-dark);
  border-radius: 0;
}`;
    case 'neu':
      return `${base}

.btn-primary {
  background: #e2e5ec;
  color: var(--color-primary-dark);
  border: none;
  border-radius: 14px;             /* soft rounded corners */
  box-shadow: 6px 6px 12px #b9bdc6, -6px -6px 12px #ffffff;
}
.btn-primary:hover { box-shadow: 8px 8px 16px #b9bdc6, -8px -8px 16px #ffffff; }

.btn-outline {
  background: #e2e5ec;
  color: var(--color-primary);
  border: none;
  border-radius: 14px;
  box-shadow: inset 3px 3px 7px #b9bdc6, inset -3px -3px 7px #ffffff;
}`;
    case 'glass':
      return `${base}

.btn-primary {
  background: color-mix(in srgb, var(--color-primary) 32%, transparent);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.28);  /* light glass edge */
  border-radius: 12px;             /* rounded corners */
  backdrop-filter: blur(8px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid color-mix(in srgb, var(--color-secondary) 55%, transparent);
  border-radius: 12px;
  backdrop-filter: blur(8px);
}`;
    case 'outline':
      return `${base}

.btn-primary {
  background: transparent;
  color: var(--color-primary-light);
  border: 1px dashed var(--color-primary);  /* dashed edge */
  border-radius: 8px;              /* gently rounded corners */
}
.btn-primary:hover { border-style: solid; }

.btn-outline {
  background: transparent;
  color: var(--color-primary-light);
  border: 1px solid color-mix(in srgb, var(--color-primary) 50%, transparent);
  border-radius: 8px;
}`;
    case 'duotone':
      return `${base}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
  border: 2px solid var(--color-secondary);  /* contrasting edge */
  border-radius: 4px;              /* slightly sharp corners */
}

.btn-outline {
  background: var(--color-secondary);
  color: #ffffff;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
}`;
    default:
      // gradient, mesh, grid, scanline, spotlight — gradient-border pill buttons
      return `${base}

.btn-primary {
  color: #ffffff;
  border: 1px solid transparent;   /* gradient border via background-clip */
  border-radius: 8px;              /* rounded corners */
  background:
    linear-gradient(#11131a, #11131a) padding-box,
    linear-gradient(to right, var(--color-primary), var(--color-secondary)) border-box;
}
.btn-primary:hover {
  background:
    linear-gradient(#181a23, #181a23) padding-box,
    linear-gradient(to right, var(--color-primary-light), var(--color-secondary-light)) border-box;
}

.btn-outline {
  background: transparent;
  color: var(--color-primary-light);
  border: 1px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
  border-radius: 8px;
}`;
  }
};

const scssVars = (theme: ThemeConfig): string => {
  const c = theme.colors;
  return `// ${theme.name} — theme variables
$color-primary: ${c.primary};
$color-primary-light: ${c.primaryLight};
$color-primary-dark: ${c.primaryDark};
$color-secondary: ${c.secondary};
$color-secondary-light: ${c.secondaryLight};
$color-secondary-dark: ${c.secondaryDark};
$font-family: ${theme.fontFamily};`;
};

const tailwindConfig = (theme: ThemeConfig): string => {
  const c = theme.colors;
  return `/** ${theme.name} — tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '${c.primary}', light: '${c.primaryLight}', dark: '${c.primaryDark}' },
        secondary: { DEFAULT: '${c.secondary}', light: '${c.secondaryLight}', dark: '${c.secondaryDark}' },
      },
      fontFamily: {
        theme: [${theme.fontFamily
          .split(',')
          .map((f) => `'${f.trim().replace(/'/g, '')}'`)
          .join(', ')}],
      },
    },
  },
};`;
};

/**
 * Generate the project files for a theme, tailored to the target framework.
 * Everything that can live in one global stylesheet does (buttons included);
 * only genuinely separate files (configs) get their own entry.
 */
export const generateThemeCode = (theme: ThemeConfig, framework: Framework = 'css'): GeneratedFile[] => {
  const variant = resolveVariant(theme);
  const fontImport = `@import url('${theme.fontUrl}');`;
  const header = `/* ${theme.name} — global theme styles */`;
  const globalCss = `${fontImport}\n\n${header}\n${rootVars(theme)}\n\n${buttonRules(variant)}`;

  switch (framework) {
    case 'scss':
      return [
        {
          filename: 'global.scss',
          path: 'src/styles/global.scss',
          language: 'scss',
          content: `${fontImport}\n\n${scssVars(theme)}\n\n${header}\n${rootVars(theme)}\n\n${buttonRules(variant)}`,
        },
      ];
    case 'tailwind':
      return [
        { filename: 'tailwind.config.js', path: './tailwind.config.js', language: 'javascript', content: tailwindConfig(theme) },
        {
          filename: 'globals.css',
          path: 'src/globals.css',
          language: 'css',
          content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${fontImport}\n\n${rootVars(theme)}\n\n${buttonRules(variant)}`,
        },
      ];
    case 'nextjs':
      return [{ filename: 'globals.css', path: 'app/globals.css', language: 'css', content: globalCss }];
    case 'nuxtjs':
      return [
        { filename: 'main.css', path: 'assets/css/main.css', language: 'css', content: globalCss },
        {
          filename: 'nuxt.config.ts',
          path: './nuxt.config.ts',
          language: 'typescript',
          content: `// Register the global theme stylesheet\nexport default defineNuxtConfig({\n  css: ['~/assets/css/main.css'],\n})`,
        },
      ];
    case 'json':
      return [{ filename: 'theme.json', path: 'src/theme.json', language: 'json', content: JSON.stringify(theme, null, 2) }];
    case 'css':
    default:
      return [{ filename: 'global.css', path: 'src/styles/global.css', language: 'css', content: globalCss }];
  }
};
