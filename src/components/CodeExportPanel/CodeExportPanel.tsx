import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, FileCode2 } from 'lucide-react';
import classNames from 'classnames';
import type { CodeExportPanelProps, ExportTab } from './CodeExportPanel.types';
import type { ThemeConfig } from '../../pages/ThemeCatalog/ThemeCatalog.types';
import styles from './CodeExportPanel.module.scss';

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

  return [
    {
      id: 'css',
      filename: 'theme.css',
      language: 'css',
      dotColor: '#519aba',
      content: `${fontImport}\n\n${cssVars}`,
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
