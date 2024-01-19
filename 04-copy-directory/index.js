const fs = require('fs/promises');
const path = require('path');

const copyFilesPath = path.join(__dirname, 'files-copy');
const filesPath = path.join(__dirname, 'files');

async function getFiles(path) {
  try {
    const files = await fs.readdir(path);
    return files;
  } catch (err) {
    console.log(`Поизошла ошибк при чтении файлов: ${err}`);
  }
}

async function copyFiles(filesPath, copyFilesPath) {
  try {
    const files = await getFiles(filesPath);

    await Promise.all(
      files.map(async (element) => {
        try {
          await fs.copyFile(
            path.join(filesPath, element),
            path.join(copyFilesPath, element),
          );
        } catch (error) {
          console.error(`Ошибка при копировании файла ${element}: ${error}`);
        }
      }),
    );
    console.log('Все файлы успешно скопированы');
  } catch (err) {
    console.log(`Неудалось скопировать файл: ${err}`);
  }
}

async function run() {
  try {
    await fs.rm(copyFilesPath, { recursive: true, force: true });
    await fs.mkdir(copyFilesPath);
    await copyFiles(filesPath, copyFilesPath);
  } catch (error) {
    console.error(`Произошла ошибка: ${error}`);
  }
}

run();
