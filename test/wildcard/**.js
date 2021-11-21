export default async function ({
                                 request,
                                 validate,
                                 delay
                               }) {
  // 延迟ms
  await delay(1300);

  // 校验数据
  await validate({
    // 参数校验
    param: {},
    // 请求方法校验
    method: 'get'
  });

  return {
    data: 'test1.js',
    param: request.query
  };
}
