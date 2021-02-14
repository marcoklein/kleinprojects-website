---
title: Typescript Cheat Sheet
date: 2021-01-09
unlisted: true
---

# Decorators

Can be attached to

- class
- class method
- class property
- class method parameter

Benefits

- logging, e.g. `@deprecated`

## Class decorators

```ts
function decorator(options: { prop: string }) {
  // target is our class prototype
  return target => {
    // ...
  };
}

@decorator({
  prop: 'foo',
})
class MyClass {
  // ...
}
```

## Class Method
