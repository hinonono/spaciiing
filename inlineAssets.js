// 自製程式碼。負責將HTML/CSS/JS整合在一起
// 由於Figma不支援在Plugin執行時動態將程式碼插入，所以會導致React不能夠使用
// 因此需要在執行完 npm run build以後，執行本程式碼，將bundle.js的內容手動插入最終程式碼中
const fs = require("fs");

// Read source files
const html = fs.readFileSync("dist/index.html", "utf-8");
const css = fs.readFileSync("src/app.css", "utf-8");
const js = fs.readFileSync("dist/bundle.js", "utf-8");

// Inline CSS into HTML
let inlinedHtml = html;

inlinedHtml = inlinedHtml.replace("</head>", `<style>${css}</style></head>`);
inlinedHtml = inlinedHtml.replace("</body>", `<script>${js}</script></body>`);

// Write the inlined HTML to the output file
fs.writeFileSync("dist/index.html", inlinedHtml);

console.log("✅HTML, CSS, JS檔案都已經被打包至 dist/index.html!");
