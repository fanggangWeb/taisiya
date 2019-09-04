// 配置Api 接口

import fetch from '@/utils/fetch'

// 接口处理

export function getData(url, params) {
  return fetch({
    url: url,
    method: 'get',
    params
  })
}

export function postData(url, params) {
  return fetch({
    url: url,
    method: 'post',
    params
  })
}


// 返回在vue模板中的调用接口
export default {

  get: function(url, params) {
    return getData(url, params)
  },
  post: function(url, params) {
    return postData(url, params)
  }
}


