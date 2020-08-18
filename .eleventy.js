const sass = require('sass');
const fs = require('fs');
const syntaxhighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

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
    
  fs.watch('src/styles', (event, filepath) => {
    console.log('Styles file changed', filepath);
    compileSass();
  });
  compileSass();

  // Filter source file names using a glob
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });

  eleventyConfig.addPlugin(syntaxhighlight);

  // configuration object
  return {
    dir: {
      input: 'src',
    },
    jsDataFileSuffix: '.data',
  };
};
