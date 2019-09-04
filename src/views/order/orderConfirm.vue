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
                <img :src=product.picUrl[0] alt="">
              </div>
              <!--右侧详情-->
              <div class="detail-info ">
                <p class="detail-title">{{product.productsName}}</p>
                <p class="detail-size detail-color"><span>大款</span>
                  /
                  <span>黑色</span>
                </p>
                <p class="detail-price">
                  <i class="price-sign">¥</i>
                  <span>{{product.productsPrice}}</span>&nbsp;
                  <span class=" detail-color customary">¥{{product.originalPrice}}</span>
                  <span class=" detail-color count-show float-right">x<i>1</i></span>
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
                <input type="text" :value=num>
                <span class="operation" id="add"  @click="changeNum('add')">
                    <img src="../../assets/images/ticket/jia2x.png" alt="">
                </span>
              </div>
            </div>
          </div>

          <!--优惠券-->
          <div class=" coupon-border">
            <div class="coupon " @click="coupon()">
              <span>优惠券</span>
              <span class="preferential ">
                  <span v-if="getCouponFaceValue===0">请选择</span>
                  <span v-if="getCouponFaceValue!==0">省{{getCouponFaceValue}}元优惠券</span>
                <i class="icon"></i>
              </span>
            </div>
          </div>
          <!--价格小计-->
          <div class="count-price ">
            <span>共
                <span>{{num}}</span>件商品&nbsp;&nbsp;
            </span>
            <span>
                小计:
                <span>&nbsp;
                    <i class="price-sign">¥</i>
                    <span class="money">{{productTotalPrice}}</span>
                </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!--合计金额-->
    <div class="total-price clearfix">
      <span class="sure-total-price">合计金额：
          <i class="price-sign">¥</i>
      <span class="money">{{productTotalPrice}}</span>
      </span>
      <span class="btn-sub" @click="subProductOrder">
          提交订单
      </span>
    </div>
    <CouponLevel></CouponLevel>
  </div>
</template>

<script>
  /* import CouponLevel from '../../components/couponLevel.vue';
  const SUCCESS_OK = "rest.success"
  import { mapGetters } from 'vuex'
  export default {
    name: 'orderConfirm',
    data() {
      return {
        sellerId: 0,
        num: 1,
        product: {},
        couponPrice: 7,
        price: 0,
        productTotalPrice: 0
      }
    },
    computed: {
      ...mapGetters(['getProductId', 'sellerId', 'getCouponFaceValue', 'getCouponId']),
      getTiketTotalPrice() {
        this.productTotalPrice = this.num * this.productDetail.price - this.getCouponFaceValue;
        if (this.productTotalPrice < 0) {
          this.productTotalPrice = 0
        }
        return this.productTotalPrice
      }
    },
    methods: {
      jump: function(url) {
        this.$router.push(url)
      },
      coupon: function() {
        $('#coupon_leave').show();
      },
      // 提交订单
      subProductOrder() {
        // 提交门票订单
        var parmas = {
          "couponId": this.getCouponId,
          "num": this.num,
          "productId": this.getProductId
        };
        if (this.num < 1) {
          this.showAlert("购买商品不能少于一件");
        } else {
          console.log(parmas);
          creatCommodityOrder(parmas).then(res => {
            if (res.code === SUCCESS_OK) {
              console.log(res);
              this.$vux.toast.text(res.desc);
            } else {
              this.showAlert(res.error);
            }
          });
          setTimeout(() => {
            this.jump('/scenicSpot/order')
          }, 1000)
        }
      }
    },
    created() {
      // 根据商品Id查询商品
      selectMerchantProductsById({ id: this.getProductId }).then(res => {
        if (res.code === SUCCESS_OK) {
          console.log(res)
          this.product = res.result;
        } else {
          this.showAlert(res.error);
        }
      });
    },
    components: {
      CouponLevel
    }
  }*/
</script>
<style scoped lang="less">
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
  .contacts{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.1rem 0.4rem 0.23rem;
    margin-bottom: 0.1rem;
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
    margin-right: 4%;
  }
  .detail-item .img-show img{
    width: 100%;
    height: 100%;
  }
  .detail-info{
    width: 5.18rem;
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
    width: 0.12rem;
    height: 0.22rem;
    background: url("../../assets/images/map/arrow@2x.png");
    background-size: cover;
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
  .mail-method,.coupon{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mail-method,.coupon-border{
    border-bottom: 0.01rem solid #F6F6F6;
  }
  .details-info>.count-price{
    display: flex;
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
    height: 1.2rem;
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
    font-size: 0.3rem;
  }

</style>
