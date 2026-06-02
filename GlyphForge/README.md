# GlyphForge

Procedural glyph and rune renderer on canvas with glow effects and composition.

## Install
```html
<script src="glyphforge.js"></script>
```

## Draw a glyph
```js
const { drawGlyph } = GlyphForge;

// drawGlyph(ctx, name, x, y, size, options)
drawGlyph(ctx, 'rune_star', 200, 200, 60, {
  color: '#4af',
  lineWidth: 2,
  glow: 12,    // glow radius (0 = none)
  circle: true // draw enclosing circle
});
```

## Built-in glyphs
`rune_A` `rune_E` `rune_star` `rune_cross` `rune_arrow` `sigil_eye` `sigil_spiral`

## Register custom glyph
```js
const { register } = GlyphForge;

// Each segment: [x1, y1, x2, y2] in 0–1 space
register('my_glyph', [
  [0.5, 0,   0.5, 1  ],
  [0,   0.5, 1,   0.5],
  [0,   0,   1,   1  ],
]);
```

## Compose a sigil from multiple glyphs
```js
const { compose } = GlyphForge;

compose(ctx, ['rune_star', 'rune_cross', 'sigil_eye'], 300, 300, 100, {
  color: '#f84',
  glow: 16,
  outerCircle: true
});
```

## License
MIT