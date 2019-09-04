// const HTTP = 'http://192.168.0.144:8051'
// const HTTP = 'http://www.wz662.top:8091/'
import fetch from '@/utils/fetch'
import qs from 'qs'
import { HTTP } from '@/utils/config'
// 用openId去获取token和用户信息
export function login(data) {
  // alert(code)
  data = qs.stringify(data)
  const url = `${HTTP}/moble/register/login`
  return fetch({
    url,
    method: 'post',
    data
  })
}
// 获取code接口 成功后回调token
export function fetchOpenId(code) {
  const url = `${HTTP}`
  return fetch({
    url,
    method: 'post'
  })
}
