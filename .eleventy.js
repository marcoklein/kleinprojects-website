const sass = require('sass');
const fs = require('fs');

// clear site on initial build
fs.rmdirSync('_site', {recursive: true});
console.log('Cleared _site folder');

/**
 * Restart program if you change configs!
 */
module.exports = function(eleventyConfig) {

  const cssContent = sass.renderSync({file: 'styles/page.scss'});
  fs.mkdirSync('_site/css', {recursive: true});
  fs.writeFileSync('_site/css/page.css', cssContent.css);

  // Filter source file names using a glob
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md");
  });

};
