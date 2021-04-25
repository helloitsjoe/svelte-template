// @ts-check

/** This script modifies the project to support TS code in .svelte files like:

  <script lang="ts">
  	export let name: string;
  </script>

  As well as validating the code for CI.
  */

/**  To work on this script:
  rm -rf test-template template && git clone sveltejs/template test-template && node scripts/setupTypeScript.js test-template
*/

const fs = require('fs');
const path = require('path');
const { argv } = require('process');

const projectRoot = argv[2] || path.join(__dirname, '..');

const atRoot = (...args) => path.join(projectRoot, ...args);

// Add deps to pkg.json
const packageJSON = JSON.parse(fs.readFileSync(atRoot('package.json'), 'utf8'));
packageJSON.devDependencies = Object.assign(packageJSON.devDependencies, {
  '@rollup/plugin-typescript': '^8.0.0',
  '@tsconfig/svelte': '^1.0.0',
  '@types/jest': '^26.0.0',
  'svelte-check': '^1.0.0',
  'svelte-preprocess': '^4.0.0',
  typescript: '^4.0.0',
  'ts-jest': '^26.0.0',
  tslib: '^2.0.0',
});

// Add script for checking
packageJSON.scripts = Object.assign(packageJSON.scripts, {
  validate: 'svelte-check',
});

delete packageJSON.devDependencies['@babel/core'];
delete packageJSON.devDependencies['@babel/preset-env'];
delete packageJSON.devDependencies['babel-jest'];

// Write the package JSON
fs.writeFileSync(
  atRoot('package.json'),
  JSON.stringify(packageJSON, null, '  ')
);

// mv src/main.js to main.ts - note, we need to edit rollup.config.js for this too
const beforeMainJSPath = atRoot('src', 'main.js');
const afterMainTSPath = atRoot('src', 'main.ts');
fs.renameSync(beforeMainJSPath, afterMainTSPath);

// Convert test file to .ts
const beforeTestJSPath = atRoot('src', '__tests__', 'App.test.js');
const afterTestTSPath = atRoot('src', '__tests__', 'App.test.ts');
fs.renameSync(beforeTestJSPath, afterTestTSPath);

// Switch the app.svelte file to use TS
const appSveltePath = atRoot('src', 'App.svelte');
let appFile = fs.readFileSync(appSveltePath, 'utf8');
appFile = appFile.replace('<script>', '<script lang="ts">');
appFile = appFile.replace('export let name;', 'export let name: string;');
fs.writeFileSync(appSveltePath, appFile);

// Edit rollup config
const rollupConfigPath = atRoot('rollup.config.js');
let rollupConfig = fs.readFileSync(rollupConfigPath, 'utf8');

// Edit imports
rollupConfig = rollupConfig.replace(
  `'rollup-plugin-terser';`,
  `'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';`
);

// Replace name of entry point
rollupConfig = rollupConfig.replace(`'src/main.js'`, `'src/main.ts'`);

// Add preprocessor
rollupConfig = rollupConfig.replace(
  'compilerOptions:',
  'preprocess: sveltePreprocess({ sourceMap: !production }),\n\t\t\tcompilerOptions:'
);

// Add TypeScript
rollupConfig = rollupConfig.replace(
  'commonjs(),',
  'commonjs(),\n\t\ttypescript({\n\t\t\tsourceMap: !production,\n\t\t\tinlineSources: !production\n\t\t}),'
);
fs.writeFileSync(rollupConfigPath, rollupConfig);

// Add TSConfig
const tsconfig = `{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    // For lazy loading
    "module": "esnext",
    "types": ["svelte", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"]
}`;
const tsconfigPath = atRoot('tsconfig.json');
fs.writeFileSync(tsconfigPath, tsconfig);

// Update jest.config.js
const jestConfigPath = atRoot('jest.config.js');
let jestConfig = fs.readFileSync(jestConfigPath, 'utf8');
jestConfig = jestConfig.replace(
  `'svelte-jester'`,
  `['svelte-jester', { preprocess: true }]`
);
jestConfig = jestConfig.replace(
  `'^.+\\.js$': 'babel-jest'`,
  `'^.+\\.(js|ts)$': 'ts-jest'`
);
jestConfig = jestConfig.replace(
  `moduleFileExtensions: ['js', 'svelte']`,
  `preset: 'ts-jest',\n\tmoduleFileExtensions: ['js', 'ts', 'svelte']`
);
fs.writeFileSync(jestConfigPath, jestConfig);

const svelteConfigContent = `
const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  preprocess: sveltePreprocess(),
};
`;

fs.writeFileSync(atRoot('svelte.config.js'), svelteConfigContent);

// Delete Babel
fs.unlinkSync(atRoot('.babelrc.js'));

// DUPLICATE in setupDeploy.js
// Delete this script, but not during testing
if (!argv[2]) {
  // Remove the script
  fs.unlinkSync(path.join(__filename));

  // Check for Mac's DS_store file, and if it's the only one left remove it
  const remainingFiles = fs.readdirSync(path.join(__dirname));
  if (remainingFiles.length === 1 && remainingFiles[0] === '.DS_store') {
    fs.unlinkSync(path.join(__dirname, '.DS_store'));
  }

  // Check if the scripts folder is empty
  if (fs.readdirSync(path.join(__dirname)).length === 0) {
    // Remove the scripts folder
    fs.rmdirSync(path.join(__dirname));
  }
}

// Adds the extension recommendation
fs.mkdirSync(atRoot('.vscode'), { recursive: true });
fs.writeFileSync(
  atRoot('.vscode', 'extensions.json'),
  `{
  "recommendations": ["svelte.svelte-vscode"]
}
`
);

console.log('Converted to TypeScript.');

if (fs.existsSync(atRoot('node_modules'))) {
  console.log(
    '\nYou will need to re-run your dependency manager to get started.'
  );
}
