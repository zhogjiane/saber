import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-message/messages/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-message/messages/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-message/messages/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-message/messages/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-message/messages/submit',
    method: 'post',
    data: row
  })
}

export const updateMessages = (id,toUserId) => {
  return request({
    url: '/api/blade-message/messages/updateMessages',
    method: 'post',
    params: {
      id,
      toUserId,
    }
  })
}

export const updateUserMessages = (toUserId) => {
  return request({
    url: '/api/blade-message/messages/updateUserMessages',
    method: 'post',
    params: {
      toUserId
    }
  })
}

