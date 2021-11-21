// import 导入工具库
import path from 'path';
import fs from 'fs';
// import 导入其他mock模块
import test1 from './test1';
import test2 from './test2';

export default async function ({
  request,
  validate,
  delay
}) {
  // 延迟ms
  await delay(400);

  // 校验数据
  await validate({
    param: {
      name: 'required|string',
      id: 'required|integer'
    },
    // 请求方法校验
    method: 'get|post'
  });

  // 导出mock数据
  return {
    // 使用mockjs数据模板
    'code|1-10': '0',
    data: {
      "switch|1-2": true,
      name: 'test03.js',
      // 组装其他mock数据，数据量大的时候非常有用
      test1: await test1({
        request,
        validate,
        delay
      }),
      test2: await test2({
        request,
        validate,
        delay
      }),
      // 获取请求get参数
      param: request.query,
      // 获取请求post参数
      param2: request.body,
      // 支持node各种骚操作
      existTest1: fs.existsSync(path.join(__dirname, 'test1.js')),
      existTest0: fs.existsSync(path.join(__dirname, 'no-exist.js'))
    }
  };
};
