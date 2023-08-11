---
title: Practical Vim Command Cheat Sheet
date: 2021-01-10
tags:
  - vim
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

# Vertical Movement

Move to top

```
H
```

Move to bottom

```
L
```

Move to middle

```
M
```

# Search and replace

Search for all occurrences of foo and replace with bar after confirmation

```bash
:%s/foo/bar/gc
```

# Navigation

Open finder

```
:e <folder>
```

Jump between two last buffers

```
Ctrl + ^
```

Set mark with

```
m <letter>
```

Set global mark with

```
m <Shift + letter>
```

# Splits

All under `Ctrl + W` are window controls.

Vertical

```
Ctrl + W v
```

Horizontal

```
Ctrl + W s
```

Equal split

```
Ctrl + W =
```

Resize horizontally

```
:resize 10
```

Resize vertically

```
:vertical resize 20
```
