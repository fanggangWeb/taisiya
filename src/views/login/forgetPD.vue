<template>
  <div class="warp">
      <!--登录 -->
        <div class="login">
          <div class="login_way">
            <span class="active">验证码登录</span>
            <span>密码登录</span>
          </div>
          <!--验证码 -->
          <div class="" >
              <div class="form-group">
                <label for=""> 手机号</label>
                <input type="text" placeholder="请输入电话号码">
                <i class="icon close"><img src="../../assets/images/icon-close.png" alt=""></i>
              </div>
              <div class="form-group">
                <label for=""> 验证码</label>
                <input type="text" placeholder="请输入验证码">
                <span>获取验证码</span>
              </div>

          </div>
          <!--密码登录 -->
          <div class="" style="display: none">
            <div class="form-group">
              <label for=""> 手机号</label>
              <input type="text" placeholder="请输入电话号码">
              <i></i>
            </div>
            <div class="form-group">
              <label for=""> 密码</label>
              <input type="text" placeholder="请输入登录密码">
              <span>忘记密码？</span>
            </div>
          </div>
          <div class="form-button"><button class="login_btn">立即登录</button></div>
          <div class="form-button"><button class="register_btn"><router-link :to="'register'">新手注册</router-link></button></div>
        </div>


      <!--忘记密码 -->
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .login{

    .login_way{
      width: 90%;
      position: relative;
      left: 5%;
      display: flex;
      flex-flow: nowrap;
      align-items: center;
      justify-content: space-around;
        span{
          font-size: .32rem;
          color: #030303;
          padding: .1rem 0rem;
        }
        .active{
          color: #ffba00;
          border-bottom: 0.04rem solid #ffba00;
        }
    }

    .form-group{
      width: 90%;
      display: flex;
      flex-flow: nowrap;
      position: relative;
      left: 5%;
      align-items: center;
      justify-content: space-between;
      height: .9rem;
      border-bottom: 1px solid #e1e1e1;
      font-size: .30rem;
      margin-top: .4rem;
      label{
        color: #030303;
      }
      input{
        border: none;
        flex-grow: 0.2;
        position: absolute;
        left: 1.30rem;
      }
      span{
        position: absolute;
        right: 0;
        font-size: .26rem;
        color: #ffba00;
      }
    }
    .form-button{
      display: flex;
      flex-flow: nowrap;
      align-items: center;
      justify-content: center;

      button{
        width: 90%;
        height: .9rem;
        border: none;
        border-radius: .1rem;
        margin-top: .4rem;
        font-size: .32rem;

      }
      .login_btn{
        background: #ffba02;
        color: white;
      }
      .register_btn{
        background: white;
        color: #ffba00;
        border: 1px solid #ffba00;
        a{
          color: #ffba00;
        }
      }
    }
  }

</style>
