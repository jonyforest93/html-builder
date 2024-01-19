const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

console.log(folderPath);

async function getAllFile(folderPath) {
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  console.log('-------------------------');
  for (let i = 0; i < files.length; i += 1) {
    if (files[i].isDirectory()) {
      continue;
    }
    const fileName = files[i].name;
    const filePath = path.join(folderPath, fileName);

    const stat = await fs.stat(filePath);

    const name = path.parse(fileName).name;
    const fileExt = path.extname(filePath).replace(/\./g, '');
    const fileSize = stat.size;

    console.log(`${name} - ${fileExt} - ${fileSize}bytes`);
    console.log('-------------------------');
  }
}

getAllFile(folderPath);
