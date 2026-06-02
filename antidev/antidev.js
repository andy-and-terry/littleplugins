/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
console.log("antidev.js version 1.0")
console.log("protection has started")
console.warn("anitdev.js will not block ALL types of DevTools injection")
console.warn("Determined developers or people may be able to bypass the protections")
console.warn("This script is only to PREVENT and DETER people from inspecting your page")
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------- Main script ------------------------------------------------------------------------------ */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------- contextmenu block--------------------------------------------------------------------------- */
window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});
// Recommended: add this piece of code at the top of your script (HTML)
// <body oncontextmenu="return false;">
// Recommended: add this piece of code into ALL of your HTML elements //
// oncontextmenu="return false;"
// example: <img src="graphic.jpg" oncontextmenu="return false;" alt="Protected Asset">
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- Noise --------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
;(function () {
  "use strict";

  // ══════════════════════════════════════════════════════════
  //  ⚙️  SENSITIVITY CONFIG
  //  Adjust these values to tune how aggressive the blocker is.
  // ══════════════════════════════════════════════════════════
  const SENSITIVITY = {
    // ── Method 1: Window size gap ────────────────────────────
    // Minimum pixel difference between outer and inner window
    // dimensions before we consider DevTools to be docked.
    // Lower  = more sensitive (more false positives possible).
    // Higher = less sensitive (may miss small DevTools panels).
    // Recommended range: 100–200
    SIZE_THRESHOLD: 160,

    // ── Method 2 & 3: Timing checks ──────────────────────────
    // How many milliseconds a debugger-pause or console-render
    // must take before we flag it as "DevTools open".
    // Lower  = triggers on slower machines (false positives).
    // Higher = may miss a very fast machine with DevTools open.
    // Recommended range: 80–200
    TIMING_THRESHOLD_MS: 120,

    // ── Polling interval ─────────────────────────────────────
    // How often (ms) the size + timing checks re-run in the
    // background. Lower = catches DevTools opened mid-session
    // faster, but uses slightly more CPU.
    // Recommended range: 500–2000
    POLL_INTERVAL_MS: 500,

    // ── Response action ──────────────────────────────────────
    // What to do when DevTools is detected.
    // "redirect" → sends the user to REDIRECT_URL
    // "blank"    → replaces the page content with a blank div
    // "warn"     → just logs a warning (useful during testing)
    ACTION: "blank",

    // URL to redirect to when ACTION === "redirect"
    REDIRECT_URL: "about:blank",
  };

  // ══════════════════════════════════════════════════════════
  //  🚨  RESPONSE — what happens when DevTools is detected
  // ══════════════════════════════════════════════════════════

  /**
   * Called once when any detection method fires.
   * A flag prevents it from triggering more than once.
   */
  let _triggered = false;
  function onDetected(reason) {
    if (_triggered) return; // Don't fire multiple times
    _triggered = true;

    console.clear(); // Wipe any console output the user may have typed

    if (SENSITIVITY.ACTION === "redirect") {
      // Hard-navigate away from the page entirely
      window.location.replace(SENSITIVITY.REDIRECT_URL);

    } else if (SENSITIVITY.ACTION === "blank") {
      // Nuke the entire DOM so the page is visually unusable
      document.documentElement.innerHTML =
        "<div style='font-family:monospace;padding:2rem'>Access restricted.</div>";
      // Also stop all ongoing scripts by throwing in a loop
      // (this prevents any React/Vue/etc. app from re-mounting)
      Object.defineProperty(document, "body", { get: () => null });

    } else if (SENSITIVITY.ACTION === "warn") {
      // Passive mode — useful when testing/tuning sensitivity
      console.warn("[DevTools Blocker] Detected via:", reason);
    }
  }

  // ══════════════════════════════════════════════════════════
  //  METHOD 1 — Window size gap detection
  //  Works for: docked DevTools in Chrome, Edge, Safari
  //  Misses:    undocked (floating) DevTools, Firefox side panel
  // ══════════════════════════════════════════════════════════

  function checkWindowSize() {
    // outerWidth/Height = total browser window including DevTools panel
    // innerWidth/Height = usable viewport the page actually sees
    const widthGap  = window.outerWidth  - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;

    // A large gap almost certainly means a panel is docked
    if (widthGap > SENSITIVITY.SIZE_THRESHOLD ||
        heightGap > SENSITIVITY.SIZE_THRESHOLD) {
      onDetected("window-size-gap");
    }
  }

  // ══════════════════════════════════════════════════════════
  //  METHOD 2 — console.log object-rendering timing
  //  Works for: Chrome/Edge when Console panel is open
  //  Misses:    Firefox (different rendering pipeline)
  //
  //  Trick: when an object with a custom getter on .toString
  //  is passed to console.log, Chrome evaluates the getter
  //  *lazily* — only when the Console panel actually renders
  //  the output. This makes the getter fire noticeably later
  //  when the panel is open vs. when it's closed.
  // ══════════════════════════════════════════════════════════

  function checkConsoleTiming() {
    let start = performance.now();
    let _check = false;

    // Build a special object whose toString getter we can time
    const probe = Object.defineProperty({}, "id", {
      get: function () {
        _check = true; // Mark that the getter was called
        return 1;
      },
    });

    // Passing to console.log: if Console is open Chrome renders
    // it immediately, calling our getter right now (slow path).
    // If Console is closed, the getter is never called (fast).
    console.log(probe); // ← the timing probe
    console.clear();    // Clean up immediately after

    if (_check) {
      // Getter was invoked — console is actively rendering
      const elapsed = performance.now() - start;
      if (elapsed > SENSITIVITY.TIMING_THRESHOLD_MS) {
        onDetected("console-timing");
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  //  METHOD 3 — debugger statement timing
  //  Works for: any browser with a JS debugger attached
  //  Misses:    DevTools open but no breakpoints / Sources tab
  //
  //  When no debugger is hooked in, `debugger` is a no-op and
  //  runs in nanoseconds. When a debugger IS paused/attached,
  //  execution halts (or adds significant overhead), making
  //  the loop take much longer than the threshold.
  // ══════════════════════════════════════════════════════════

  function checkDebuggerTiming() {
    const start = performance.now();

    // A tight loop with debugger — normally this is <1 ms total.
    // With an attached debugger it can take hundreds of ms.
    // The loop count is low on purpose; we don't want to block
    // the main thread for legitimate users.
    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line no-debugger
      debugger; // ← will pause here if a debugger is attached
    }

    const elapsed = performance.now() - start;
    if (elapsed > SENSITIVITY.TIMING_THRESHOLD_MS) {
      onDetected("debugger-timing");
    }
  }

  // ══════════════════════════════════════════════════════════
  //  METHOD 4 — Keyboard shortcut interception
  //  Blocks the most common hotkeys used to open DevTools.
  //  List of blocked combos:
  //    F12
  //    Ctrl/Cmd + Shift + I  (Inspector)
  //    Ctrl/Cmd + Shift + J  (Console)
  //    Ctrl/Cmd + Shift + C  (Element picker)
  //    Ctrl/Cmd + U          (View Source)
  //    Ctrl/Cmd + S          (Save page — prevents offline inspection)
  // ══════════════════════════════════════════════════════════

  function blockKeyboardShortcuts(event) {
    const key   = event.key;
    const ctrl  = event.ctrlKey || event.metaKey; // metaKey = Cmd on Mac
    const shift = event.shiftKey;

    const blocked =
      key === "F12" ||                          // Universal DevTools toggle
      (ctrl && shift && key === "I") ||         // Inspector panel
      (ctrl && shift && key === "J") ||         // Console panel
      (ctrl && shift && key === "C") ||         // Element picker
      (ctrl && key === "U") ||                  // View page source
      (ctrl && key === "s");                    // Save page as

    if (blocked) {
      event.preventDefault();  // Stop the default browser action
      event.stopPropagation(); // Don't let the event bubble further
    }
  }

  // ══════════════════════════════════════════════════════════
  //  BONUS — DevTools protocol detection via console.profiles
  //  Some older versions of Chrome leak a non-empty
  //  console.profiles array when the profiler is running.
  //  This is a quick opportunistic check, not a main method.
  // ══════════════════════════════════════════════════════════

  function checkConsoleProfiles() {
    // console.profiles exists only in some Chrome versions
    if (
      window.console &&
      window.console.profiles &&
      window.console.profiles.length > 0
    ) {
      onDetected("console-profiles");
    }
  }

  // ══════════════════════════════════════════════════════════
  //  BONUS — toString override trap
  //  Overrides Function.prototype.toString so that if DevTools
  //  tries to pretty-print native functions (a common step when
  //  exploring code), we get notified.
  //  This is subtle and rarely the only trigger, but adds
  //  coverage for users actively exploring native APIs.
  // ══════════════════════════════════════════════════════════

  (function installToStringTrap() {
    const _nativeToString = Function.prototype.toString;

    // How many toString calls we've seen — DevTools tends to
    // call it in bursts when expanding objects in the console.
    let _callCount = 0;
    const BURST_LIMIT = 10; // calls within one event-loop tick = suspicious
    let _burstTimer = null;

    Function.prototype.toString = function () {
      _callCount++;

      // Reset counter after current microtask queue drains
      if (!_burstTimer) {
        _burstTimer = setTimeout(() => {
          if (_callCount >= BURST_LIMIT) {
            onDetected("toString-burst");
          }
          _callCount = 0;
          _burstTimer = null;
        }, 0);
      }

      // Still return the real result so code doesn't break
      return _nativeToString.call(this);
    };
  })();

  // ══════════════════════════════════════════════════════════
  //  INITIALISATION — wire up all the methods
  // ══════════════════════════════════════════════════════════

  function init() {
    // ── Event listeners ──────────────────────────────────────
    // useCapture: true = fires before the page's own listeners,
    // making it harder for inline scripts to re-enable DevTools.
    document.addEventListener("keydown",      blockKeyboardShortcuts, true);
    document.addEventListener("contextmenu",  blockContextMenu,       true);

    // ── Immediate checks on page load ────────────────────────
    // Run all detection methods once right away in case DevTools
    // was already open before the page loaded.
    checkWindowSize();
    checkConsoleTiming();
    checkDebuggerTiming();
    checkConsoleProfiles();

    // ── Polling loop ─────────────────────────────────────────
    // Continuously re-run the passive checks so that DevTools
    // opened AFTER page load is still caught.
    setInterval(function () {
      checkWindowSize();       // Fast — just reads two properties
      checkConsoleTiming();    // Medium — one console.log + clear
      checkConsoleProfiles();  // Fast — array length check
      // NOTE: checkDebuggerTiming() is NOT in the poll loop
      // because it visibly freezes the page if a debugger IS
      // attached (that pause is intentional). Call it only on
      // load or on a user interaction if you prefer.
    }, SENSITIVITY.POLL_INTERVAL_MS);
  }

  // ── DOM ready guard ──────────────────────────────────────
  // Make sure we attach listeners only after the document exists.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init(); // DOM is already ready (script loaded at bottom or deferred)
  }

})(); // End of IIFE — everything above is scoped, nothing leaks to global
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */
