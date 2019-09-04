<template>
  <div class="warp">
    <!--注册 -->
    <div class="login">

      <!--验证码 -->
      <div class="" >
        <div class="form-group">
          <label for=""> 手机号</label>
          <input type="text" placeholder="请输入电话号码">
          <i class="icon close"><img src="../../assets/images/icon-close.png" alt=""></i>
        </div>
        <div class="form-group">
          <label for=""> 验证码</label>
          <input type="text" placeholder="请输入右边验证码">
          <span></span>
        </div>
        <div class="form-group">
          <label for=""> 短信验证</label>
          <input type="text" placeholder="请输入手机验证码">
          <span>获取验证码</span>
        </div>
        <div class="form-group">
          <label for=""> 密码</label>
          <input type="text" placeholder="请设置登录密码">
          <i></i>
        </div>

      </div>
      <div class="form-hint">点击立即注册，即表示已同意<a href="">《登录注册协议》</a></div>
      <div class="form-button"><button class="login_btn">立即注册</button></div>
      <div class="form-button"><button class="register_btn" ><router-link :to="'./'">返回登录</router-link></button></div>
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
        top: .28rem;
      }
      span{
        position: absolute;
        right: 0;
        font-size: .26rem;
        color: #ffba00;
        top: .28rem;
      }
      .close {
        width: .34rem;
        height: .34rem;

      }
    }

    .form-hint{
      font-size: .22rem;
      color: #bababa;
      margin-top: .4rem;
      a{
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
        text-align: center;
      }
      .login_btn{
        background: #ffba02;
        color: white;

      }
      .register_btn{
        background: white;
        border: 1px solid #ffba00;
        a{
          color: #ffba00;
        }
      }
    }
  }

</style>
