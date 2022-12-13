---
tags: [impromat]
title: Reflection on making Impromat accessible for search engines
date: 2022-12-13
---

The following is a note to myself to reflect on options for making a current personal project [Impromat](https://impromat.app) ready for search engines.

## Background

Impromat is a single page application (SPA) and currently hosted on https://impromat.app. However, this comes with several issues:

1. It's challenging to deal with search engine optimizations (SEO). As [this article](https://web.dev/rendering-on-the-web/) from Google describes you can assume that crawlers cannot process JavaScript and thus cannot process SPAs.
2. In the future a login might be required. Then it's not possible to "just share" anymore, however, sharing workshops is still one core feature of the Impromat.

## Possible Solutions

### Combine SEO optimization within the application

This means, that the backend would have to implement some kind of server side rendering (SSR) to allow the delivery of pre-rendered HTML that search engines could parse. There is [another article](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering) from Google that also mentions an,unfortunately discouraged, approach called _dynamic rendering_. With this approach the web server would send a different, SEO optimized result to web-crawlers.

Google also provides a very good discussion in [this article](https://web.dev/rendering-on-the-web/) about the options and their advantages and disadvantages.

### Separate the application page from a SEO optimized landing page

Another approach would be the separation of the actual application that users access, and a separate landing page that can act as a representation within the world wide web. From SEO perspectives this would be an ideal case because a well optimized, dedicated web server could host the respective landing page and link to the Impromat application. However, this also adds another service and another application that needs maintenance.

## Conclusion

Both approaches got advantages and disadvantages. I have to reflect on the goals in regards to SEO and future development of the Impromat.
