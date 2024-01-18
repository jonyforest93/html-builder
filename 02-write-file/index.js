const { stdin } = require('process');
const fs = require('fs');
const path = require('path');

const pathTextFile = path.join(__dirname, 'text.txt');

console.log(
  'Hello! You can write text that will be placed in the file text.txt',
);
console.log('To exit the program, click Ctrl + C or write "exit"');

fs.writeFile(pathTextFile, '', 'utf-8', (err) => {
  if (err) {
    console.log(err);
  }
});

const writeStream = fs.createWriteStream(pathTextFile, {
  flags: 'a',
  encoding: 'utf-8',
});

writeStream.on('finish', () => {
  console.log('Data writing completed.');
  process.exit();
});

stdin.on('data', (data) => {
  const input = data.toString();
  if (input.trim().toLowerCase() === 'exit') {
    writeStream.end();
  } else if (!writeStream.writableEnded) {
    writeStream.write(input, 'utf-8');
  }
});

process.on('SIGINT', () => {
  if (!writeStream.writableEnded) {
    writeStream.end();
  }
});

process.on('exit', () => {
  console.log('Goodbye');
});
