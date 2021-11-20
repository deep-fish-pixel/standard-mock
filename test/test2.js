export default async function ({
  request,
  validate,
  delay
}) {
  // 延迟300ms
  await delay(300);

  // 校验数据
  await validate({
    param: {
      name: 'required',
      id: 'required'
    },
    method: 'get'
  });

  return {
    'result_code|1-10': '0',
    data: 'test2.js',
    param: request.query
  };
};
