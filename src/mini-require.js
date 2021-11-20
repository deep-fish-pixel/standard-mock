const path = require('path');
const getFileContent = require('./getFileContent');

/**
 * 微型模块加载器
 * @param moduleName
 * @param dir
 * @returns {*}
 */
function miniRequire(moduleName, dir) {
  // 加载公共库
  if (moduleName && moduleName.match(/^[^.\/]/)) {
    return require(moduleName);
  }
  const prevParentPath = global.__parentPath;
  const filePath = getFilePath(moduleName, prevParentPath);

  global.__parentPath = filePath.replace(/\/[^/]+$/, '');

  const { content, filename } = getFileContent(filePath, dir) || {};
  const param = [
    'exports', 'module', 'require',
    '__dirname', '__filename'
  ];
  const exportConsts = [];
  const data = content
    .replace(/import\s+([./\w-$]+|\{[\s,./\w-$]+})\s+from (['"][./\w-$]+['"])/g, 'const $1 = require($2)')
    .replace(/export\s+default([^\w-$])/g, 'module.exports =$1')
    .replace(/export\s+(const|function)\s+([\w$]+)/g, (all, $1, name) => {
      exportConsts.push(`exports.${name} = ${name}`);
      return `${$1} ${name}`;
    });

  const fn = new Function(...param, `${data}\n ${exportConsts.join('\n')} \n return module.exports`);

  const module = {
    exports: {}
  };

  const result = fn(
    module.exports, module, miniRequire,
    filename.replace(/\/[^/]+$/, ''), filename
  );

  // 恢复上一次操作
  global.__parentPath = prevParentPath;
  return result;
}

/**
 * 获取模块全路径
 * @param moduleName
 * @param prevParentPath
 * @returns {string}
 */
function getFilePath(moduleName, prevParentPath) {
  if (moduleName.match(/^\./)) {
    return path.join(prevParentPath, moduleName);
  }
  return path.join(process.cwd(), moduleName);
}

module.exports = miniRequire;
