import Vue from 'vue'
import store from '@/store/index'
import axios from 'axios'
// import { getToken, getGid, getFrom } from '@/utils/auth'
// import { toast } from '@/utils/assembly' 创建axios实例
const service = axios.create({
	baseURL: process.env.BASE_URL, // api的base_url
	timeout: 15000 // 请求超时时间
	// withCredentials: true
	// headers: { 'access-token': store.getters.getToken }
	// headers: { 'access-token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0YWlzaXlhNjQ4Mjg3NzIiLCJjcmVhdGVkIjoxNTMyNDkwMzg3NTIzLCJleHAiOjE1MzI0OTIxODd9.Uk2QQav9al_oMmJwisnfqJEBQD1-6J24Bo90tuzhiVWcxJ7giO3KZAUZZuVjFSzKZzuvRA5i5EoMFiSkdVK11g' }
	// headers: {}
});
service.interceptors.request.use(config => {
  // 后期根据token做处理
  if (store.getters.getToken) {
    config.headers['access-token'] = store.state.user.token // 让每个请求携带自定义token
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(response => {
		const res = response.data
		Vue.$vux.loading.hide()
		if (res.code == 'rest.success') {
			// 成功
			return res
		} else if (res.status == 4) {
			Vue.$vux.toast.text(res.error)
			return res
			// toast(res.error) return Promise.reject({'error':res})
		} else if (res.code == 'user.is.null') {
			store.dispatch('FedLogout')
			Vue.$vux.toast.text('用户已过期，请退出重新进入')
		} else if (res.code == 'isUsing.is.erreo') {
			// 用户被限制登陆
			store.dispatch('FedLogout')
			Vue.$vux.toast.text(res.desc)
		} else {
			Vue.$vux.toast.text(res.desc)
			// toast(res.error) if (res.status==5&&res.error=='会话失效，请重新登录') {
			// 	window.clearcookie(cookie) 	// getAuth(cookie, querystring) }
			return res
		}
}, error => {
		console.log('err' + error) // for debug
		Vue.$vux.toast.text(error.message)
		return Promise.reject(error)
})
export default service
