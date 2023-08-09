![Node.js CI](https://github.com/marcoklein/kleinprojects-website/workflows/Node.js%20CI/badge.svg)

# Kleinprojects Website - Personal Blog and Projects

Built with Eleventy and Bulma

## Install dependencies

```sh
yarn install
```

## Run locally

```sh
yarn start
```

## Upgrade dependencies

Upgrade to latest dependencies with (check breaking changes).

```sh
yarn upgrade-interactive --latest
```

## Tests

Playwright executes end-to-end tests.

To run tests start the application and run

```sh
yarn test:headed
```

To create a new test use the code generation with

```sh
yarn playwright:codegen
```

## Changes to the Prism theme

There is an overlap of the two CSS frameworks Bulma and Prism.

Both use `number` and `tag` classes for styling. To fix this we prefix Prism classes with `prism-number` and `prism-tag` respectively.

> You have to adjust Prism themes and rename the two tags if you change the Prism theme!

# Ideas

- add hover effect on cards: show shadow if hovered over card!

# TODO

- add AMP article https://developers.google.com/search/docs/data-types/article
- normalize CSS https://necolas.github.io/normalize.css/
- add manifest.json, site.json, robot.txt and all the SEO related stuff
- minify HTML by adding a transform function
