---
tags: ['coding']
title: Using the version from package.json in React applications
date: 2022-10-20
---

You want to display the application version from your `package.json` in your frontend React application, that is using react-scripts.

React scripts automatically picks up `.env` files and populates environment variables that start with `REACT_APP_`. Thus, for runtime use a `.env` file with:

```
REACT_APP_VERSION=$npm_package_version
```

This populates the version from the `npm_package_version` environment variable on runtime which is set by the NodeJs environment. However, this does not always work if you are building in different environments.

Therefore, for build time use a tool like `genversion` in package.json:

```json
// ...
"scripts": {
  "start": "react-scripts start",
  "build": "genversion src/version.gen.ts && react-scripts build",
  // ...
}
// ...
```

And include the version in your application for example via:

```ts
export const environment = {
  VERSION: process.env.REACT_APP_VERSION ?? version,
};
```

Ignore the generated version file in your `.gitignore`.

With this approach the version gets populated if you start your react app through the `.env` and you ensure the version on a build via the `genversion` command.

