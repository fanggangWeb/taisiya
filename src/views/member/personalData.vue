<template>
  <div class="warp">
    <ul class="personal-data">
        <li class="data-item">
          <div class="item-info">
            <span>头像</span>
            <img class="user-icon" :src="selfInfo.headImg" alt="">
          </div>
          <!-- <div class="data-operate">
            <img src="../../assets/images/go-icon.png" alt="">
          </div> -->
        </li>
      <li class="data-item">
        <div class="item-info">
          <span>昵称</span>
          <span class="user-name">{{selfInfo.nickName}}</span>
        </div>
        <!-- <div class="data-operate">
          <img src="../../assets/images/go-icon.png" alt="">
        </div> -->
      </li>
    </ul>
  </div>
</template>
<script>
  const SUCCESS_OK = "rest.success"
  import { getUserInfo } from '@/api/member'
  import { mapMutations } from 'vuex'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        selfInfo: {
          headImg:'../../assets/images/defaultIcon2x.png',
          nickName:'驯良'
        }
      }
    },
    methods: {
      ...mapMutations(['SET_AVATAR', 'SET_NAME']),
      changeAvatar() {
        this.$router.push({ path: '/member/avatar' })
      },
      changeName() {
        this.$router.push({ path: '/member/nickname' })
      },
      loginType: function(id) {
        this.type = id
      },
      jump: function() {
        this.$router.push({ path: '/home' })
      },
      // 获取个人信息
      _getUserInfo() {
        getUserInfo().then(res => {
          if (res.code == SUCCESS_OK) {
            console.log(res)
            this.selfInfo.headImg = res.result.headImg
            this.selfInfo.nickName = res.result.nickName
            this.SET_AVATAR(res.result.headImg)
            this.SET_NAME(res.result.nickName)
          } else {
            this.showAlert(res.desc)
          }
        })
      }
    },
    created() {
      this._getUserInfo()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .personal-data{
    padding: 0 0.26rem;
    /*background: #ddd;*/
    .data-item{
      width: 100%;
      height: 1.48rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-info{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .user-icon{
          width: 1.28rem;
          height: 1.28rem;
        }
        span{
          font-size: 0.32rem;
          color: #030303;
        }
        .user-name{
          font-size: 0.26rem;
          color: #A1A1A1;
        }
      }
      .data-operate{
        img{
          width: 0.16rem;
          height: 0.26rem;
        }
      }
    }
  }
</style>
