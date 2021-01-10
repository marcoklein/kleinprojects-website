---
title: Practical Vim Command Cheat Sheet
date: 2021-01-10
tags:
  - Vim
---

### Surround with brackets

Select with `visual mode`.

Use

```
c()<Esc>P
```

## Visual mode

Visual mode for lines (Visual Line mode)

```
V
```

Visual mode for characters

```
v
```

## Leave insert mode

```
Ctrl-C or ESC
```

# More movements

Insert line above

```
O
```

Insert line below

```
o
```

Paste above

```
P
```

Paste below

```
p
```

Search

```
/
```

Hop through results: `n` reverse: `N`

Go to next occurrence: `*` reverse: `#`

# Horizontal Movement

Find and select character

```
f / F <character>
```

Find and not select character

```
t / T <character>
```

Example combo with d

```
df <character>
```

> Delete until `<character>`

# Delete and insert

Delete character

```
x / X
```

Delete character and enter insert mode

```
s
```

Delete line and enter insert mode

```
S
```
