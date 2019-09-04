<template>
  <div class="warp">
    <input type="text" v-model="name" :placeholder="placeholder">
    <cube-button class="confirm-btn" :primary="true" @click="confirm">保存</cube-button>
  </div>
</template>
<script>
  import { updataUserInfo, getUserInfo } from '@/api/member'
  import { mapMutations } from 'vuex'
  const SUCCESS_OK = 'rest.success'
  export default {
    data() {
      return {
        name: '',
        placeholder: '请输入要修改的名称',
        type: 'text',
        maxlength: 100,
        disabled: true,
        autofocus: true,
        autocomplete: true,
        clearable: false
      }
    },
    methods: {
      ...mapMutations(['SET_NAME']),
      // 点击保存按钮
      confirm() {
        if (this.name == '') {
          this.showAlert('用户名不能为空')
        } else {
          const data = {
            id: "1",
            nickName: this.name
          }
          updataUserInfo(data).then(res => {
            if (res.code == SUCCESS_OK) {
              this.showAlert('修改用户名成功')
              this.$router.push({ path: '/member' })
            } else {
              this.showAlert(res.desc)
            }
          })
        }
      },
      // 获取个人信息
      _getUserInfo() {
        getUserInfo().then(res => {
          if (res.code == SUCCESS_OK) {
            console.log(res)
            this.name = res.result.nickName
            this.SET_NAME(res.result.nickName)
          } else {
            this.showAlert(res.desc)
          }
        })
      }
    },
    mounted() {
      this._getUserInfo()
    }
  }
</script>
<style lang="stylus" scoped>
.warp
  padding 10px 5px
  width 100%
  height 100%
  input
    height 45px
    line-height 45px
    font-size 15px
    width 100%
    padding 0 5px
    border-bottom: 0.6px #a5d7a5 solid
  .confirm-btn
    position absolute
    bottom 0
    left 0
</style>
