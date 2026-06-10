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

const DocsPage = (props: DocsPageProps) => {
  const { onBack } = props;

  return (
    <div className={styles.docs}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Catalog</span>
        </button>
        <div className={styles.pkgPill}>
          <Package size={14} />
          {PKG}
        </div>
      </header>

      <main className={styles.body}>
        <section className={styles.hero}>
          <h1>Theme Catalog Kit</h1>
          <p>
            A dependency-free toolkit to <strong>pick a preset palette</strong> or{' '}
            <strong>craft a custom one</strong>, then <strong>generate ready-to-paste theme code</strong>{' '}
            for your framework — CSS variables, button styles, Tailwind config and more.
          </p>
          <div className={styles.statRow}>
            <div className={styles.stat}>
              <Palette size={18} />
              <span>{themes.length}</span>
              <small>presets</small>
            </div>
            <div className={styles.stat}>
              <Boxes size={18} />
              <span>{variants.length}</span>
              <small>surface variants</small>
            </div>
            <div className={styles.stat}>
              <Code2 size={18} />
              <span>{frameworks.length}</span>
              <small>frameworks</small>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>
            <Package size={18} /> Install
          </h2>
          <pre className={styles.code}>
            <code>{installSnippet}</code>
          </pre>
        </section>

        <section className={styles.section}>
          <h2>
            <Palette size={18} /> Use a preset
          </h2>
          <p>Every preset in this catalog is available from the package and ready to export.</p>
          <pre className={styles.code}>
            <code>{presetSnippet}</code>
          </pre>
        </section>

        <section className={styles.section}>
          <h2>
            <Wand2 size={18} /> Customize your own
          </h2>
          <p>
            Pass just a name and two base colors — the kit derives the light/dark shades, applies a
            default font, and tags the surface variant.
          </p>
          <pre className={styles.code}>
            <code>{customSnippet}</code>
          </pre>
        </section>

        <section className={styles.section}>
          <h2>
            <Code2 size={18} /> Generate for any framework
          </h2>
          <p>
            <code>generateThemeCode(theme, framework)</code> returns the files you need with the right
            filename and project path for each target.
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
            <Boxes size={18} /> Surface variants
          </h2>
          <p>Each theme renders one of {variants.length} preview surfaces; the generated button styles match it.</p>
          <div className={styles.tagRow}>
            {variants.map((v) => (
              <span key={v} className={styles.tag}>
                {v}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>API reference</h2>
          <ul className={styles.api}>
            <li>
              <code>themes</code> — array of all preset <code>ThemeConfig</code>s
            </li>
            <li>
              <code>getTheme(id)</code> — find a preset by id
            </li>
            <li>
              <code>getThemesByVariant(variant)</code> — filter presets by surface
            </li>
            <li>
              <code>createTheme(input)</code> — build a full theme from a minimal custom config
            </li>
            <li>
              <code>generateThemeCode(theme, framework)</code> — get framework-ready files
            </li>
            <li>
              <code>generateCustomThemeCode(input, framework)</code> — create + generate in one call
            </li>
            <li>
              <code>lighten(hex)</code> / <code>darken(hex)</code> — shade helpers
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DocsPage;
