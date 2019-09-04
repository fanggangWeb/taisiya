<template>
  <div class="warp">
    <div class="body-container">
      <!--商品列表-->
      <div class="item-list info-background">
        <!--订单商品-->
        <div class="details-info clearfix">
          <!--商品图+商品信息-->
          <div class="detail-border">
            <div class="detail-item ">
              <!--左侧图片-->
              <div class="img-show">
                <img :src="parkDetail.picUrl" alt="">
              </div>
              <!--右侧详情-->
              <div class="detail-info ">
                <p class="detail-title">{{parkDetail.parkName}}</p>
                <span class="detail-color customary">¥{{parkDetail.showTicket}}</span>
                <p v-if="parkDetail.ticket" class="detail-price">
                  <span class="price-sign">¥</span>
                  <span>{{parkDetail.ticket}}</span>&nbsp;
                  <!-- <span class=" detail-color count-show float-right">×1</span> -->
                </p>
              </div>
            </div>
          </div>
          <!--购买数量-->
          <div class="count-border ">
            <div class="buy-count">
              <span class="count-title">购买数量</span>
              <div class="count-operation">
                <span class="operation" id="subtract" @click="changeNum('minus')">
                    <img src="../../assets/images/ticket/jian2x.png" alt="">
                </span>
                <input type="number"  v-model="num" readonly>
                <span class="operation" id="add" @click="changeNum('add')">
                    <img src="../../assets/images/ticket/jia2x.png" alt="">
                </span>
              </div>
            </div>
          </div>
          <!--优惠券-->
          <div class="coupon-border" v-if="judgeCoupon">
            <div class="coupon" @click="coupon()">
              <span>优惠券</span>
              <span class="preferential">
                <span v-if="getCouponFaceValue===0">请选择优惠券</span>
                <span v-if="getCouponFaceValue!==0">省{{getCouponFaceValue}}元优惠券</span>
                <i class="icon"></i>
              </span>
            </div>
          </div>
          <!--价格小计-->
          <div class="price-border">
            <div class="count-price ">
              <span>共{{num}}张门票&nbsp;&nbsp;小计:&nbsp;&nbsp;</span>
              <span class="money">
              <font class="price-sign">¥</font>
              {{getTiketTotalPrice}}
            </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--合计金额-->
    <div class="total-price clearfix">
      <span class="sure-total-price">合计金额：
          <font class="price-sign">¥</font>
      <span class="money">{{getTiketTotalPrice.toFixed(2)}}</span>
      </span>
      <span class="btn-sub" @click="subTicketOrder">
          提交订单
      </span>
    </div>
    <CouponLevel :couponType="couponType" ref="coupon"></CouponLevel>
  </div>
</template>

<script>
  import CouponLevel from '../../components/couponLevel.vue';
  import { mapGetters, mapMutations } from 'vuex'
  import { selectParkById, creatTicketOrder, selectConpouUserListByMoble } from '@/utils/lkfetch'
  const SUCCESS_OK = 'rest.success'
  import { weixinPay } from '@/utils/wfetch'
  export default {
    name: 'orderConfirm',
    data() {
      return {
        couponType: 4,
        scenicId: 0,
        num: 1,
        parkDetail: {},
        couponPrice: 7,
        ticket: 0,
        tiketTotalPrice: 0,
        isCoupon: true,
        watchPrice: 0
      }
    },
    computed: {
      ...mapGetters(['getParkId', 'getCouponFaceValue', 'getCouponId', 'getCouponLimit']),
      getTiketTotalPrice() {
        this.tiketTotalPrice = this.num * this.parkDetail.ticket - this.getCouponFaceValue;
        if (this.tiketTotalPrice < 0) {
          this.tiketTotalPrice = 0
        }
        return this.tiketTotalPrice
      },
      judgeCoupon() {
        if (this.isCoupon == true) {
          return true
        } else if (this.isCoupon == false) {
          return false
        }
      },
      getWatchPrice() {
        this.watchPrice = this.num * this.parkDetail.ticket;
        if (this.watchPrice < 0) {
          this.watchPrice = 0
        }
        return this.watchPrice
      }
    },
    watch: {
      getWatchPrice: function(val, oldval) {
        if (val < this.getCouponLimit) {
          this.couponFaceValue(0)
          this.couponId('')
          this.$refs.coupon.reset()
        }
      }
    },
    methods: {
      ...mapMutations(['couponFaceValue', 'couponId', 'limitPrice', 'couponLimit', 'orderDetailType', 'parkOrderId']),
      jump: function(url) {
        this.$router.push(url)
      },
      coupon: function() {
        this.limitPrice(this.getWatchPrice)
        $('#coupon_leave').show()
      },
      changeNum: function(type) {
        if (type === 'add') {
          this.num = this.num + 1;
          console.log(this.watchPrice)
          // this.product.totalPrice = this.num * this.product.productsPrice;
        } else {
          this.num = this.num - 1;
          // this.product.totalPrice = this.num * this.product.productsPrice;
          if (this.num < 1) {
            this.num = 0;
            // this.product.totalPrice = 0;
            return false;
          }
        }
      },
      // 提交门票订单
      subTicketOrder: function() {
        const myThis = this
        var parmas = {
          "couponId": this.getCouponId,
          "num": this.num,
          "parkId": this.getParkId
        };
        if (this.num < 1) {
          this.showAlert("购买商品不能少于一件")
        } else {
          // console.log(parmas);
          creatTicketOrder(parmas).then(res => {
             console.log(res);
            // this.couponId('')
            if (res.code == SUCCESS_OK) {
              if (res.result.paymentPrice > 0) {
                const _orderId = res.result.id
                var params1 = { orderId:res.result.id, orderType:res.result.orderType }
                weixinPay(params1).then(ress => {
                  // console.log(ress);
                  if (ress.code === SUCCESS_OK) {
                    // if (ress.result.paymentPrice <= 0) {
                    //   this.showAlert('支付成功')
                    //   return
                    // }
                    /* eslint-disable no-undef*/
                    var onBridgeReady = function() {
                      WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                          "appId": ress.result.appId,     // 公众号名称，由商户传入
                          "timeStamp": ress.result.timeStamp,  // 时间戳，自1970年以来的秒数
                          "nonceStr": ress.result.nonceStr, // 随机串
                          "package": ress.result.package,
                          "signType": ress.result.signType,         // 微信签名方式：
                          "paySign": ress.result.sign  // 微信签名
                        },
                        function(res) {
                          console.log(res)
                          if (res.err_msg == "get_brand_wcpay_request:ok") {
                            myThis.showAlert('支付成功');
                            setTimeout(() => {
                              // myThis.orderDetailType(0)
                              // myThis.jump('/scenicSpot/order');
                              myThis.parkOrderId(_orderId)
                              myThis.jump('/scenicSpot/orderDetail')
                            }, 1000)
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
                  myThis.$router.push({ path: '/scenicSpot/order' })
                }, 500)
              }
            } else if (res.code == "cp is null") {
              myThis.showAlert('优惠券不存在，请重新提交订单')
              myThis.couponId('')
              myThis.couponFaceValue(0)
              this._selectConpouUserListByMoble()
            } else {
              myThis.showAlert(res.desc);
              myThis.couponId('')
              myThis.couponFaceValue(0)
              this._selectConpouUserListByMoble()
            }
          })
        }
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
            }
          } else {
            this.showAlert(res.desc)
          }
        })
      }
    },
    created() {
      // 根据景点id查询
      this._selectConpouUserListByMoble()
      selectParkById({ id: this.getParkId }).then(res => {
        if (res.code === SUCCESS_OK) {
          this.parkDetail = res.result;
          this.ticket = this.parkDetail.ticket;
        } else {
          this.showAlert(res.error);
        }
        console.log(this.getCouponLimit);
      })
    },
    destroyed() {
      this.couponId('')
      this.couponFaceValue(0)
    },
    components: {
      CouponLevel
    }
  }
</script>
<style scoped>
  .warp{
    background: #F7f7f7;
  }

  *,*:before,*:after{box-sizing:border-box;}
  *{text-align: left;}

  .body-container{
    width: 100%;
    margin: 0 auto;
    background: #F7f7f7;
    color:#5F5F5F;
  }
  .info-background{
    background: #fff;
  }
  .consignee p:first-child{
    margin-bottom: 0.2rem;
  }
  .consignee span{
    font-size: 0.27rem;
  }
  .item-list{
    width: 100%;
    margin-bottom: 0.8rem;
    background: #f7f7f7;
  }
  .item-list>div{
    background: #fff;
  }
  .details-info>div{
    font-size: 0.26rem;
  }
  .details-info>div:not(:first-child:last-child){
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .detail-border{
    width: 100%;
    padding: 0.32rem 0.23rem;
    border-bottom: 1px solid #f7f7f7;
  }
  .spot-name>div.left img{
    width: 100%;
    height: 100%;
  }
  .detail-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .detail-item>.img-show{
    width: 1.48rem;
    height: 1.48rem;
    margin-right: 4%;
  }
  .detail-item .img-show img{
    width: 100%;
    height: 100%;
  }
  .detail-info{
    width: 5.18rem;
  }
  .detail-color{
    color: #B0B0B0;
  }

  .price-sign,.price-sign+span{
    color: #ff4a26;
    font-size: .2rem;
  }
  .price-sign+span{
    font-size: 0.4rem;
    font-weight: 600;
    margin-left: -0.03rem;
  }
  .customary{
    text-decoration: line-through;
  }
  .operation {
    cursor: pointer;
  }
  .count-operation>input,.preferential{
    font-size: 0.28rem;
  }
  .icon{
    display: inline-block;
    width: 0.12rem;
    height: 0.22rem;
    background: url("../../assets/images/map/arrow@2x.png");
    background-size: 100% 100%;
    margin-left: 0.2rem;
  }
  .count-border{
    width: 100%;
    padding: 0 0.2rem;
  }
  .buy-count{
    width: 100%;
    height: 0.81rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F6F6F6;
  }
  .count-operation{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .count-operation>input{
    width: 0.7rem;
    text-align: center;
    border: none;

  }
  .operation{
    width: 0.44rem;
    height: 0.42rem;
  }
  .operation>img{
    width: 100%;
    height: 100%;
  }
  .count-border~div{
    height: 0.81rem;
    padding: 0 0.2rem;
  }
  .count-price{
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    height: 0.81rem;
  }
  .total-price{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 101%;
    line-height: 1.2rem;
    position: fixed;
    bottom: 0;
    background: #fff;
    font-size: 0.26rem;
  }
  .btn-sub{
    width: 1.5rem;
    background: #FFBA02;
    font-size: 0.3rem;
    color:#fff;
    text-align:center;
    margin-left: 0.2rem;
  }
  .money{
    color: #ff4a26;
    font-size: 0.3rem;
    font-weight: bold;
  }
  .coupon-border,price-border{
    width: 100%;
  }
  .coupon{
    display: flex;
    flex: 1;
    justify-content: space-between;
    height: .82rem;
    align-items: center;
    border-bottom: 1px solid #F6F6F6;
  }
</style>
