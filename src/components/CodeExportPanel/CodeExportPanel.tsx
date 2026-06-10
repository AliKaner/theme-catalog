import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, FileCode2 } from 'lucide-react';
import classNames from 'classnames';
import type { CodeExportPanelProps, ExportTab, ExportTech } from './CodeExportPanel.types';
import type { ThemeConfig, ThemeVariant } from '../../pages/ThemeCatalog/ThemeCatalog.types';
import styles from './CodeExportPanel.module.scss';

// The frameworks the user can target from the selector on the right.
const TECHS: { id: ExportTech; label: string }[] = [
  { id: 'css', label: 'Plain CSS' },
  { id: 'scss', label: 'SCSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'nuxtjs', label: 'Nuxt.js' },
  { id: 'json', label: 'JSON' },
];

const resolveVariant = (theme: ThemeConfig): ThemeVariant =>
  theme.variant ?? (theme.flat ? 'flat' : 'gradient');

// The :root custom properties block, shared by every CSS-based target.
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

// Button classes whose borders / corners / edges match the theme's surface
// variant. Everything references the CSS variables above so it can live in a
// single global stylesheet.
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

// Build the set of files to show for the chosen framework. Everything that can
// live in one global stylesheet does — buttons included — and only genuinely
// separate files (configs) get their own tab.
const buildTabs = (theme: ThemeConfig, tech: ExportTech): ExportTab[] => {
  const variant = resolveVariant(theme);
  const fontImport = `@import url('${theme.fontUrl}');`;
  const header = `/* ${theme.name} — global theme styles */`;
  const globalCss = `${fontImport}\n\n${header}\n${rootVars(theme)}\n\n${buttonRules(variant)}`;

  switch (tech) {
    case 'css':
      return [
        { id: 'global', filename: 'global.css', language: 'css', dotColor: '#519aba', path: 'src/styles/global.css', content: globalCss },
      ];
    case 'scss':
      return [
        {
          id: 'global',
          filename: 'global.scss',
          language: 'scss',
          dotColor: '#cd6799',
          path: 'src/styles/global.scss',
          content: `${fontImport}\n\n${scssVars(theme)}\n\n${header}\n${rootVars(theme)}\n\n${buttonRules(variant)}`,
        },
      ];
    case 'tailwind':
      return [
        { id: 'config', filename: 'tailwind.config.js', language: 'javascript', dotColor: '#e8d44d', path: './tailwind.config.js', content: tailwindConfig(theme) },
        {
          id: 'global',
          filename: 'globals.css',
          language: 'css',
          dotColor: '#519aba',
          path: 'src/globals.css',
          content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${fontImport}\n\n${rootVars(theme)}\n\n${buttonRules(variant)}`,
        },
      ];
    case 'nextjs':
      return [
        {
          id: 'global',
          filename: 'globals.css',
          language: 'css',
          dotColor: '#519aba',
          path: 'app/globals.css',
          content: globalCss,
        },
      ];
    case 'nuxtjs':
      return [
        { id: 'global', filename: 'main.css', language: 'css', dotColor: '#519aba', path: 'assets/css/main.css', content: globalCss },
        {
          id: 'config',
          filename: 'nuxt.config.ts',
          language: 'typescript',
          dotColor: '#41b883',
          path: './nuxt.config.ts',
          content: `// Register the global theme stylesheet\nexport default defineNuxtConfig({\n  css: ['~/assets/css/main.css'],\n})`,
        },
      ];
    case 'json':
    default:
      return [
        { id: 'json', filename: 'theme.json', language: 'json', dotColor: '#8bc34a', path: 'src/theme.json', content: JSON.stringify(theme, null, 2) },
      ];
  }
};

const CodeExportPanel = (props: CodeExportPanelProps) => {
  const { theme } = props;
  const { t } = useTranslation();

  const [tech, setTech] = useState<ExportTech>('css');
  const [activeTabId, setActiveTabId] = useState<string>('global');
  const [copied, setCopied] = useState<boolean>(false);

  // Recompute the export files whenever the theme or target framework changes.
  const tabs: ExportTab[] = useMemo(() => buildTabs(theme, tech), [theme, tech]);

  const activeTab: ExportTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  const handleTechChange = (next: ExportTech): void => {
    setTech(next);
    setActiveTabId('global'); // reset to the primary file; falls back if absent
    setCopied(false);
  };

  // Copy the currently visible file content to the clipboard with feedback.
  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(activeTab.content);
      setCopied(true);
      window.setTimeout((): void => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const lines: string[] = activeTab.content.split('\n');

  const panelStyle: React.CSSProperties = {
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
  } as React.CSSProperties;

  return (
    <section className={styles.panel} style={panelStyle}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleGroup}>
          <FileCode2 size={16} />
          <div>
            <h3 className={styles.panelTitle}>{t('export.title')}</h3>
            <p className={styles.panelSubtitle}>{t('export.subtitle')}</p>
          </div>
        </div>

        {/* Framework selector on the right */}
        <label className={styles.techSelect}>
          <span className={styles.techLabel}>{t('export.tech')}</span>
          <select
            value={tech}
            onChange={(e): void => handleTechChange(e.target.value as ExportTech)}
          >
            {TECHS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.editor}>
        {/* VSCode-like tab bar listing the files for the chosen framework */}
        <div className={styles.tabBar} role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTab.id}
              className={classNames(styles.tab, { [styles.activeTab]: tab.id === activeTab.id })}
              onClick={(): void => {
                setActiveTabId(tab.id);
                setCopied(false);
              }}
            >
              <span className={styles.tabDot} style={{ backgroundColor: tab.dotColor }} />
              <span className={styles.tabName}>{tab.filename}</span>
            </button>
          ))}

          <button
            type="button"
            className={classNames(styles.copyButton, { [styles.copied]: copied })}
            onClick={handleCopy}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? t('export.copied') : t('export.copy')}</span>
          </button>
        </div>

        {/* The file path breadcrumb, like an editor's status strip */}
        <div className={styles.pathBar}>
          <span className={styles.pathCurrent}>{activeTab.path ?? activeTab.filename}</span>
          <span className={styles.langBadge}>{activeTab.language}</span>
        </div>

        {/* Code body with a line-number gutter */}
        <div className={styles.codeBody}>
          <pre className={styles.gutter} aria-hidden="true">
            {lines.map((_, i) => (
              <span key={i} className={styles.lineNo}>
                {i + 1}
              </span>
            ))}
          </pre>
          <pre className={styles.code}>
            <code>{activeTab.content}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default CodeExportPanel;
