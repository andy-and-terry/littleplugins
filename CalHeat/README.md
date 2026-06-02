# CalHeat

GitHub-style contribution calendar heatmap.

## Install
```html
<script src="calheat.js"></script>
```

## Usage
```js
const { CalHeat } = window.CalHeat || require('./calheat');
const cal = new CalHeat('#container', {
  weeks: 52,
  colors: ['#1a1a2e','#1f4068','#1b6ca8','#1e90ff','#4fc3f7'],
  cellSize: 13
});

// Set data: { 'YYYY-MM-DD': count }
cal.setData({
  '2025-11-01': 3,
  '2025-11-05': 7,
  '2025-11-10': 12,
});

cal.render();
```

## Set individual days
```js
cal.setDay('2025-12-25', 5);
cal.render();
```

## Click callback
```js
const cal = new CalHeat('#el', {
  onDayClick: (date, value) => console.log(date, value)
});
```

## License
MIT