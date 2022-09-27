// 提取每一个 md 的标题 生成 (路径 => 标题) 的映射

const glob = require('glob');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const cwd = process.cwd();

const MDFiles = glob.sync('./docs/**/*.md');
const PathToJsonFile = path.join(cwd, 'docs/.vitepress/pathToTitle.json');
const map = {};

MDFiles.forEach(filePath => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const key = filePath.match(/docs(.*).md/)[1];
  map[key] = ((fileContent.match(/^#(.*)\n?/) || [])[1] || '').trim();
});

const content = prettier.format(JSON.stringify(map), {
  parser: 'json'
});

fs.writeFileSync(PathToJsonFile, content);

console.log('pathToTitle.json 文件同步成功');
