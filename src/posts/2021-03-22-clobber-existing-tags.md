---
title: Resolve tag clobber
date: 2021-02-08
tags: [git]
---

If you got conflicting tags force pull the latest tags from your remote.
```bash
> git pull --tags origin develop
From github.com:name/repo
 * branch            develop    -> FETCH_HEAD
 ! [rejected]        0.1.177    -> 0.1.177  (would clobber existing tag)
 ! [rejected]        0.1.179    -> 0.1.179  (would clobber existing tag
```
Resolve with

```bash
git fetch --tags -f
```