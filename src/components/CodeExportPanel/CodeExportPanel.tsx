import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, FileCode2 } from 'lucide-react';
import classNames from 'classnames';
import type { CodeExportPanelProps, ExportTab } from './CodeExportPanel.types';
import type { ThemeConfig, ThemeVariant } from '../../pages/ThemeCatalog/ThemeCatalog.types';
import styles from './CodeExportPanel.module.scss';

// Generate ready-to-use button CSS whose borders, corners and edges match the
// theme's surface variant, so users can copy the exact button look they see.
const buildButtonCss = (theme: ThemeConfig, variant: ThemeVariant): string => {
  const c = theme.colors;
  const base = `.btn {
  font-family: ${theme.fontFamily};
  font-weight: 600;
  padding: 10px 22px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:active { transform: translateY(1px); }`;

  switch (variant) {
    case 'flat':
      return `/* ${theme.name} — brutalist / hard-edge buttons */
${base}

.btn-primary {
  background: ${c.primary};
  color: ${c.secondaryLight};
  border: 2px solid #14151b;       /* hard edge */
  border-radius: 0;                /* sharp corners */
  box-shadow: 4px 4px 0 ${c.primaryDark};  /* offset block shadow */
}
.btn-primary:hover { box-shadow: 6px 6px 0 ${c.primaryDark}; }

.btn-outline {
  background: transparent;
  color: ${c.primaryDark};
  border: 2px solid ${c.primaryDark};
  border-radius: 0;
}`;
    case 'neu':
      return `/* ${theme.name} — soft neumorphic buttons */
${base}

.btn-primary {
  background: #e2e5ec;
  color: ${c.primaryDark};
  border: none;
  border-radius: 14px;             /* soft rounded corners */
  box-shadow: 6px 6px 12px #b9bdc6, -6px -6px 12px #ffffff;
}
.btn-primary:hover { box-shadow: 8px 8px 16px #b9bdc6, -8px -8px 16px #ffffff; }

.btn-outline {
  background: #e2e5ec;
  color: ${c.primary};
  border: none;
  border-radius: 14px;
  box-shadow: inset 3px 3px 7px #b9bdc6, inset -3px -3px 7px #ffffff;
}`;
    case 'glass':
      return `/* ${theme.name} — frosted glass buttons */
${base}

.btn-primary {
  background: color-mix(in srgb, ${c.primary} 32%, transparent);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.28);  /* light glass edge */
  border-radius: 12px;             /* rounded corners */
  backdrop-filter: blur(8px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid color-mix(in srgb, ${c.secondary} 55%, transparent);
  border-radius: 12px;
  backdrop-filter: blur(8px);
}`;
    case 'outline':
      return `/* ${theme.name} — wireframe / outline buttons */
${base}

.btn-primary {
  background: transparent;
  color: ${c.primaryLight};
  border: 1px dashed ${c.primary};  /* dashed edge */
  border-radius: 8px;              /* gently rounded corners */
}
.btn-primary:hover { border-style: solid; }

.btn-outline {
  background: transparent;
  color: ${c.primaryLight};
  border: 1px solid color-mix(in srgb, ${c.primary} 50%, transparent);
  border-radius: 8px;
}`;
    case 'duotone':
      return `/* ${theme.name} — bold duotone buttons */
${base}

.btn-primary {
  background: ${c.primary};
  color: #ffffff;
  border: 2px solid ${c.secondary};  /* contrasting edge */
  border-radius: 4px;              /* slightly sharp corners */
}

.btn-outline {
  background: ${c.secondary};
  color: #ffffff;
  border: 2px solid ${c.primary};
  border-radius: 4px;
}`;
    default:
      // gradient, mesh, grid, scanline, spotlight — gradient-border pill buttons
      return `/* ${theme.name} — gradient-border buttons */
${base}

.btn-primary {
  color: #ffffff;
  border: 1px solid transparent;   /* gradient border via background-clip */
  border-radius: 8px;              /* rounded corners */
  background:
    linear-gradient(#11131a, #11131a) padding-box,
    linear-gradient(to right, ${c.primary}, ${c.secondary}) border-box;
}
.btn-primary:hover {
  background:
    linear-gradient(#181a23, #181a23) padding-box,
    linear-gradient(to right, ${c.primaryLight}, ${c.secondaryLight}) border-box;
}

.btn-outline {
  background: transparent;
  color: ${c.primaryLight};
  border: 1px solid color-mix(in srgb, ${c.primary} 40%, transparent);
  border-radius: 8px;
}`;
  }
};

// Build the list of exportable files for the currently applied theme. Each entry
// becomes one editor tab the user can read and copy, similar to switching files
// in VSCode or tabs in a browser.
const buildTabs = (theme: ThemeConfig): ExportTab[] => {
  const c = theme.colors;
  const fontImport = `@import url('${theme.fontUrl}');`;
  const fontStack = theme.fontFamily;

  const cssVars = `:root {
  --color-primary: ${c.primary};
  --color-primary-light: ${c.primaryLight};
  --color-primary-dark: ${c.primaryDark};
  --color-secondary: ${c.secondary};
  --color-secondary-light: ${c.secondaryLight};
  --color-secondary-dark: ${c.secondaryDark};
  --font-family: ${fontStack};
}`;

  const scss = `// ${theme.name} — theme variables
$color-primary: ${c.primary};
$color-primary-light: ${c.primaryLight};
$color-primary-dark: ${c.primaryDark};
$color-secondary: ${c.secondary};
$color-secondary-light: ${c.secondaryLight};
$color-secondary-dark: ${c.secondaryDark};
$font-family: ${fontStack};`;

  const tailwind = `/** ${theme.name} — tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${c.primary}',
          light: '${c.primaryLight}',
          dark: '${c.primaryDark}',
        },
        secondary: {
          DEFAULT: '${c.secondary}',
          light: '${c.secondaryLight}',
          dark: '${c.secondaryDark}',
        },
      },
      fontFamily: {
        theme: [${fontStack
          .split(',')
          .map((f) => `'${f.trim().replace(/'/g, '')}'`)
          .join(', ')}],
      },
    },
  },
};`;

  const json = JSON.stringify(theme, null, 2);

  // Resolve the surface variant so the button styles match what's on screen.
  const variant: ThemeVariant = theme.variant ?? (theme.flat ? 'flat' : 'gradient');
  const buttons = buildButtonCss(theme, variant);

  return [
    {
      id: 'css',
      filename: 'theme.css',
      language: 'css',
      dotColor: '#519aba',
      content: `${fontImport}\n\n${cssVars}`,
    },
    {
      id: 'buttons',
      filename: 'buttons.css',
      language: 'css',
      dotColor: '#e8920c',
      content: buttons,
    },
    {
      id: 'scss',
      filename: 'variables.scss',
      language: 'scss',
      dotColor: '#cd6799',
      content: `@import url('${theme.fontUrl}');\n\n${scss}`,
    },
    {
      id: 'tailwind',
      filename: 'tailwind.config.js',
      language: 'javascript',
      dotColor: '#e8d44d',
      content: tailwind,
    },
    {
      id: 'json',
      filename: 'theme.json',
      language: 'json',
      dotColor: '#8bc34a',
      content: json,
    },
  ];
};

const CodeExportPanel = (props: CodeExportPanelProps) => {
  const { theme } = props;
  const { t } = useTranslation();

  // Recompute the export tabs whenever the applied theme changes.
  const tabs: ExportTab[] = useMemo(() => buildTabs(theme), [theme]);

  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeTab: ExportTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  // Copy the currently visible file content to the clipboard with feedback.
  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(activeTab.content);
      setCopied(true);
      window.setTimeout((): void => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); fail silently.
      setCopied(false);
    }
  };

  // Split content into lines so we can render a gutter with line numbers.
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
          <h3 className={styles.panelTitle}>{t('export.title')}</h3>
        </div>
        <p className={styles.panelSubtitle}>{t('export.subtitle')}</p>
      </div>

      <div className={styles.editor}>
        {/* VSCode-like tab bar listing each exportable file */}
        <div className={styles.tabBar} role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTabId}
              className={classNames(styles.tab, {
                [styles.activeTab]: tab.id === activeTabId,
              })}
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
          <span className={styles.pathSegment}>src</span>
          <span className={styles.pathSep}>/</span>
          <span className={styles.pathSegment}>styles</span>
          <span className={styles.pathSep}>/</span>
          <span className={styles.pathCurrent}>{activeTab.filename}</span>
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
