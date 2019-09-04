<template>
  <div>
    <a :href="'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+'wx25d3a5617d06d013'+'&redirect_uri='+getToUrl+'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'">点击授权登陆</a>
  </div>
</template>
<script>
  import store from '../../store/index'
  import { login } from '@/api/login'
  // import { getCode } from '@/api/member'
  const SUCCESS_OK = 'rest.success'
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['getToUrl'])
    },
    methods: {
     GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2])
      }
      return null
    },
    toAnther() {
      let redirectUrl = 'http://taisiya.cqfuyuan.cn/dist/index.html#/login'
      redirectUrl = encodeURIComponent(redirectUrl)
      console.log(redirectUrl)
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'wx25d3a5617d06d013' + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_userinfo&connect_redirect=1&connect_redirect=1#state=wechat_redirect'
    },
    getCode() {
      this.code = this.GetQueryString("code")
    },
    theLogin() {
      alert(this.code)
      // 两种情况拿到code 和 拿不到code
      if (this.code !== null) {
        login(this.code).then(res => {
          console.log(res)
          // 返回用户信息
          if (res.code == SUCCESS_OK) {
            store.commit('SET_ID', res.result.id) // 设置id
            store.commit('SET_NAME', res.result.nickName) // 设置名字
            store.commit('SET_TOKEN', res.result.token) // 设置token
            store.commit('SET_AVATAR', res.result.headPicUrl) // 设置头像
            store.commit('SET_ACCOUNT', res.result.account) // 设置账户
            alert('请求成功')
            // let redirectUrl = this.getToUrl
            // redirectUrl = encodeURIComponent(redirectUrl)
            // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'wx25d3a5617d06d013' + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_userinfo&connect_redirect=1&connect_redirect=1#wechat_redirect'
          }
        })
      }
    }
   },
   mounted() {
    // getCode()
    // this.getCode()
    // if (this.code !== null) {
    //   this.theLogin()
    // } else {
    //   this.toAnther()
    // }
   }
  }
</script>