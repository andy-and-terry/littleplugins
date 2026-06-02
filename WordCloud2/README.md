# WordCloud2

Canvas word cloud with spiral placement and collision detection.

## Install
```html
<script src="wordcloud2.js"></script>
```

## Usage
```js
const { WordCloud } = WordCloud2;

const cloud = new WordCloud('#canvas', {
  minSize: 12,
  maxSize: 60,
  bgColor: '#0d0d1a',
  colors: ['#4af','#f84','#4f8','#f4a']
});

cloud.setData([
  { text: 'JavaScript', weight: 100 },
  { text: 'Python',     weight: 85 },
  { text: 'Rust',       weight: 60 },
  { text: 'Go',         weight: 55 },
  { text: 'TypeScript', weight: 90 },
]);

cloud.render();
```

## License
MIT