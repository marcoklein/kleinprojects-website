---
tags: ['eleventy', 'coding', 'blog', 'minimalistic']
title: Clearing the _site directory in Eleventy automatically
---

If you want to ensure an always up to date version, with all files being removed you might want to clear your `_site` directory before each build. This needs no further packages then the already built in [fs package](https://nodejs.org/api/fs.html) of node. The function `rmdirSync(folderPath, {recursive:true}) can accomplish excactly this.

Your .eleventy.js then looks like this:

``` javascript
const fs = require('fs');

// clear site on initial build
fs.rmdirSync('_site', {recursive: true});
console.log('Cleared _site folder');
```

> Note that we do not export a function as you would normally do it. This is, because we want to **run the folder deletion only once per build or serve**!

That means, that this code does not block our subsequent building pipeline. However, when you run Eleventy with `eleventy serve` you might end up with unwanted files in the end. So always remember to run `eleventy build` before publishing your site and you will always get a clean version.
