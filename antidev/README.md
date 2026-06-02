# devtools-blocker.js

A lightweight, single-file JavaScript script that blocks the majority of DevTools open attempts in browsers. Drop it into any webpage to deter casual and intermediate inspection of your client-side code.

> **Note:** No JS-based blocker is unbreakable. This script stops ~99% of casual/intermediate attempts. A determined expert with low-level browser access can still bypass it.

---

## Usage

Add the script to your `<head>` **before** any other scripts, so it runs as early as possible:

```html
<head>
  <script src="https://raw.githubusercontent.com/andy-and-terry/littleplugins/refs/heads/plugins-data/antidev/antidev.js"></script>
  <!-- rest of your scripts -->
</head>
```

---

## Detection Methods

### 1. Window Size Gap
Compares `outerWidth/Height` (full browser window) against `innerWidth/Height` (viewport). A large gap indicates a DevTools panel is docked inside the window.

- ✅ Catches: docked DevTools in Chrome, Edge, Safari

### 2. Console Timing
Logs a specially crafted object with a getter on `.toString`. Chrome evaluates the getter lazily — only when the Console panel renders it — causing a measurable delay when the panel is open.

- ✅ Catches: Chrome/Edge with Console panel open

### 3. Debugger Timing
Runs a short loop containing `debugger` statements and measures elapsed time. With no debugger attached, this takes nanoseconds. With one attached, execution pauses or slows significantly.

- ✅ Catches: any browser with a JS debugger actively attached

### 4. Keyboard Shortcut Interception
Blocks the most common hotkeys used to open DevTools:

| Shortcut | Action blocked |
|---|---|
| `F12` | DevTools toggle |
| `Ctrl/Cmd + Shift + I` | Inspector panel |
| `Ctrl/Cmd + Shift + J` | Console panel |
| `Ctrl/Cmd + Shift + C` | Element picker |
| `Ctrl/Cmd + U` | View page source |
| `Ctrl/Cmd + S` | Save page |

### 5. Console Profiles Check
Checks `console.profiles.length` — some Chrome versions populate this array when the profiler is active. Quick opportunistic check.

### 6. toString Burst Trap
Overrides `Function.prototype.toString` and counts how many times it's called within a single event-loop tick. DevTools tends to call it in rapid bursts when expanding objects in the console.

---

## License

MIT — use freely, modify as needed.
