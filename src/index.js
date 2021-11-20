const path = require('path');
const Mock = require('mockjs');
const bodyParser = require('body-parser');
const miniRequire = require('./mini-require');
const delay = require('./delay');
const validate = require('./validate');
const hotReload = require('./hotReload');

/**
 * 中间件mock
 * @param dir
 * @param urlPath
 * @param app app应用
 * @param hotServer 热加载服务器
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function ({ dir, path: urlPath, app, hotServer }) {
  if (app) {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
  }
  if (dir) {
    hotReload(hotServer, dir);
  }
  return function (request, response, next) {
    if (request.path.indexOf(urlPath) === 0) {
      const file = path.join('/', dir, `${
        request.path.replace(urlPath, '')
          .replace(/\.\w+/, '')
          .replace(/\/$/, '')}`);

      try {
        const content = miniRequire(file, path.join(process.cwd(), dir));
        // 验证和延迟为异步
        return content({
          request,
          response,
          delay,
          validate: validate.bind(null, request, response)
        }).then((result) => {
          if (result) {
            response.json(Mock.mock(result || {}));
          }
        }).catch((e) => {
          console.log(e);
        });
      } catch (e) {
        response.status(404).send(e.message);
      }
    } else {
      next();
    }
  };
};
