#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('dirPath', {
    alias: 'd',
    type: 'string',
    description: 'The directory path',
    demandOption: true,
  })
  .option('outputPath', {
    alias: 'o',
    type: 'string',
    description: 'The output path for the generated file',
    demandOption: true,
  })
  .check((argv) => {
    if (!fs.existsSync(argv.dirPath)) {
      throw new Error(`The specified dirPath "${argv.dirPath}" does not exist.`);
    }
    return true;
  })
  .help()
  .argv;

const dirPath = argv.dirPath;
const outputPath = argv.outputPath;

function getFilePaths(dir) {
  let results = {};
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(dirPath, fullPath);
    const stats = fs.statSync(fullPath);

    if (stats && stats.isDirectory()) {
      results = {
        ...results,
        ...getFilePaths(fullPath),
      };
    } else {
      const valuePath = '/' + fullPath.replace(new RegExp(`^${dirPath}[\\\\\\/]`), '');
      results[relativePath] = valuePath;
    }
  });

  return results;
}

const pathsObject = getFilePaths(dirPath);

// 出力先ディレクトリが存在しない場合に作成
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ファイルに書き込む
fs.writeFile(
  outputPath,
  'export const fileNames = ' + JSON.stringify(pathsObject, null, 2) + ' as const',
  (err) => {
    if (err) throw err;
    console.log(`File paths have been successfully written to ${outputPath}`);
  },
);
