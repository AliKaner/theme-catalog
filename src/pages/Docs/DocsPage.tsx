import { useTranslation } from 'react-i18next';
import { ArrowLeft, Boxes, Palette, Wand2, Code2, Package } from 'lucide-react';
import { frameworks, themes, variants } from '../../lib';
import styles from './DocsPage.module.scss';

type DocsPageProps = {
  onBack?: () => void;
};

const PKG = 'theme-catalog-kit';

const installSnippet = `npm install ${PKG}`;

const presetSnippet = `import { themes, getTheme, generateThemeCode } from '${PKG}';

// Browse ${themes.length}+ ready-made presets
console.log(themes.length);

// Grab one by id and generate framework-ready code
const theme = getTheme('ocean-breeze');
const files = generateThemeCode(theme, 'nextjs');

files.forEach((f) => {
  console.log(f.path);   // app/globals.css
  console.log(f.content); // :root { --color-primary: ... } + buttons
});`;

const customSnippet = `import { createTheme, generateThemeCode } from '${PKG}';

// Minimal input — light/dark shades are auto-derived
const theme = createTheme({
  name: 'Midnight Citrus',
  primary: '#ff9f1c',
  secondary: '#1c2541',
  variant: 'glass',
});

const [file] = generateThemeCode(theme, 'scss');
write('src/styles/global.scss', file.content);`;

const cliSnippet = `import { writeFileSync } from 'node:fs';
import { getTheme, generateThemeCode } from '${PKG}';

for (const file of generateThemeCode(getTheme('cyberpunk-neon'), 'tailwind')) {
  writeFileSync(file.path, file.content);
}`;

const singleSnippet = `// Pulls ONLY this theme + the generator — not the whole catalog
import oceanBreeze from '${PKG}/themes/ocean-breeze';
import { generateThemeCode } from '${PKG}/generate';

const files = generateThemeCode(oceanBreeze, 'nextjs');`;

const DocsPage = (props: DocsPageProps) => {
  const { onBack } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.docs}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          <span>{t('docs.back')}</span>
        </button>
        <div className={styles.pkgPill}>
          <Package size={14} />
          {PKG}
        </div>
      </header>

      <main className={styles.body}>
        <section className={styles.hero}>
          <h1>{t('docs.heroTitle')}</h1>
          <p>{t('docs.heroLead')}</p>
          <div className={styles.statRow}>
            <div className={styles.stat}>
              <Palette size={18} />
              <span>{themes.length}</span>
              <small>{t('docs.statPresets')}</small>
            </div>
            <div className={styles.stat}>
              <Boxes size={18} />
              <span>{variants.length}</span>
              <small>{t('docs.statVariants')}</small>
            </div>
            <div className={styles.stat}>
              <Code2 size={18} />
              <span>{frameworks.length}</span>
              <small>{t('docs.statFrameworks')}</small>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>
            <Package size={18} /> {t('docs.install')}
          </h2>
          <pre className={styles.code}>
            <code>{installSnippet}</code>
          </pre>
        </section>

        <section className={styles.section}>
          <h2>
            <Palette size={18} /> {t('docs.usePreset')}
          </h2>
          <p>{t('docs.usePresetDesc')}</p>
          <pre className={styles.code}>
            <code>{presetSnippet}</code>
          </pre>
        </section>

        <section className={styles.section}>
          <h2>
            <Wand2 size={18} /> {t('docs.customize')}
          </h2>
          <p>{t('docs.customizeDesc')}</p>
          <pre className={styles.code}>
            <code>{customSnippet}</code>
          </pre>
        </section>

        <section className={styles.section}>
          <h2>
            <Package size={18} /> {t('docs.single')}
          </h2>
          <p>{t('docs.singleDesc')}</p>
          <pre className={styles.code}>
            <code>{singleSnippet}</code>
          </pre>
        </section>

        <section className={styles.section}>
          <h2>
            <Code2 size={18} /> {t('docs.generate')}
          </h2>
          <p>
            <code>generateThemeCode(theme, framework)</code> {t('docs.generateDesc')}
          </p>
          <div className={styles.tagRow}>
            {frameworks.map((f) => (
              <span key={f} className={styles.tag}>
                {f}
              </span>
            ))}
          </div>
          <pre className={styles.code}>
            <code>{cliSnippet}</code>
          </pre>
        </section>

        <section className={styles.section}>
          <h2>
            <Boxes size={18} /> {t('docs.variantsTitle')}
          </h2>
          <p>{t('docs.variantsDesc', { count: variants.length })}</p>
          <div className={styles.tagRow}>
            {variants.map((v) => (
              <span key={v} className={styles.tag}>
                {v}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('docs.apiTitle')}</h2>
          <ul className={styles.api}>
            <li>
              <code>themes</code> — {t('docs.apiThemes')}
            </li>
            <li>
              <code>getTheme(id)</code> — {t('docs.apiGetTheme')}
            </li>
            <li>
              <code>getThemesByVariant(variant)</code> — {t('docs.apiByVariant')}
            </li>
            <li>
              <code>createTheme(input)</code> — {t('docs.apiCreate')}
            </li>
            <li>
              <code>generateThemeCode(theme, framework)</code> — {t('docs.apiGenerate')}
            </li>
            <li>
              <code>generateCustomThemeCode(input, framework)</code> — {t('docs.apiGenerateCustom')}
            </li>
            <li>
              <code>lighten(hex)</code> / <code>darken(hex)</code> — {t('docs.apiShades')}
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DocsPage;
