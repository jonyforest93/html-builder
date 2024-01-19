const { mkdir } = require('fs');
const fs = require('fs/promises');
const path = require('path');

const folderDist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const stylePath = path.join(__dirname, 'styles');
const html = path.join(__dirname, 'template.thml');
const styleBundle = path.join(folderDist, 'style.css');
const htmlBundle = path.join(folderDist, 'index.html');
const assetsBundle = path.join(folderDist, 'assets');

(async () => {
  await fs.rm(folderDist, { recursive: true, force: true });
  await fs.mkdir(folderDist);
  await copyAssets(assets, assetsBundle);
  await getBundleCSS(stylePath, styleBundle);
  await buidHTML(htmlBundle, components);
})();

async function copyAssets(source, dest) {
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(source);

  for (let i = 0; i < files.length; i += 1) {
    const sourcePath = path.join(source, files[i]);
    const assetsPath = path.join(dest, files[i]);

    const stats = await fs.stat(sourcePath);
    if (stats.isDirectory()) {
      await copyAssets(sourcePath, assetsPath);
    } else {
      await fs.copyFile(sourcePath, assetsPath);
    }
  }
}

async function getBundleCSS(source, dest) {
  let stylesText = '';
  const files = await fs.readdir(source);
  const cssFiles = files.filter((file) => {
    return path.extname(file) === '.css';
  });
  for (let i = 0; i < cssFiles.length; i += 1) {
    const filePath = path.join(source, cssFiles[i]);
    const styles = await fs.readFile(filePath, 'utf-8');
    stylesText = stylesText + styles + '\n';
  }
  await fs.writeFile(dest, stylesText, 'utf-8');
}

async function getComponents(source) {
  const components = [];

  const files = await fs.readdir(source);
  for (let i = 0; i < files.length; i += 1) {
    const componentPath = path.join(source, files[i]);
    const pathInfo = path.parse(componentPath);
    const component = {
      // [pathInfo.name]: await fs.readFile(componentPath, 'utf-8'),
      name: pathInfo.name,
      layout: await fs.readFile(componentPath, 'utf-8'),
    };
    components.push(component);
  }
  return components;
}

async function buidHTML(dest, componentsPath) {
  const components = await getComponents(componentsPath);
  let basicHTML = (await fs.readFile(path.join(__dirname, 'template.html'))).toString();

  components.forEach((elem) => {
    const componentTitle = elem.name
    const regexPattern = new RegExp(`\\{\\{${componentTitle}\\}\\}`, 'g');
    basicHTML = basicHTML.replace(regexPattern, elem.layout);
  });

  await fs.writeFile(dest, basicHTML, 'utf-8');
}
