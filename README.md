# helloitsjoe/svelte-template

This is a project template for [Svelte](https://svelte.dev) apps. It lives at
https://github.com/helloitsjoe/svelte-template.

To create a new project based on this template using
[degit](https://github.com/Rich-Harris/degit):

```bash
npx degit helloitsjoe/svelte-template#main svelte-app
cd svelte-app
```

_Note that you will need to have [Node.js](https://nodejs.org) installed._

## Get started

Install the dependencies...

```bash
cd svelte-app
yarn
```

...then start [Rollup](https://rollupjs.org):

```bash
yarn start
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app
running. Edit a component file in `src`, save it, and reload the page to see
your changes.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we
recommend installing the official extension
[Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).
If you are using other editors you may need to install a plugin in order to get
syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
yarn build
```

You can run the newly built app with `yarn start`. This uses
[sirv](https://github.com/lukeed/sirv), which is included in your package.json's
`dependencies` so that the app will work when you deploy to platforms like
[Heroku](https://heroku.com).

## Single-page app mode

By default, sirv will only respond to requests that match files in `public`.
This is to maximise compatibility with static fileservers, allowing you to
deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to
be able to respond to requests for _any_ path. You can make it so by editing the
`"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Using TypeScript

This template comes with a script to set up a TypeScript development
environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

## Deploying to the web

### With GitHub Pages

This template comes with a CI script to run tests and deploy `main` and branch
builds to GitHub pages. You can run it immediately after cloning the template
with:

```bash
node scripts/setupDeploy.js
```

By default this will deploy to the `gh-pages` branch of your repo, and will be
available at `<your-username>.github.io/svelte-app`. See
[the `helloitsjoe/deploy-github-pages` GitHub Action](https://github.com/helloitsjoe/deploy-github-pages/)
for more information.

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

---

_Looking for a shareable component template? Go here -->
[sveltejs/component-template](https://github.com/sveltejs/component-template)_
