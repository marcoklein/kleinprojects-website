---
title: Ideas
unlisted: true
---

# Generating a Dynamic Cover Image with Eleventy
```js

  eleventyConfig.addFilter('coverImage', function(page) {
    // take filePathStem or pageOptions directly if it is a string (and a path)
    var pageOptions = typeof pageOptions === 'string' ? page : page.filePathStem;
    return path.join(path.dirname(pageOptions), page.data.coverImageName);
  });

  /**
   * Generates a dynamic cover image
   */
  eleventyConfig.addShortcode('dynamicImageOnHover', function(page, staticCoverImage, dynamicCoverImage) {
    const pageInputDir = path.dirname(page.inputPath);
    const staticCoverImageInputPath = path.join(pageInputDir, staticCoverImage);
    const dynamicCoverImageInputPath = path.join(pageInputDir, dynamicCoverImage);
    const baseDir = page.url;
    const staticCoverImagePath = path.join(baseDir, staticCoverImage);
    const dynamicCoverImagePath = path.join(baseDir, dynamicCoverImage);

    if (!fs.existsSync(staticCoverImageInputPath)) {
      throw new Error(`Static cover image not found. path=${staticCoverImageInputPath}`);
    }
    if (fs.existsSync(dynamicCoverImageInputPath)) {
      // dynamic cover image exists
      return `<img class="is-absolute" src="${dynamicCoverImagePath}">`
        + `<img class="is-hidden-on-hover" src="${staticCoverImagePath}">`
    } else {
      return `<img src="${staticCoverImagePath}">`
    }
  });
```