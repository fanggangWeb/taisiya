<template>
  <div class="warp">
    <div class="body-container">
      <!--支付成功信息-->
      <div class="success-msg" v-if="order.orderStatue > 1">
        <div class="pay-success" v-if="getOrderDetailType === 0">
          <p v-if="order.isPay == 1">支付成功</p>
          <p>{{order.payTime}}</p>
        </div>
        <div class="pay-success" v-if="getOrderDetailType === 1">
          <p v-if="order.isPay == 0">待支付</p>
          <p v-if="order.isPay == 1 && order.orderStatue == 2">待发货</p>
          <p v-if="order.orderStatue == 3">待收货</p>
          <p v-if="order.orderStatue == 4">交易完成</p>
          <p v-if="order.orderStatue == 6">已取消</p>
          <p v-if="order.isPay == 0 && order.orderStatue == 2 && order.orderStatue != 6">{{order.creatTime}}</p>
          <p v-if="order.orderStatue == 2 && order.isPay == 1 && order.orderStatue != 6">{{order.payTime}}</p>
          <p v-if="order.orderStatue == 3 && order.isPay == 1 && order.orderStatue != 6">{{order.sendTime}}</p>
          <p v-if="order.orderStatue == 4 && order.isPay == 1 && order.orderStatue != 6">{{order.dealTime}}</p>
          <p v-if="order.logisticsCompany" style="margin-top:4px;">物流公司：{{order.logisticsCompany}}</p>
          <p v-if="order.logisticsNumber">物流单号：{{order.logisticsNumber}}</p>
          <p v-if="showState">物流信息：</p>
          <div class="express" v-for="(item,index) in expressList" :key="index">
            <p>{{item.datetime}}</p>
            <p>{{item.remark}}</p>
          </div> 
        </div>
       <!-- <i>
          <img src="../../assets/images/map/arrow@2x.png" alt="">
        </i>-->
      </div>
      <div class="bg"></div>
      <div class="info-background" style="margin-bottom:0.2rem;background:white;">
      </div>
      <!--联系人-->
      <div class="contacts info-background clearfix">
        <!--地图-->
        <div class="receiving-address float-left">
          <img src="../../assets/images/orderConfirm/location@2x.png" alt="">
        </div>
        <!--收货人-->
        <div class="consignee" v-if="address">
          <p class="clearfix">
            <span>收货人：
                <span id="consigneeName">{{address.userName}}</span>
            </span>
            <span id="consigneeTel" class="consigneeTel" v-if="address.contactNumber">{{address.contactNumber}}</span>
          </p>
          <p>
            <span  v-if="address.address">收货地址：
              <span>{{address.address}}</span>
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
            <p class="left">{{order.businessName}}</p>
          </div>
        </div>
        <!--订单商品-->
        <div class="details-info">
          <!--商品图+商品信息-->
          <div class="detail-border" @click="jump('detail', item.merchantProductsId)"  v-for="(item,index) in productList" :key="index">
            <div class="detail-item">
              <!--左侧图片-->
              <div class="img-show">
                <img :src="item.picUrl">
              </div>
              <!--右侧详情-->
              <div class="detail-info ">
                <p class="detail-title" v-if="item.commodityName.length < 36">{{item.commodityName}}</p>
                <p class="detail-title" v-else>{{item.commodityName.slice(0,36)}}...</p>
                <p class="detail-price">
                  <span class="price-sign"><font style="font-size: .2rem">￥</font>{{item.commodityPrice}}</span>
               <!--   <span>{{product.productsPrice}}</span>&nbsp;
                  <span class=" detail-color customary">¥{{order.paymentPrice}}</span>-->
                  <span class="  count-show float-right">x{{item.num}}</span>
                </p>
              </div>
            </div>
          </div>
          <!--配送方式-->
          <div class="mail-border">
            <div class=" mail-method">
              <span>邮费</span>
              <span class="fast-mail ">
                <span>￥{{order.expressPrice}}</span>
              </span>
            </div>
          </div>
          <!--优惠券-->
          <div class="coupon-border" v-if="order.deductible!=0">
            <div class="coupon ">
              <span>优惠券</span>
              <span class="preferential">￥{{order.deductible}}</span>
            </div>
          </div>
          <!--价格小计-->
          <div class="count-price ">
            <span class="pro-num">共{{totalNum}}件商品&nbsp;&nbsp;小计:&nbsp;</span>
            <div class="pro-xj">
              <span class="money" >
                <font style="font-size: .2rem; color: #FF4A26">￥</font>{{totalMoney.toFixed(2)}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--订单信息-->
      <div class="order-info">
        <p>订单编号: {{order.orderId}}</p>
        <p v-if="order.creatTime && order.orderStatue >= 2 && order.orderStatue != 6">下单时间: {{order.creatTime}}</p>
        <p v-if="order.orderStatue >= 2 && order.isPay == 1 && order.orderStatue != 6">付款时间: {{order.payTime}}</p>
        <p v-if="order.orderStatue >= 3 && order.isPay == 1 && order.orderStatue != 6">发货时间: {{order.sendTime}}</p>
        <p v-if="order.orderStatue == 4 && order.isPay == 1 && order.orderStatue != 6">成交时间: {{order.dealTime}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { selectOrderById } from '@/utils/wfetch'
  import { express } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'orderConfirm',
    data() {
      return {
        order:{},
        address:{},
        productList:[],
        expressList: [],
        totalMoney:0,
        totalNum:0,
        showState: false
      }
    },
    computed: {
      ...mapGetters(['getProductOrderId', 'getOrderDetailType'])
    },
    created() {
      selectOrderById({ id: this.getProductOrderId }).then(res => {
        console.log(res)
        if (res.code == SUCCESS_OK) {
          this.order = res.result
          this.address = res.result.userAddress
          this.productList = res.result.listMerchantProducts
          this.totalMoney = this.order.totalPrice + this.order.expressPrice - this.order.deductible
          for (var i = 0; i < this.productList.length; i++) {
             this.totalNum += this.productList[i].num
          }
          if (res.result.orderStatue >= 3 && res.result.orderStatue <= 5) {
            express({ id: res.result.id }).then(ress => {
              if (ress.code == SUCCESS_OK) {
                this.expressList = ress.result
                this.showState = true
              } else {
                // this.showAlert('物流信息不存在')
              }
            })
          }
        } else {
          this.showError('连接数据库出错')
        }
      })
    },
    methods: {
      ...mapMutations(['productId']),
      jump(url, id) {
        this.productId(id);
        this.$router.push({ path: url });
      }
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
  .success-msg {
    width: 100%;
    min-height: 1.85rem;
    background: white;
    height: auto;
    padding: 0.1rem 0.21rem 0.2rem 0.38rem;
    // background: url(../../assets/images/orderDetail/beijing@2x.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-bottom: 0.2rem;
  }
  .pay-success>p:first-child{
    font-size: 0.3rem;
    font-weight: bold;
    font-family: 'PingFang-SC-Bold';
    color: #000;
    line-height: .6rem;
  }
  .bg {
    width: 100%;
    height: 8px;
    background: url(../../assets/images/orderDetail/beijing.png);
  }
  // .pay-success>p:last-child{
  //   line-height: .54rem;
  //   font-size: 0.26rem;
  //   font-family: 'PingFang-SC-Bold';
  // }
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
    margin-bottom: 0.2rem;
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
  .detail-title{
   line-height: .5rem;
  }
  .detail-size{
    margin: 0.05rem 0 0 0;
    font-size: 0.22rem;
  }
  .detail-price{
    line-height: .68rem;
  }
  .detail-price  .price-sign{
    font-size: .4rem;
    color: #F8482D;
  }
  .detail-price .count-show{
    color: #ccc;
    font-size: .24rem;
  }
  .money{
    font-size: 0.4rem;
    color: #F8482D;
  }
  .customary{
    text-decoration: line-through;
    font-size: 0.22rem;
  }
  .fast-mail,.preferential{
    font-size: 0.28rem;
  }
  .buy-count{
    width: 100%;
    height: 0.81rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F6F6F6;
  }
  .count-number{
    text-align: center;
    font-size: 0.28rem;
  }
  .mail-border,
  .coupon-border,
  .count-price{
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
  .details-info .count-price{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 0.81rem;
  }
  .count-price .pro-num,.count-price .pro-xj{
    display: block;
    height: 0.81rem;
    line-height: .81rem;
  }
  .order-info{
    width: 100%;
    background: #fff;
    padding: 0.33rem 0 0.41rem 0.23rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 0.24rem;
    color: #666666;
    font-family: 'PingFang-SC-Medium';
  }
  .order-info p{
    line-height: .5rem;
  }
</style>
