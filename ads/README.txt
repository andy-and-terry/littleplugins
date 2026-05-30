__        __   _                            _ 
\ \      / /__| | ___ ___  _ __ ___   ___  | |
 \ \ /\ / / _ \ |/ __/ _ \| '_ ` _ \ / _ \ | |
  \ V  V /  __/ | (_| (_) | | | | | |  __/ |_|
   \_/\_/ \___|_|\___\___/|_| |_| |_|\___| (_)
-----------------------------------------------
In this file, you will learn how to use the
HTML-compactible ads plugin [2026]
-----------------------------------------------
1. Setup
To setup this plugin, you will need to import
the CSS file into your HTML document.
[RECOMMENDED]:
<link rel="stylesheet" href="https://raw.githubusercontent.com/andy-and-terry/littleplugins/refs/heads/plugins-data/ads/styles.css">
[OFFLINE]
*download the file and use <link rel="stylesheet" href="styles.css">
-----------------------------------------------
2. Usage
To use this, you have to use the following
HTML element(s).

<!-- IMAGE -->
<div id="ad" class="card-warm">
  <div class="ad-media"><img src="photo.jpg" alt="..." /></div>
  <div class="ad-body">
    <p class="ad-label">Sponsored</p>
    <p class="ad-title">Your headline here</p>
    <p class="ad-desc">Short promo copy goes here.</p>
    <a class="ad-pill pill-amber" href="https://yoursite.com">Shop now</a>
  </div>
</div>

<!-- VIDEO -->
<div id="ad" class="card-dark">
  <div class="ad-media"><video autoplay muted loop playsinline src="clip.mp4"></video></div>
  <div class="ad-body">...</div>
</div>

<!-- TEXT ONLY (no ad-media div) -->
<div id="ad" class="card-warm">
  <div class="ad-body">...</div>
</div>

<!-- IFRAME -->
<div id="ad" class="card-navy">
  <div class="ad-media"><iframe src="https://embed.example.com"></iframe></div>
  <div class="ad-body">...</div>
</div>

[!] NOTE: THERE ARE MULTIPLE FORMATS FOR THE AD
          BOXES.
-----------------------------------------------
littleplugins 2026 • MIT license
