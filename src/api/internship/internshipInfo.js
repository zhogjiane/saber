import request from '@/router/axios';

export const getList = (current, size, params, userId) => {
  return request({
    url: '/api/blade-internship/internshipfilesubmit/userPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      userId
    }
  })
}
