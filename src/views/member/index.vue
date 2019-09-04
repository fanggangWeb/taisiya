<template>
  <div class="warp">
    <div class="info-pic" @click="jump('member/personalData')">
      <div class="pic-big">
        <div class="pic-small">
          <img :src="headImg" class="pic"/>
        </div>
      </div>
      <p>{{nickName}}</p>
    </div>
    <!--我的订单-->
    <div class="order-form">
      <p class="my-order">我的订单</p>
      <!--展示栏-->
      <div class="show-form">
        <!--景点订单-->
        <div class="order" @click="jump('/scenicSpot/order')">
          <div>
            <img src="../../assets/images/orderSpot.png" alt="">
          </div>
          <p >景点订单</p>
        </div>
        <div class="order" @click="jump('order')">
          <div>
            <img src="../../assets/images/orderCommodity.png" alt="">
          </div>
          <p >商品订单</p>
        </div>
        <div class="order" @click="jump('orderFood/order')">
          <div>
            <img src="../../assets/images/orderCatering.png" alt="">
          </div>
          <p >餐票订单</p>
        </div>
      </div>
    </div>
    <!--服务信息-->
    <ul class="service-info">
      <li  class="li1" @click="jump('member/coupon')">
        <div>
          <!--小图标1-->
          <i></i>
          <span >我的优惠券</span>
        </div>
        <!--箭头图标-->
        <i class="arrow-to" ></i>
      </li>
      <li  class="li2"  @click="jump('travel')">
        <div>
          <!--小图标1-->
          <i></i>
          <span >我的游记</span>
        </div>
        <!--箭头图标-->
        <i class="arrow-to"></i>
      </li>
      <li  class="li3" @click="jump('member/collection')">
        <div>
          <!--小图标1-->
          <i></i>
          <span>我的收藏</span>
        </div>
        <!--箭头图标-->
        <i class="arrow-to"  ></i>
      </li>
      <li  class="li4"  @click="chooseAddress('member/setAddress')">
        <div>
          <!--小图标1-->
          <i></i>
          <span>收货地址</span>
        </div>
        <!--箭头图标-->
        <i class="arrow-to"></i>
      </li>
      <li  class="li5" @click="jump('member/comAndSug')">
        <div>
          <!--小图标1-->
          <i></i>
          <span >投诉与建议</span>
        </div>
        <!--箭头图标-->
        <i class="arrow-to" ></i>
      </li>
      <li  class="li6" @click="jump('/member/resort')">
        <div>
          <!--小图标1-->
          <i></i>
          <span >景区求助</span>
        </div>
        <!--箭头图标-->
        <i class="arrow-to"></i>
      </li>
    </ul>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  import { getUserInfo } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        headImg: '',
        nickName: '',
        msg: 'Welcome to Your Vue.js App',
        type: 1
      }
    },
    computed: {
    },
    methods: {
      ...mapMutations(['suggestState', 'searchState', 'isChooseAddress', 'SET_AVATAR', 'SET_NAME']),
      loginType: function(id) {
        this.type = id
      },
      jump: function(url) {
        // 从个人中心跳转状态为2
        this.searchState(2)
        this.suggestState(2)
        this.$router.push(url);
      },
      chooseAddress() {
        this.isChooseAddress(0);
        this.$router.push('/member/setAddress');
      },
      // 获取个人信息
      _getUserInfo() {
        getUserInfo().then(res => {
          if (res.code == SUCCESS_OK) {
            console.log(res)
            this.headImg = res.result.headImg
            this.nickName = res.result.nickName
            this.SET_AVATAR(res.result.headImg)
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  /*个人中心样式*/
  *,*:before,*:after{box-sizing:border-box;}
  *{
    text-align: left;
    color: #030303;
  }
  .warp{
    background: #F4F4F4;
  }
  /*图片*/
  .info-pic{
    width:100%;
    height: 4.22rem;
    background: #ffffff;
    margin-bottom: 0.2rem;
  }
  .info-pic p{
    padding: 0.5rem 0;
    text-align: center;
    font-size: 0.34rem;
    font-weight: bolder;
  }
  .pic-big{
    height: 2.77rem;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  .pic-small,.pic{
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 0.01rem solid #E9E9E9;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pic{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../../assets/images/defaultIcon2x.png") no-repeat center center;
    background-size: 90%;
  }
  /*我的订单*/
  .order-form{
    width: 100%;
    height: 2.6rem;
    padding: 0 0.27rem;
    background: #fff;
    margin-bottom: 0.2rem;
  }
  .my-order{
    padding: 0.2rem 0;
    font-size: 0.32rem;
    border-bottom: 0.01rem solid #F4F4F4;
  }
  .show-form{
    width: 100%;
    padding: 0.2rem 0.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .order{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .order p{
    margin-top: 0.1rem;
    font-size: 0.24rem;
  }
  .service-info{
    background: #fff;
  }
  .service-info li{
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 0.4rem;
  }
  .service-info>li>div>i{
    display: inline-block;
    width: 0.38rem;
    height: 0.34rem;
    margin-right: 0.3rem;
  }

  .service-info li span{
    font-size: 0.32rem;
    margin-left: 0;
    color:#030303;
    font-weight: medium;
  }
  .service-info>li>i{
    display: inline-block;
    width: 0.16rem;
    height: 0.26rem;
    background: url("../../assets/images/go-icon.png") no-repeat center center;
    background-size: cover;
  }
  .service-info>li>div{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .service-info>.li1>div>i{
    background: url("../../assets/images/coupon@2x.png") no-repeat center center;
    background-size: contain;
  }
  .service-info>.li2>div>i{
    background: url("../../assets/images/travels@2x.png") no-repeat center center;
    background-size: contain;
  }
  .service-info>.li3>div>i{
    background: url("../../assets/images/collect@2x.png") no-repeat center center;
    background-size: contain;
  }
  .service-info>.li4>div>i{
    background: url("../../assets/images/address@2x.png") no-repeat center center;
    background-size: contain;
  }
  .service-info>.li5>div>i{
    background: url("../../assets/images/suggest@2x.png") no-repeat center center;
    background-size: contain;
  }
  .service-info>.li6>div>i{
    background: url("../../assets/images/phone2x.png") no-repeat center center;
    background-size: contain;
  }
</style>
