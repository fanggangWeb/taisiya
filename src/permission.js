import router from './router/index'
import store from './store/index'
import { login } from '@/api/login'
const SUCCESS_OK = 'rest.success'
// import { getCookie } from './utils/cookie'
// const whiteList = ['/login'] // 定义登录白名单
var GetQueryString = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2])
  }
  return null
}
router.beforeEach((to, from, next) => {
  // store已存在用户信息直接进入页面
  if (store.state.user.openId) {
    var openId = {
      wxOpenId: store.getters.getOpenId
    }
    login(openId).then(res => {
      console.log(res)
      // 返回用户信息
      if (res.code == SUCCESS_OK) {
        store.commit('SET_TOKEN', res.result.token) // 设置token
        store.commit('SET_ID', res.result.id) // 设置id
        store.commit('SET_NAME', res.result.nickName) // 设置名字
        store.commit('SET_AVATAR', res.result.headPicUrl) // 设置头像
        store.commit('SET_ACCOUNT', res.result.account) // 设置账户
        store.commit('SET_OPENID', res.result.wxOpenId)
        next()
      }
    })
    return
  } else {
    // 如果token不存在
    // if (to.path == '/login') { // 如果是登录页面路径，就直接next()
    //   next()
    // } else { // 不然就跳转到登录；
    //   next('/login');
    // }
  var code = GetQueryString("code") // 截取url上的code ,可能没有,则返回''空字符串
  // var uin = GetQueryString("uin")
  // // 两种情况拿到code 和 拿不到code
  if (code !== null) {
    code = {
      wxCode: code
    }
    login(code).then(res => {
      console.log(res)
      // 返回用户信息
      if (res.code == SUCCESS_OK) {
        store.commit('SET_TOKEN', res.result.token) // 设置token
        store.commit('SET_ID', res.result.id) // 设置id
        store.commit('SET_NAME', res.result.nickName) // 设置名字
        store.commit('SET_AVATAR', res.result.headPicUrl) // 设置头像
        store.commit('SET_ACCOUNT', res.result.account) // 设置账户
        store.commit('SET_OPENID', res.result.wxOpenId)
        setTimeout(() => {
          next()
        }, 1000)
      }
    })
  } else {
     // 将本来的window.location.href存储到vuex
    // const redirectUrl = encodeURIComponent(window.location.href)
    // store.commit('toUrl', redirectUrl)
    // if (to.path == '/login') { // 如果是登录页面路径，就直接next()
    //   next()
    // } else { // 不然就跳转到登录；
    //   next('/login');
    // }
    // 这个redirectUrl用 当前页路径或者tof.fullPath(将要进入的路径)
    let redirectUrl = window.location.href
    redirectUrl = encodeURIComponent(redirectUrl)
    // console.log(redirectUrl)
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'wx25d3a5617d06d013' + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect&connect_redirect=1'
  }
  }
})
