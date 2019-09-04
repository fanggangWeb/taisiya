<template>
  <div class="warp">
    <div class="body-container">
      <!--联系人-->
      <div class="contacts info-background clearfix">
        <!--地图-->
        <div class="receiving-address float-left">
          <img src="../../assets/images/orderConfirm/location@2x.png" alt="">
        </div>
        <!--收货人-->
        <div class="consignee" @click="chooseAddress">
          <p class="clearfix">
            <span>收货人：
                <span class="consigneeName">{{getAddressName}}</span>
            </span>
            <span class="consigneeTel">{{getAddressTel}}</span>
          </p>
          <p>
            <span>收货地址：
                <span>{{getAddress}}</span>
            </span>
          </p>
        </div>
      </div>
      <!--商品列表-->
      <div class="item-list info-background">
        <!--标题-->
        <div class="spot-border">
          <div class="spot-name ">
            <div class="left">
              <img src="../../assets/images/orderConfirm/stor@2x.png" alt="">
            </div>
            <p class="left">{{product.businessName}}</p>
          </div>
        </div>
        <!--订单商品-->
        <div class="details-info">
          <!--商品图+商品信息-->
          <div class="detail-border">
            <div class="detail-item ">
              <!--左侧图片-->
              <div class="img-show">
                <img :src="item" alt="" v-for="(item,index) in product.listPicUrl" :key="index" v-if="index === 0">
              </div>
              <!--右侧详情-->
              <div class="detail-info ">
                <p class="detail-title">{{product.productsName}}</p>
                <!-- <p class="detail-size detail-color"><span>大款</span>
                  /
                  <span>黑色</span>
                </p> -->
                <p class="detail-price">
                  <span class="price-sign"> &yen;</span>
                  <span>{{product.productsPrice}}</span>&nbsp;
                  <span v-if="product.originalPrice" class=" detail-color customary"> &#65509;{{product.originalPrice}}</span>
                  <!-- <span class=" detail-color count-show float-right">x1</span> -->
                </p>
              </div>
            </div>
          </div>
          <!--购买数量-->
          <div class="count-border ">
            <div class="buy-count">
              <span class="count-title">购买数量</span>
              <div class="count-operation">
                <span class="operation" @click="changeNum('minus')">
                    <img src="../../assets/images/ticket/jian2x.png" alt="">
                </span>
                <input type="text"  v-model="num" readonly>
                <span class="operation" @click="changeNum('add')">
                    <img src="../../assets/images/ticket/jia2x.png" alt="">
                </span>
              </div>
            </div>
          </div>
          <!--配送方式-->
          <div class="mail-border">
            <div class=" mail-method ">
              <span>运费</span>
              <span class="fast-mail ">
                <span>¥&nbsp;{{product.productsFreight}}</span>
                <!--<i class="icon"></i>-->
              </span>
            </div>
          </div>
          <!--优惠券-->
          <div class="coupon-border" v-if="judgeCoupon">
            <div class="coupon " @click="coupon">
              <span>优惠券</span>
              <span class="preferential">
                <span v-if="getCouponFaceValue===0">请选择优惠券</span>
                <span v-if="getCouponFaceValue!==0">省{{getCouponFaceValue}}元优惠券</span>
                <i class="icon"></i>
              </span>
            </div>
          </div>
          <!--价格小计-->
          <div class="count-price ">
            <span style="display: inline-block;height: 100%;line-height: 0.81rem;">共
              <span >{{num}}</span>件商品&nbsp;&nbsp;
            </span>
            <span style="display: inline-block;height: 100%;line-height: 0.81rem;">
                小计:
                <span>
                  <i class="price-sign">¥</i>
                  <span class="money" >{{(getTotalPrice).toFixed(2)}}</span>
                </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!--合计金额-->
    <div class="total-price clearfix">
      <span class="sure-total-price">合计金额：
          <i class="price-sign">&yen;</i>
        <span class="money">{{(getTotalPrice).toFixed(2)}}</span>
      </span>
      <span class="btn-sub" @click="subOrder">
          提交订单
      </span>
    </div>
    <coupon-level :couponType="couponType" ref="coupon"></coupon-level>
  </div>
</template>
<script>
  const SUCCESS_OK = "rest.success"
  import CouponLevel from '../../components/couponLevel.vue';
  import { mapGetters, mapMutations } from 'vuex'
  import { selectMerchantProductsById, creatCommodityOrder, selectDefaultAddress, selectConpouUserListByMoble } from '@/utils/lkfetch'
  import { weixinPay } from '@/utils/wfetch'
  export default {
    name: 'orderConfirm',
    data() {
      return {
        couponType: 1,
        num: 1,
        receivingInfo: {},
        product: {},
        totalPrice: 0,
        mallName: '',
        isCoupon: true,
        allTotalPrice: 0,
        watchPrice: 0
      }
    },
    computed: {
      ...mapGetters(['getProductId', 'getSellerId', 'getCouponId', 'getCouponFaceValue', 'getSellerName', 'getIsChoose', 'getAddressId', 'getAddress', 'getAddressName', 'getAddressTel', 'getCouponId', 'getCouponLimit']),
      getTotalPrice() {
        this.allTotalPrice = this.num * this.product.productsPrice - this.getCouponFaceValue + this.product.productsFreight;
        if (this.allTotalPrice < 0) {
          this.allTotalPrice = 0
        }
        return this.allTotalPrice
      },
      judgeCoupon() {
        if (this.isCoupon == true) {
          return true
        } else if (this.isCoupon == false) {
          return false
        }
      },
      getWatchPrice() {
        this.watchPrice = this.num * this.product.productsPrice + this.product.productsFreight;
        if (this.watchPrice < 0) {
          this.watchPrice = 0
        }
        return this.watchPrice
      }
    },
    created() {
      this._selectConpouUserListByMoble()
      /* 查询收货默认地址 */
      selectDefaultAddress().then(res => {
        if (res.code == SUCCESS_OK) {
          //   console.log(res.result)
          this.addressId(res.result.id)
          this.address(res.result.address);
          this.addressName(res.result.userName);
          this.addressTel(res.result.contactNumber);
          // console.log(this.getAddress);
        } else {
          this.showAlert('连接失败')
        }
      });
      /* 获取商品信息 */
      selectMerchantProductsById({ id: this.getProductId }).then(res => {
       //  console.log(res.result)
        if (res.code === SUCCESS_OK) {
          this.product = res.result;
          this.totalPrice = this.num * this.product.productsPrice;
        } else {
          this.showAlert(res.error);
        }
      });
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
      ...mapMutations(['couponFaceValue', 'orderDetailType', 'buyCount', 'subtotal', 'addressId', 'address', 'addressName', 'addressTel', 'couponId', 'isChooseAddress', 'limitPrice',
      'couponLimit']),
      jump: function(url, num, totalPrice) {
        this.$router.push(url)
        this.buyCount(num);
        this.subtotal(totalPrice)
      },
      chooseAddress() {
        this.isChooseAddress(1);
        this.$router.push('/member/setAddress');
      },
      coupon: function() {
        $('#coupon_leave').show()
        this.limitPrice(this.getWatchPrice)
      },
      // 订单数量加减
      changeNum: function(type) {
        if (type === 'add') {
          this.num = this.num + 1
        } else {
          if (this.num <= 1) {
            this.num = 1;
            this.showAlert('不能再减少了')
            return false
          }
          this.num = this.num - 1
        }
        this.totalPrice = this.num * this.product.productsPrice - this.getCouponFaceValue;
      },
      // 提交订单信息
      subOrder: function() {
        var myThis = this
        var params = {
          "addressId": this.getAddressId,
          "couponId": this.getCouponId,
          "expressPrice": this.product.productsFreight,
          "merchantProductsList": [
            {
              "businessId": this.product.businessId,
              "commodityName": this.product.productsName,
              "commodityPrice": this.totalPrice,
              "merchantProductsId": this.product.id,
              "originalPrice": this.product.originalPrice,
              "num": this.num
            }
          ]
        };
        console.log(this.getAddressId)
        if (this.num < 1) {
          this.showAlert("亲，您还未购物呢");
        } else if (this.getAddressId == null) {
          this.showAlert("亲，请选择您的收货地址呢");
        } else {
          creatCommodityOrder(params).then(res => {
            if (res.code === SUCCESS_OK) {
              if (res.result.expressPrice > 0) {
                //   console.log(res)
              // 设置进入订单详情页面的状态
                this.orderDetailType(0)
                var params = { orderId:res.result.id, orderType:res.result.orderType }
                weixinPay(params).then(ress => {
              //   console.log(ress)
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
                            myThis.$router.push({ path: '/order' })
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
                this.showAlert('支付成功')
                setTimeout(() => {
                  this.$router.push({ path: '/order' })
                }, 500)
              }
            } else {
              myThis.showAlert(res.desc);
              myThis.couponId('')
              myThis.couponFaceValue(0)
              myThis._selectConpouUserListByMoble()
            }
            // console.log(res);
          });
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
            } else {
              this.isCoupon = true
            }
          } else {
            this.showAlert(res.desc)
          }
        })
      }
    },
    components: {
      CouponLevel
    },
    destroyed() {
      this.couponFaceValue(0)
      this.couponId('')
      this.addressId('')
      this.address('');
      this.addressName('');
      this.addressTel('');
    }
  }
</script>
<style scoped lang="less">
  .warp{
    background: #F7F7F7;
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
  .contacts{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.2rem 0.4rem 0.21rem;
    margin-bottom: 0.2rem;
  }
  .receiving-address{
    width:0.30rem;
    height: 0.38rem;
    margin-right: 0.2rem;
  }
  .receiving-address img{
    width: 100%;
    height: 100%;
  }
  .consignee{
    float: right;
    width: 90%;
  }
  .consignee p:first-child{
    margin-bottom: 0.2rem;
  }
  .consignee span{
    font-size: 0.27rem;
  }
  .consigneeTel{
    float: right;
  }
  .item-list{
    width: 100%;
    margin-bottom: 0.8rem;
    background: #f7f7f7;
  }
  .item-list>div{
    background: #fff;
  }
  .spot-border{
    padding: 0 0.23rem;
    border-bottom: 0.01rem solid #F6F6F6;
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
  .spot-name{
    padding: 0.1rem 0;
    height: 0.86rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .spot-name>div.left{
    width: 0.36rem;
    height: 0.32rem;
  }
  .spot-name>div.left img{
    width: 100%;
    height: 100%;
  }
  .spot-name p.left{
    font-size: 0.25rem;
    margin-left: 0.25rem;
  }
  .detail-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .detail-item>.img-show{
    width: 1.48rem;
    height: 1.48rem;
    /*margin-right: 4%;*/
  }
  .detail-item .img-show img{
    width: 100%;
    height: 100%;
  }
  .detail-info{
    width: 5.18rem;
  }
  .detail-title{
    line-height: .5rem;
  }
  .detail-size{
    margin: 0.05rem 0 0 0;
  }
  .detail-color{
    color: #B0B0B0;
  }
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
  .customary{
    text-decoration: line-through;
  }
  .count-operation>input,.fast-mail,.preferential{
    font-size: 0.28rem;
  }
  .icon{
    display: inline-block;
    width: 0.14rem;
    height: 0.24rem;
    background: url("../../assets/images/map/arrow@2x.png");
    background-size: cover;
    margin-left: 0.2rem;
  }
  .count-border{
    width: 100%;
    padding-left: .2rem;
  }
  .buy-count{
    padding-right: .2rem;
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
  }
  .mail-border{
    padding-left: .2rem;
  }
  .mail-method,.coupon{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right:.2rem ;
  }
  .mail-method,.coupon-border{
    border-bottom: 0.01rem solid #F6F6F6;
  }
  .coupon-border{
    padding-left: .2rem;
  }
  .details-info>.count-price{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 0.81rem;
    padding: 0 .2rem;
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

</style>
