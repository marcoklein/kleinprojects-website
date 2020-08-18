
module.exports = {
  // default page title
  pageTitle: data => {
    const defaultTitle = `${data.site.title} - ${data.site.subtitle}`;
    const siteTitle = data.site.title;
    const pageTitle = data.title;

    if (pageTitle && pageTitle.length) {
      return pageTitle + ' | ' + siteTitle;
    }
    return defaultTitle;
  },
};