// tsc type-checks the themes.json import but does not emit the JSON, and raw
// Node ESM requires an import attribute for JSON. To keep the published package
// portable across every runtime, emit the data as a plain ESM module and point
// the compiled library import at it.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const json = readFileSync(resolve(root, 'src/constants/themes.json'), 'utf8');

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

console.log('emitted dist/constants/themes.js and patched library import');
