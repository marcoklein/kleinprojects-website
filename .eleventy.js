const fs = require('node:fs');
const path = require('node:path');
const moment = require('moment');
const syntaxhighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const pluginRss = require('@11ty/eleventy-plugin-rss').default;
const striptags = require('striptags');

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

  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy({
    './node_modules/@picocss/pico/css/pico.min.css': 'css/pico.min.css',
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

  eleventyConfig.addPlugin(syntaxhighlight);

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

  // excerpts - use filter instead of shortcode to avoid templateContent timing issues
  eleventyConfig.addFilter('excerpt', function (content) {
    if (!content) return '';
    const excerpt = striptags(content)
      .substring(0, 200) // Cap at 200 characters
      .replace(/^\s+|\s+$|\s+(?=\s)/g, '')
      .trim();
    return excerpt ? excerpt + '...' : '';
  });

  // configuration object
  return {
    dir: {
      input: 'src',
    },
    jsDataFileSuffix: '.data',
  };
};

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
      `<div class="project-card">` +
      `<img class="is-absolute" src="${dynamicCoverImagePath}" alt="">` +
      `<img class="is-hidden-on-hover" src="${staticCoverImagePath}" alt="">` +
      `</div>`
    );
  } else {
    return `<img src="${staticCoverImagePath}" alt="">`;
  }
}


