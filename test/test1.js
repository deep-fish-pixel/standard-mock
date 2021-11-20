export default async function ({
  request,
  validate,
  delay
}) {
  // 延迟200ms
  await delay(200);

  // 校验数据
  await validate({
    // 参数校验
    param: {
      name: 'required',
      id: 'required'
    },
    // 请求方法校验
    method: 'get'
  });

  return {
    data: 'test1.js',
    param: request.query
  };
}
