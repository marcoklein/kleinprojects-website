---
title: Vim for Firefox
date: 2020-12-07
---
[Tridactyl](https://github.com/tridactyl/tridactyl) is a firefox extension to enable vim keybindings for a more efficient browsing experience.


Go back to tutor
```
:tutor
```

### Modes
* Normal mode
* Hint mode
    * Enter with `f`
* Visual mode
    * Enter with `v`, `;h`, `/`
    * Search via `s`, `S`
    * Exit via `Esc`, `<Ctr-[>`
* Command mode
    * Enter with `:`
    * Exit with `Esc`, `Enter`
* Ignore mode
    * Pass through key events
    * Toggle with `Shift-Insert`, `Ctrl-Alt-Escape`, `Ctrl-Alt-Backtick`, `Shift-Esc`

### Normal mode
Scroll with `h`, `j`, `k`, `l`.

Go to top with `gg`.

Got to bottom with `G`.

Go back in history with `H` and forward with `L`.

Use `.` to repeat the last action.

Open new tab with `t`.

Open hinting mode to open tab in background use `F` (use `f` to open it in same window).

Focus first textbox on page with `gi`. Switch textboxes with `tab`.

#### Useful commands
Bring up list of tabs with `b`. Use `Tab`, `Shift-Tab` to cycle through them.

Open web pages:
* `w` open in new window
* `o` in current tab
* `t` in new tab
* Use capital letters to open current URL
* `s` search
* start search query with search engine like `duckduckgo`, or `google`.

Use `yy` to copy current URL.

Use `p` to open clipboard content as a webpage. Use `P` to open in a new tab.
* Quickly search for source of a quote with `;p` to copy a paragraph and `P` to search it

Use `zi`, `zo`, `zz` to zoom in, out, and to reset zoom.

Search with `/`. Navigate through matches with `Ctrl-g`, `Ctrl-G`.

Use `Ctrl-v` to send next keystroke to website.

To check what a binding is doing type `:bind [keys]`.

