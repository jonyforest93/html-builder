const fs = require('fs/promises');
const path = require('path');

const pathDist = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const outputFile = path.join(pathDist, 'bundle.css');

async function getStyleFiles(stylePath) {
  try {
    const files = await fs.readdir(stylePath);
    return files.filter((file) => {
      return path.extname(file) === '.css';
    });
  } catch (err) {
    console.log('Error reading file: ', err);
  }
}

async function concatStyles(files) {
  let stylesText = '';

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(stylesPath, files[i]);
    try {
      const styles = await fs.readFile(filePath, 'utf-8');
      stylesText = stylesText + styles + '\n';
    } catch (err) {
      console.log(`Error writing file: ${files[i]}`);
    }
  }
  return stylesText;
}

async function createBundleFile(bundlePath, content, encoding = 'utf-8') {
  try {
    await fs.writeFile(bundlePath, content, encoding);
    console.log(`Bundle is created`);
  } catch (err) {
    console.log(`Error creating file`);
  }
}

async function getBundleCSS() {
  const files = await getStyleFiles(stylesPath);
  const stylesContent = await concatStyles(files);
  await createBundleFile(outputFile, stylesContent, 'utf-8');
}

getBundleCSS();
