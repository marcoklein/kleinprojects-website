const sass = require('sass');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const syntaxhighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const REGEX_IMAGE_EXTENSION = '(jpg|png|gif)';

function compileSass() {
  console.log('Compiling sass.');
  const cssContent = sass.renderSync({file: 'src/styles/main.scss'});
  fs.mkdirSync('_site/css', {recursive: true});
  fs.writeFileSync('_site/css/main.css', cssContent.css);
}

/**
 * Restart program if you change configs!
 */
module.exports = function(eleventyConfig) {

  // clear site on initial build
  fs.rmdirSync('_site', {recursive: true});
  console.log('Cleared _site folder');
  
  const isServing = process.argv.includes('--serve');
  if (isServing) {
    // watch only files if we are serving
    fs.watch('src/styles', (event, filepath) => {
      console.log('Styles file changed', filepath);
      compileSass();
    });
  }
  compileSass();

  eleventyConfig.addPassthroughCopy({'./node_modules/@fortawesome/fontawesome-free': 'css/fontawesome'});
  eleventyConfig.addPassthroughCopy('src/CNAME');
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy(`src/projects/**/*.${REGEX_IMAGE_EXTENSION}`);

  // Filter source file names using a glob
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });
  
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/**/*.md").reverse();
  });

  eleventyConfig.addPlugin(syntaxhighlight);

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
      return `<img class="is-hidden-on-hover" src="${staticCoverImagePath}">`
           + `<img src="${dynamicCoverImagePath}">`
    } else {
      return `<img src="${staticCoverImagePath}">`
    }
  });
  

  eleventyConfig.addFilter('formatDate', function(date) {
    return moment(date).format('MMMM YYYY');
  });

  eleventyConfig.addWatchTarget('src/**/*.md');

  // configuration object
  return {
    dir: {
      input: 'src',
    },
    jsDataFileSuffix: '.data',
  };
};
