const fs = require('fs');
const path = require('path');

// console.log(path.dirname(__dirname));
const textPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(textPath, 'utf-8');
let data = '';
stream.on('data', (chunk) => (data += chunk));
stream.on('end', () => console.log(data));
