<template>
  <div class="warp">
    <div class="title">请选择新头像并保存</div>
    <div class="upload">
      <cube-upload
      :action="HTTP+'/file/upload'"
      :simultaneous-uploads="1"
      file="file"
      :max="1"
      v-model="value"
      @files-added="filesAdded"
      @file-removed="fileRemoved"
      @file-success="fileSuccess"/>
    </div>
    <cube-button class="confirm-btn" :primary="true" @click="confirm">保存头像</cube-button>
  </div>
</template>
<script>
  import { HTTP } from '@/utils/config'
  import { updataUserInfo } from '@/api/member'
  import { mapMutations } from 'vuex'
  const SUCCESS_OK = 'rest.success'
  export default {
    data() {
      return {
        HTTP: HTTP,
        value: []
      }
    },
    methods: {
      ...mapMutations(['SET_AVATAR', 'SET_NAME']),
      confirm() {
        if (this.value.length == 0) {
          this.showAlert('请选取用户头像')
        } else {
          const data = {
            id: 1,
            wxHeadPicUrl: this.value[0].response.result.url
          }
          console.log(data)
          updataUserInfo(data).then(res => {
            if (res.code == SUCCESS_OK) {
              this.showAlert('用户头像修改成功')
              // 更新token和vuex的存储
              this.SET_AVATAR(this.value[0].response.result.url)
              this.$router.push({ path: '/member' })
            } else {
              this.showAlert(res.desc)
            }
          })
        }
      },
      filesAdded(files) {
        let hasIgnore = false
        const maxSize = 10 * 1024 * 1024 // 1M
        for (const k in files) {
          const file = files[k]
          if (file.size > maxSize) {
            file.ignore = true
            hasIgnore = true
          }
        }
        hasIgnore && this.$createToast({
          type: 'warn',
          time: 1000,
          // txt: 'You selected >1M files'
          txt: '选取的图片大于10M'
        }).show()
      },
      fileRemoved() {
        console.log(this.value)
      },
      // 成功回调
      fileSuccess(file) {
        // console.log(file)
        // this.showAlert(2222222)
      }
    }
  }
</script>
<style lang="stylus" scoped>
.warp
  width 100%
  height 100%
  .title
    font-size 14px
    width 100%
    height 40px
    line-height 40px
    background-color #F4F4F4
    text-align left 
    padding 0 5px
  .upload
    padding 10px
  .confirm-btn
    position absolute
    bottom 0
    left 0
</style>
