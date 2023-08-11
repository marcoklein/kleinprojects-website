const sass = require('sass');
const fs = require('node:fs');
const path = require('node:path');
const moment = require('moment');
const syntaxhighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const striptags = require('striptags');
const upgradeHelper = require('@11ty/eleventy-upgrade-help');

// install prism plugins
require('prismjs/plugins/custom-class/prism-custom-class');

const REGEX_IMAGE_EXTENSION = '(jpg|png|gif)';

/**
 * Restart program if you change configs!
 */
module.exports = function (eleventyConfig) {
  // clear site on initial build
  if (fs.existsSync('_site')) {
    fs.rmSync('_site', { recursive: true });
  }
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

  eleventyConfig.addPassthroughCopy({
    './node_modules/@fortawesome/fontawesome-free': 'css/fontawesome',
  });
  eleventyConfig.addPassthroughCopy('src/CNAME');
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy(
    `src/projects/**/*.${REGEX_IMAGE_EXTENSION}`
  );
  eleventyConfig.addPassthroughCopy({ webconfig: './' });

  // Filter source file names using a glob
  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('src/posts/*.md')
      .filter(item => !item.data.unlisted)
      .reverse();
  });

  eleventyConfig.addCollection('projects', function (collectionApi) {
    return collectionApi.getFilteredByGlob('src/projects/**/*.md').reverse();
  });

  eleventyConfig.addPlugin(syntaxhighlight, {
    init: function ({ Prism }) {
      Prism.plugins.customClass.map({
        // prefix tag and number to avoid conflicts with Bulma
        tag: 'prism-tag',
        number: 'prism-number',
      });
    },
  });

  eleventyConfig.addFilter('coverImage', filterCoverImage);

  /**
   * Generates a dynamic cover image
   */
  eleventyConfig.addShortcode(
    'dynamicImageOnHover',
    shortcodeDynamicImageOnHover
  );

  /** Return year of today */
  eleventyConfig.addShortcode('currentYear', function () {
    return moment().format('YYYY');
  });

  eleventyConfig.addFilter('formatDate', function (date) {
    return moment(date).format('MMMM YYYY');
  });

  eleventyConfig.addFilter('datetime', function (date) {
    return moment(date).format('YYYY-MM-DD');
  });

  // generate anchor ids of headings
  const markdownLib = markdownIt({ html: true }).use(markdownItAnchor);
  eleventyConfig.setLibrary('md', markdownLib);

  // generate Atom (RSS feed)
  eleventyConfig.addPlugin(pluginRss);

  // general config
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    exerpt_separator: '<!-- excerpt -->',
  });
  eleventyConfig.addWatchTarget('src/**/*.md');

  // excerpts
  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

  // configuration object
  return {
    dir: {
      input: 'src',
    },
    jsDataFileSuffix: '.data',
  };
};

/**
 * Extract excerpt from first paragraph of document.
 *
 * @param article
 * @returns
 */
function extractExcerpt(article) {
  if (!article.hasOwnProperty('templateContent')) {
    console.warn(
      'Failed to extract excerpt: Document has no property "templateContent".'
    );
    return null;
  }

  let excerpt = null;
  const content = article.templateContent;

  excerpt = striptags(content)
    .substring(0, 200) // Cap at 200 characters
    .replace(/^\\s+|\\s+$|\\s+(?=\\s)/g, '')
    .trim()
    .concat('...');
  return excerpt;
}

async function compileSass() {
  console.log('Compiling sass.');
  const cssContent = sass.compile('src/styles/main.scss');
  fs.mkdirSync('_site/css', { recursive: true });
  fs.writeFileSync('_site/css/main.css', cssContent.css);
}

function shortcodeDynamicImageOnHover(
  page,
  staticCoverImage,
  dynamicCoverImage
) {
  const pageInputDir = path.dirname(page.inputPath);
  const staticCoverImageInputPath = path.join(pageInputDir, staticCoverImage);
  const dynamicCoverImageInputPath = path.join(pageInputDir, dynamicCoverImage);
  const baseDir = page.url;
  const staticCoverImagePath = path.join(baseDir, staticCoverImage);
  const dynamicCoverImagePath = path.join(baseDir, dynamicCoverImage);

  if (!fs.existsSync(staticCoverImageInputPath)) {
    throw new Error(
      `Static cover image not found. path=${staticCoverImageInputPath}`
    );
  }
  if (fs.existsSync(dynamicCoverImageInputPath)) {
    // dynamic cover image exists
    return (
      `<img class="is-absolute" src="${dynamicCoverImagePath}">` +
      `<img class="is-hidden-on-hover" src="${staticCoverImagePath}">`
    );
  } else {
    return `<img src="${staticCoverImagePath}">`;
  }
}

function filterCoverImage(page) {
  // take filePathStem or pageOptions directly if it is a string (and a path)
  var pageOptions = typeof pageOptions === 'string' ? page : page.filePathStem;
  return path.join(path.dirname(pageOptions), page.data.coverImageName);
}
