// 自製程式碼。負責將HTML 和CSS整合在一起
const fs = require('fs');

// Read source files
const html = fs.readFileSync('src/index.html', 'utf-8');
const css = fs.readFileSync('src/index.css', 'utf-8');
const js = fs.readFileSync('src/index.js', 'utf-8');

// Inline CSS into HTML
let inlinedHtml = html.replace('</head>', `<style>${css}</style></head>`);

// Inline JS into HTML
inlinedHtml = inlinedHtml.replace('</body>', `<script>${js}</script></body>`);

// Write the inlined HTML to the output file
fs.writeFileSync('dist/ui.html', inlinedHtml);

console.log('CSS and JS have been inlined into ui.html');


