// import * as types from '../mutations-type'
import { login } from '@/api/login'
import { setCookie, getCookie, removeCookie } from '@/utils/cookie'
const SUCCESS_OK = 'rest.success'
const user = {
  state: {
    // openId: 'oiwU506awaIuqripkbtWoPtod_4s',
    openId: getCookie('openId'),
    // openId: 'oiwU506kqWkoEdhEU8rjLGBQvfJg',
    // openId: 'oiwU503Om2PqZmtWiJvJWjjkRBBY',
    token: getCookie('token'),
    // token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0YWlzaXlhNjQ4Mjg3NzIiLCJjcmVhdGVkIjoxNTMyNDkwMzg3NTIzLCJleHAiOjE1MzI0OTIxODd9.Uk2QQav9al_oMmJwisnfqJEBQD1-6J24Bo90tuzhiVWcxJ7giO3KZAUZZuVjFSzKZzuvRA5i5EoMFiSkdVK11g',
    name: getCookie('name'),
    avatar: getCookie('avatar'),
    id: getCookie('id'),
    account: getCookie('account')
  },
  getters: {
    getOpenId: state => state.openId,
    getToken: state => state.token,
    getName: state => state.name,
    getAvatar: state => state.avatar,
    getId: state => state.id,
    getAccount: state => state.account,
    getRoles: state => state.roles
  },
  mutations: {
    SET_OPENID(state, openId) {
      state.openId = openId
      setCookie('openId', openId)
    },
    SET_TOKEN(state, token) {
      state.token = token
      setCookie('token', token)
    },
    SET_NAME(state, name) {
      setCookie('name', name)
      state.name = name
    },
    SET_ACCOUNT(state, account) {
      setCookie('account', account)
      state.account = account
    },
    SET_AVATAR(state, avatar) {
      setCookie('avatar', avatar)
      state.avatar = avatar
    },
    SET_ID(state, id) {
      setCookie('id', id)
      state.id = id
    },
    SET_ROLES(state, roles) {
      state.roles = roles
    }
  },
  actions: {
    // 用户登录
    Login({ commit, getters },  code) {
      return new Promise((resolve, reject) => {
        login(code).then(res => {
          // 用openId获取token及用户信息成功 登录成功
          if (res.code === SUCCESS_OK) {
            commit('SET_ID', res.result.id) // 设置id
            commit('SET_NAME', res.result.nickName) // 设置名字
            commit('SET_TOKEN', res.result.token) // 设置token
            commit('SET_AVATAR', res.result.headPicUrl) // 设置头像
            commit('SET_ACCOUNT', res.result.account) // 设置账户
            console.log(getters.getToken)
            resolve(true)
          } else {
            // 登录失败
            this.showAlert('获取用户信息失败，请退出重新进入')
            resolve(false)
            commit('SET_TOKEN', '')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户的信息及其权限
    // FetchOpenId({ dispatch }) {
    //   return new Promise((resolve, reject) => {
    //     fetchOpenId().then(res => {
    //       // 获取用户openId成功
    //       if (res.code === SUCCESS_OK) {
    //         dispatch('Login', res.result.openId)
    //         resolve(true)
    //       } else {
    //         // 拉取用户信息和权限失败
    //         resolve(false)
    //       }
    //     }).catch(error => {
    //       console.log('确认有没有返回reject')
    //       reject(error)
    //     })
    //   })
    // },
    // 用户注销
    FedLogout({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '') // 把token设置为空
        commit('SET_NAME', '')
        commit('SET_ID', '')
        commit('SET_AVATAR', '')
        commit('SET_ACCOUNT', '')
        commit('SET_OPENID', '')
        removeCookie('token')
        removeCookie('name')
        removeCookie('avatar')
        removeCookie('id')
        removeCookie('account')
        removeCookie('openId')
        resolve()
      })
    }
  }
}
export default user
