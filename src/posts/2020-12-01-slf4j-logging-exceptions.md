---
title: Logging Exceptions with SLF4J
date: 2020-12-01
tags:
  - java
---

Exception logging in SLF4J works without including it in the format:

```java
logger.error("An exception occured", new Exception("my exception"));
```

As opposed to the `{}` format notation.
