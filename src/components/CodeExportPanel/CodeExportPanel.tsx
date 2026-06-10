import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, FileCode2 } from 'lucide-react';
import classNames from 'classnames';
import { generateThemeCode } from '../../lib';
import type { Framework } from '../../lib';
import type { CodeExportPanelProps, ExportTab } from './CodeExportPanel.types';
import styles from './CodeExportPanel.module.scss';

// The frameworks the user can target from the selector on the right.
const TECHS: { id: Framework; label: string }[] = [
  { id: 'css', label: 'Plain CSS' },
  { id: 'scss', label: 'SCSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'nuxtjs', label: 'Nuxt.js' },
  { id: 'json', label: 'JSON' },
];

// File-type dot colors keyed by language, VSCode style.
const DOT_BY_LANG: Record<string, string> = {
  css: '#519aba',
  scss: '#cd6799',
  javascript: '#e8d44d',
  typescript: '#41b883',
  json: '#8bc34a',
};

const CodeExportPanel = (props: CodeExportPanelProps) => {
  const { theme } = props;
  const { t } = useTranslation();

  const [tech, setTech] = useState<Framework>('css');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate the export files via the shared library, then decorate each with a
  // dot color for the tab UI.
  const tabs: ExportTab[] = useMemo(
    () =>
      generateThemeCode(theme, tech).map((file) => ({
        id: file.filename,
        filename: file.filename,
        language: file.language,
        path: file.path,
        content: file.content,
        dotColor: DOT_BY_LANG[file.language] ?? '#888888',
      })),
    [theme, tech],
  );

  const activeTab: ExportTab = tabs[Math.min(activeIndex, tabs.length - 1)];

  const handleTechChange = (next: Framework): void => {
    setTech(next);
    setActiveIndex(0);
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
          <select value={tech} onChange={(e): void => handleTechChange(e.target.value as Framework)}>
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
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={classNames(styles.tab, { [styles.activeTab]: index === activeIndex })}
              onClick={(): void => {
                setActiveIndex(index);
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
