<template>
  <!-- 点餐订单详情-->
  <div class="warp" style="text-align:left">
    <!-- top search-->
    <div class="content">
        <div class="order_detail" >
            <div class="order_detail_list">
              <div v-for="(item,index) in foodLists" :key="index">
                <p>
                  <span>{{item.name}} <font>x{{item.num}}</font></span>
                  <span>￥{{item.price * item.num}}</span>
                </p>
              </div>
            </div>
            <div class="order_detail_money mt-20">
              <h5>实付金额：{{(totalMoney-getCouponFaceValue).toFixed(2)}}</h5>
              <p>
                总金额：<span>{{totalMoney.toFixed(2)}}元</span>
              </p>
            </div>
            <div class="order_detail_coupon" @click="coupon" v-if="isCoupon">
              <div class="use_coupon">
                <span v-if="getCouponFaceValue == 0">请选择优惠券</span>
                <span v-else>省{{getCouponFaceValue}}元优惠券</span>
              </div>
              <div class="sel_coupon" >
                <!-- <span class="money_coupon" v-if="getCouponFaceValue!==0">{{getCouponFaceValue}}</span> -->
                <span class="sel_operate"></span>
              </div>
            </div>
        </div>
    </div>
    <!-- 结算-->
    <div class="total-price">
      <span class="sure-total-price">合计金额：
          <i class="price-sign">¥</i>
      <span class="money">{{(totalMoney-getCouponFaceValue).toFixed(2)}}</span>
      </span>
    <span class="btn-sub" @click="subOrder">
      提交订单
      </span>
  </div>
    <CouponLevel :couponType="couponType"></CouponLevel>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { weixinPay } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  import { insertFoodOrder } from '@/utils/wfetch'
  import { selectConpouUserListByMoble } from '@/utils/lkfetch'
  import CouponLevel from '../../components/couponLevel';
  export default {
    name: 'HelloWorld',
    data() {
      return {
        isCoupon: false,
        couponType: 2,
        foodLists: [],
        payMoney: 0,
        totalMoney:0
      }
    },
    methods: {
      ...mapMutations(['limitPrice', 'couponFaceValue', 'couponFaceValue', 'couponId']),
      jump: function(url) {
        this.$router.push(url)
      },
      coupon: function() {
        $('#coupon_leave').show()
      },
      subOrder: function() {
        const myThis = this
        var params = { couponId:this.getCouponId, foodList:this.foodLists, businessId: this.getFoodSellId }
        insertFoodOrder(params).then(res => {
          if (res.code === SUCCESS_OK) {
            // 此处进入支付页面
            if (res.result.expressPrice > 0) {
                //   console.log(res)
              // 设置进入订单详情页面的状态
              var params = { orderId:res.result.id, orderType:res.result.orderType }
              weixinPay(params).then(ress => {
              //  console.log(ress)
              if (ress.code === SUCCESS_OK) {
                /* eslint-disable no-undef*/
                // 判断返回的金额是否为0 如果为0 视为成功 不调取微信接口
                  var onBridgeReady = function() {
                    WeixinJSBridge.invoke(
                      'getBrandWCPayRequest',
                      {
                        "appId": ress.result.appId,     // 公众号名称，由商户传入
                        "timeStamp": ress.result.timeStamp,         // 时间戳，自1970年以来的秒数
                        "nonceStr": ress.result.nonceStr, // 随机串
                        "package": ress.result.package,
                        "signType": ress.result.signType,         // 微信签名方式：
                        "paySign": ress.result.sign  // 微信签名
                      },
                    function(res) {
                      if (res.err_msg == "get_brand_wcpay_request:ok") {
                        myThis.showAlert('支付成功')
                        // setTimeout(() => {
                        //   this.jump('orderDetail', this.num, this.totalPrice);
                        // }, 1000)
                        setTimeout(() => {
                          myThis.$router.push({ path: '/orderFood/order' })
                        }, 300)
                        //  使用以上方式判断前端返回,微信团队郑重提示：
                        // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                      } else {
                        myThis.showAlert('支付失败')
                      }
                    })
                  }
                  if  (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                  } else {
                    onBridgeReady();
                  }
                } else {
                  myThis.showAlert(ress.desc);
                }
              })
            } else {
              myThis.showAlert('支付成功')
              setTimeout(() => {
                myThis.$router.push({ path: '/order' })
              }, 500)
            }
            // this.$vux.toast.text(res.desc);
            myThis.couponId('')
          } else {
            myThis.showAlert('获取订单失败');
          }
        });
      },
      // 优惠券的列表数据来判断是否显示
      _selectConpouUserListByMoble() {
        const params = {
          num: 1,
          size: 5,
          // businessId: 0, // 商家id，暂时不传
          couponType: this.couponType, // 优惠券种类，暂时不传
          isUseing: 0, // 0未使用，1已使用
          isValidity: 0 // 0未过期 1已过期
        }
        selectConpouUserListByMoble(params).then(res => {
          if (res.code == SUCCESS_OK) {
            // this.couponList = res.result.list
            if (res.result.list.length < 1) {
              this.isCoupon = false
            } else {
              this.isCoupon = true
            }
          } else {
            this.showAlert(res.desc)
          }
        })
      }
    },
    computed: {
      ...mapGetters(['getCouponId', 'getCouponFaceValue', 'getFoodList', 'getFoodSellId']),
      // 计算总金额
        total: function() {
          if (this.foodLists === null) {
            return;
          }
          this.totalMoney = 0;
          for (var i = 0; i < this.foodLists.length; i++) {
            this.totalMoney += this.foodLists[i].price * this.foodLists[i].num;
          }
        }
    },
    created() {
      // 将localStorage 的数据加载进foodList
     // var obj = JSON.parse(localStorage.getItem('foodCartList'));
      // console.log(obj)
    /*  if (obj != null) {
        for (var i = 0; i < obj.length; i++) {
          this.foodList[i] = JSON.parse(obj[i]);
        }*/
      // this._selectConpouUserListByMoble()
      this.foodLists = JSON.parse(this.getFoodList)
      this.total
      this.limitPrice(this.totalMoney)
    },
    mounted() {
      this._selectConpouUserListByMoble()
      console.log(this.getCouponFaceValue)
    },
    components: {
      CouponLevel
    },
    destroyed() {
      this.couponFaceValue(0)
      this.couponId('')
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .content {
    height: calc(13.34rem - 60px);
    background: #ebebeb;
    text-align: left;
    .order_detail {
      position: relative;
      top: .32rem;
      /*height: 5.75rem;*/
      margin:0 .37rem;
      // background: url("../../assets/images/order-bg.png") no-repeat;
      background-color: white;
      background-size: 100%;
      padding: .23rem;
      h5{
        text-align: left;
        color: #010101;
        font-size: .36rem;
        font-weight: bold;
        margin-bottom: .32rem;
      }
      .order_detail_list{
        border-bottom: .01rem dashed #f0f0f0;
        p{
          padding-bottom: .15rem ;
          padding-top: .05rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: .30rem;
          span{
            font{
              color: #989898;
            }
          }
        }
      }
      .order_detail_money{
        border-bottom: .01rem dashed #f0f0f0;
        h5{
          margin-bottom: .2rem;
        }
        p{
          padding-bottom: .1rem ;
         /* display: flex;
          align-items: center;
          justify-content: space-between;*/
          font-size: .24rem;
          color: #989898;
          span{
            font-size: .30rem;
            color: #EC4747;
          }
        }
      }
      .order_detail_coupon{
        margin-top: .1rem;
        height: 1.18rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
          .use_coupon{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            span{
              display: block;
              font-size: .3rem;
              color: #4D4D4D;
              font-weight: 600;
            }
          }
          .sel_coupon{
            width:.12rem ;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .sel_operate{
              display: inline-block;
              width:.12rem ;
              height: .22rem;
              background: url("../../assets/images/go-icon.png") no-repeat;
              background-size: 100% 100%;
            }
            .money_coupon{
              font-size: .26rem;
              color: #EC4747;
            }
          }
      }
    }
  }
  .total-price{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 101%;
    line-height: 1rem;
    height: 1rem;
    position: fixed;
    bottom: 0;
    background: #fff;
    font-size: 0.26rem;
    .price-sign{
      font-size: 0.05rem;
    }
    .price-sign,.price-sign+span{
      color: #F8482D;
    }
    .price-sign+span{
      font-size: 0.3rem;
      font-weight: bold;
      margin-left: -0.03rem;
    }

    .btn-sub{
      width: 2.08rem;
      background: #FFBA02;
      font-size: 0.3rem;
      color:#fff;
      text-align:center;
      margin-left: 0.2rem;
    }
    .money{
      font-size: 0.3rem;
    }
  }

</style>
