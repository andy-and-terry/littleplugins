# KeyCombo

Keyboard shortcut manager with conflict detection and built-in cheat sheet.

## Install
```html
<script src="keycombo.js"></script>
```

## Usage
```js
const { Manager } = KeyCombo;
const keys = new Manager();

keys.register('ctrl+s', e => {
  save();
}, { description: 'Save file', group: 'File' });

keys.register('ctrl+shift+p', e => {
  openCommandPalette();
}, { description: 'Command palette', group: 'View' });

// Show cheat sheet overlay
keys.register('?', () => keys.showCheatSheet(), { description: 'Show shortcuts' });
```

## Unregister
```js
const handler = e => doSomething();
keys.register('ctrl+k', handler);
keys.unregister('ctrl+k', handler);
```

## Enable / Disable all shortcuts
```js
keys.disable();
keys.enable();
```

## Get cheat sheet as data
```js
const sheet = keys.getCheatSheet();
// { 'File': [{ combo, description }], ... }
```

## License
MIT
