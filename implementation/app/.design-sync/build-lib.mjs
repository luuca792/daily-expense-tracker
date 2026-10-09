// Builds the mini package design-sync converts: .design-sync/.cache/pkg/{package.json,dist/index.js,types/}.
// Run from implementation/app: node .design-sync/build-lib.mjs
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { build } from '../.ds-sync/node_modules/esbuild/lib/main.js';

const pkgDir = '.design-sync/.cache/pkg';
rmSync(pkgDir, { recursive: true, force: true });
mkdirSync(`${pkgDir}/dist`, { recursive: true });
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
writeFileSync(`${pkgDir}/package.json`, JSON.stringify({
  name: 'so-chi-tieu-ui', version, type: 'module',
  module: 'dist/index.js', types: 'types/.design-sync/lib-entry.d.ts',
  peerDependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
}, null, 2));
await build({
  entryPoints: ['.design-sync/lib-entry.ts'], bundle: true, format: 'esm', jsx: 'automatic',
  outfile: `${pkgDir}/dist/index.js`, external: ['react', 'react-dom', 'react/jsx-runtime'], logLevel: 'warning',
});
// the app's stylesheets, concatenated in main.tsx order
writeFileSync(`${pkgDir}/dist/styles.css`, ['tokens', 'base', 'components']
  .map((n) => readFileSync(`src/styles/${n}.css`, 'utf8')).join('\n'));
execSync('npx tsc -p .design-sync/tsconfig.lib.json', { stdio: 'inherit' });
console.log('built', pkgDir);
