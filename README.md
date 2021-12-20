![Node.js CI](https://github.com/marcoklein/kleinprojects-website/workflows/Node.js%20CI/badge.svg)

# Kleinprojects Website - Personal Blog and Projects

Built with Eleventy and Bulma

## Install dependencies

```sh
yarn install
```

## Run locally

```sh
yarn serve
```

## Upgrade dependencies

We use [npm-check-updates](https://github.com/raineorshine/npm-check-updates) to upgrade dependencies.

Check for updates

```sh
npx npm-check-updates
```

Write updates

```sh
npx npm-check-updates -u
```

Run an `npm install` after a successful write.

## Changes to the Prism theme

There is an overlap of the two CSS frameworks Bulma and Prism.

Both use `number` and `tag` classes for styling. To fix this we prefix Prism classes with `prism-number` and `prism-tag` respectively.

> You have to adjust Prism themes and rename the two tags if you change the Prism theme!

# Ideas

- add hover effect on cards: show shadow if hovered over card!

# TODO

- add AMP article https://developers.google.com/search/docs/data-types/article
- normalize CSS https://necolas.github.io/normalize.css/
- add Hygen for code generation via templates https://www.npmjs.com/package/hygen
- add manifest.json, site.json, robot.txt and all the SEO related stuff
- minify HTML by adding a transform function

- Add excerpt with https://www.11ty.dev/docs/data-frontmatter-customize/
