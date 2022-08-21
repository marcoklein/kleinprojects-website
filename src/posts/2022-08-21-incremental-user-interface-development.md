---
title: Incremental User Interface Development
date: 2022-08-21
tags: [project]
---

Developing a cool user interface can be really hard. It starts with the "what does the user *actually* wants to do?"-challenge and involves questions like "where does does the user wants to access the application?". The answer is often that neither you nor your user really knows what they want.

Recently, I had to deal quite often with this "user interface challenge" and how to develop and effective approach to develop a cool app that solves exactly the problem a user is facing. Therefore, I tried to take a step back and observe my approach to frontend development.

Initially, I observed, that I would spend tons of time looking and reading through new UI frameworks that would fit my need. And then there is a difference between the (1) *UI* framework and the (2) *frontend framework*. (1) is a library for the actual styling, like Bootstrap, Evergreen, Onsen UI, ... and (2) is a library that helps with the implementation of logic and state, like Angular, Vue, or React.

So, for the *frontend framework* I would just pick whatever which is mostly React right now. The challenge is (1), the *UI* framework because there are sooo many different frameworks and lots of advantages and disadvantages. E.g. if you want to build a hybrid app you might use Onsen UI, if you use React components only you might want to use Evergreen, or Material UI, there are old frameworks that still persist like Bootstrap. Simply too many to evaluate all options before even designing.

So how could I avoid spending all that time reading through pros and cons for individual UI frameworks? The answer is simple:

> Do not use a UI framework :)

To be more precise:

> Do not incorporate a UI framework if you are still exploring what your application should actually do.

What does this mean?

It means starting with the most basic components that HTML has to offer. If you need an input, use `<input>`. If you need a card use a `<div>` with some `border` property set.

With this approach I am able to push the UI framework decision to the future as long as possible and can rather ship working prototypes that I can quickly evaluate with end users to build a better product and eventually choose the UI framework that fits.

