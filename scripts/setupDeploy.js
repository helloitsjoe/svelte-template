const fs = require('fs');
const path = require('path');

const projectRoot = process.argv[2] || path.join(__dirname, '..');
const workflowsDir = path.join(projectRoot, '.github', 'workflows');

const deployYml = ({ branch } = {}) =>
  `
on:
  push:
    ${branch ? 'branches-ignore' : 'branches'}: [main]

jobs:
  deploy:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 14
      - uses: c-hive/gha-yarn-cache@v1
      - run: yarn
      - run: yarn test
      - uses: helloitsjoe/deploy-github-pages@v1
        with:
          build_dir: public
          ${branch ? 'branch_build: true' : ''}
`.trim();

const deployMain = deployYml();
const deployBranch = deployYml({ branch: true });

fs.mkdirSync(workflowsDir, { recursive: true });
fs.writeFileSync(path.join(workflowsDir, 'deployMain.yml'), deployMain);
fs.writeFileSync(path.join(workflowsDir, 'deployBranch.yml'), deployBranch);
