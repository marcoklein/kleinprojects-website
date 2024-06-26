---
tags: ['eleventy']
title: My journey to using Eleventy as a static website generator
date: 2020-08-15
---

I started renting my first server something like 10 years ago back in school. Initially I merely used it to play around with some new technologies. While studying I launched my first websites including a small blog.

First I put together a website from scratch to post content into the world wide web. Then I tried out more advanced and feature rich systems like the [ghost blogging platform](https://ghost.org/). However, I always struggled with this one thing: updating the server.

I only published content and applications sporadically. Therefore, my server kept getting out of date and I killed it before trying to walk through a complex updating process. Often my blog posts and content got lost in that process.

So its now 2020 and again I killed my server as my last updates happened 2 years ago. Yes, initially I did backups and restored them on my new Ghost blog instance. However, now I am pursuing a more sustainable and lasting approach to keep stuff that I am working on online.

Of course I also considered hosted blogging platforms like [Medium](https://medium.com/). Nonetheless, I prefer hosting my own stuff and learning new things in the process.

# Static Websites

During my research of a better hosting alternative I stumbled across [GitHub Pages](https://pages.github.com/) that allows hosting of websites for free, with SSL encryption. After some investigation I considered this as a valid hosting option for my new website. Building a static website also had the benefit of changing hosting providers quickly as it is only a bunch of HTML and CSS files without the need of backend services.

# Templating Websites

Building a website with merely HTML and CSS is a pain when you consider the long run. You might want to change some things and have to update layout and styles at lots of different places. Therefore I decided to go with a templating engine. [Jekyll](https://jekyllrb.com/) was my first consideration as it is a very popular framework for static website generation. It uses Ruby under its hood and after setup and some tests I quickly figured out that this is not the language I want to host my websites with.

# Eleventy as Static Website Generator

As mostly work with front-end technologies like Typescript or Javascript I searched for an engine that uses excactly these technologies. That was when I discovered [Eleventy](https://www.11ty.dev/), a static website generator built with Javascript and using the [package manager NPM](https://www.npmjs.com/) for building.

# Getting used to Static Website Generators

As Eleventy is my first static website generator I have ever worked with, I started reading through the documentation and setting up a very simple website. There are lots of demo projects, however I decided to start from scratch to learn about that technology and all the features it has.

There are several things I already learned in the process: for example setting up basic fragments that can be reused in other templates, applying CSS, or building a basic post collection.

So I decided to build a new website from scratch. It should be minimal, show off projects that I am working on, and provide the capability of posting stuff from time to time. It should be easy to maintain (from a coders perspective) and last for a long time.
