export default async function ({
                                 request,
                                 validate,
                                 delay
                               }) {
  // 延迟ms
  await delay(700);

  // 校验数据
  await validate({
    // 参数校验
    param: {},
    // 请求方法校验
    method: 'get'
  });

  return {
    code: '0001',
    data: 'wildcard/*test.js'
  };
}
