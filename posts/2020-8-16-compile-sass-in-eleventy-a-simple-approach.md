---
tags: ['eleventy']
title: A dead simple approach to using SASS in Eleventy
---

I prefer going with as simple solutions as possible, avoiding the usage of third party packages that always introduce some risk into your project. You don't know if they are up to date if there are no tests included, you don't know if they are secure and what packages are attached to them if you don't check source code.

So, to include SASS within my Eleventy project I am using only the official [SASS npm package](https://www.npmjs.com/package/sass) and the officially included [fs package](https://nodejs.org/api/fs.html) of node to write the transpiled files.

The `.eleventy.js` file contains only three lines within the configuration function to compile SASS into CSS:

``` javascript
const sass = require('sass');
const fs = require('fs');

function compileSass() {
  console.log('Compiling sass.');
  const cssContent = sass.renderSync({file: 'styles/main.scss'});
  fs.mkdirSync('_site/css', {recursive: true});
  fs.writeFileSync('_site/css/main.css', cssContent.css);
}
fs.watch('styles', (event, filepath) => {
  console.log('Styles file changed', filepath);
  compileSass();
});
compileSass();
```

This a a very simple approach without asynchronous code or anything. The only package you need is the npm sass package. They even write that "renderSync() is more than twice as fast as render()" ([SASS npm package](https://www.npmjs.com/package/sass)), so you might consider if its worth for you introducing parallel execution.
