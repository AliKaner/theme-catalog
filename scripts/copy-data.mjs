// tsc type-checks the themes.json import but does not emit the JSON, and raw
// Node ESM requires an import attribute for JSON. To keep the published package
// portable across every runtime, emit the data as a plain ESM module and point
// the compiled library import at it.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const json = readFileSync(resolve(root, 'src/constants/themes.json'), 'utf8');
const allThemes = JSON.parse(json);

// 1. Full dataset as a plain ESM module (used by the main entry).
const dataDest = resolve(root, 'dist/constants/themes.js');
mkdirSync(dirname(dataDest), { recursive: true });
writeFileSync(dataDest, `export default ${json.trim()};\n`);

// Repoint the compiled import from the .json file to the emitted .js module.
const indexPath = resolve(root, 'dist/lib/index.js');
const index = readFileSync(indexPath, 'utf8').replace(
  /(['"])\.\.\/constants\/themes\.json\1/g,
  "'../constants/themes.js'",
);
writeFileSync(indexPath, index);

// 2. One module per theme, so consumers can pull a single theme via the
//    `theme-catalog-kit/themes/<id>` subpath without bundling the rest.
const themesDir = resolve(root, 'dist/themes');
mkdirSync(themesDir, { recursive: true });

const dts = `import type { ThemeConfig } from '../lib/types';\ndeclare const theme: ThemeConfig;\nexport default theme;\n`;

for (const theme of allThemes) {
  writeFileSync(resolve(themesDir, `${theme.id}.js`), `export default ${JSON.stringify(theme, null, 2)};\n`);
  writeFileSync(resolve(themesDir, `${theme.id}.d.ts`), dts);
}

// 3. A lightweight id list, handy for tooling (does not pull theme data).
const ids = allThemes.map((t) => t.id);
writeFileSync(resolve(themesDir, 'ids.js'), `export default ${JSON.stringify(ids, null, 2)};\n`);
writeFileSync(resolve(themesDir, 'ids.d.ts'), `declare const ids: string[];\nexport default ids;\n`);

console.log(`emitted full dataset + ${allThemes.length} per-theme modules`);
