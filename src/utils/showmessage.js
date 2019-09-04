import Vue from 'vue'
import Cube from 'cube-ui'
Vue.use(Cube)
import { Dialog, createAPI } from 'cube-ui'
Vue.use(Dialog, createAPI)
// 确定取消的二次弹出框，confirm确定的回调，cancel取消的回调函数
export function showBtn(msg, confirm, data) {
  this.$createDialog({
    type: 'confirm',
    icon: 'cubeic-alert',
    // title: '我是标题',
    content: msg,
    confirmBtn: {
      text: '确定',
      active: true,
      disabled: false,
      href: 'javascript:;'
    },
    cancelBtn: {
      text: '取消',
      active: false,
      disabled: false,
      href: 'javascript:;'
    },
    onConfirm: () => {
      confirm(data)
      // this.$createToast({
      //   type: 'warn',
      //   time: 1000,
      //   txt: '点击确认按钮'
      // }).show()
    },
    onCancel: () => {
      // this.$createToast({
      //   type: 'warn',
      //   time: 1000,
      //   txt: '点击取消按钮'
      // }).show()
    }
  }).show()
}
// 二次封装的alert弹出框，和之前的showError是一样的
// export function showAlert(msg) {
//   this.$createDialog({
//     type: 'alert',
//     // title: '我是标题',
//     content: msg,
//     icon: 'cubeic-alert'
//   }).show()
//   setTimeout(() => {
//     this.$createDialog({}).hide()
//   }, 3000);
// }
export function showAlert(msg) {
  Vue.$vux.toast.text(msg)
}
