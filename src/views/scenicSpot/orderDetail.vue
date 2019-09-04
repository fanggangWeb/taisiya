<template>
  <!-- 点餐订单详情-->
  <div class="warp">
    <!-- top search-->
    <div class="content">
        <div class="order_detail" >
            <div class="park_detail">
              <div class="img">
                <img :src="parkUrl.url"/>
              </div>
              <div class="text">
                <p class="title">{{park.parkName}}</p>
                <p class="address">{{park.address}}</p>
                <p class="time">{{park.openTime}} </p>
              </div>
            </div>
            <div class="order_detail_money">
              <div class="order_header">
                <h5>订单信息</h5>
                <h5 class="order_state" v-if="order.orderStatue === 7">退款中</h5>
                <h5 class="order_state" v-if="order.orderStatue === 8">已退款</h5>
                <h5 class="order_state" v-if="order.isPay === 1&&order.orderStatue!==7&&order.orderStatue!==8">已付款</h5>
                <h5 class="order_state" v-if="order.isPay === 0&&order.orderStatue!==7&&order.orderStatue!==8">待付款</h5>
              </div>
              <div class="order_header" v-if="order.orderStatue!==7&&order.orderStatue!==8">
                <h5 style="font-weight:bold">兑换码：{{order.tickUseCode}}</h5>
                <h5 class="order_state">
                  <span v-if="order.orderStatue==1">未兑换</span>
                  <span v-if="order.orderStatue==2">已兑换</span>
                </h5>
              </div>
              <p>门票数量：{{order.num}}</p>
              <p>优惠金额：￥{{order.actualPrice}}</p>
              <p>实付金额：￥{{order.paymentPrice}}</p>
              <p>订单编号：{{order.orderId}}</p>
              <p>下单时间：{{order.creatTime}}</p>
              <p v-if="order.endTime">购买时间：{{order.endTime}}</p>
              <p class="warning" style="color:#999;margin-top:10px;">说明：进入公园时请展示此页面</p>
            </div>
          <!--<div class="client_service">
            <h5>客服中心</h5>
            <span></span>
          </div>-->
        </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  const SUCCESS_OK = 'rest.success'
  import { selectTicketOrderDetail } from '@/utils/wfetch'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        order: {},
        park:{},
        parkUrl:{},
        type: ''
      }
    },
    methods: {
      jump: function(url) {
        this.$router.push(url)
      },
      getOrderDetail:function() {
        selectTicketOrderDetail({ id: this.getParkOrderId }).then(res => {
          if (res.code == SUCCESS_OK) {
            this.order = res.result
            this.park = res.result.park
            this.parkUrl = this.park.fileUpload
            // console.log(res.result)
            if (res.result.isPay === 1)  {
              this.type = '已付款'
            } else {
              this.type = '未付款'
            }
          } else {
            this.showAlert('连接数据库失败')
          }
        })
      }
    },
    computed: {
      ...mapGetters(['getParkOrderId'])
    },
    created:function() {
      this.getOrderDetail()
    }

  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .content {
    text-align: left;
    height: calc(13.34rem - 60px);
    background: #ebebeb;
    .order_detail {
      position: relative;
      top: .32rem;
      height: 7.2rem;
      margin:0 .37rem;
      background: url("../../assets/images/parkBg2x.png") no-repeat;
      background-size: 100% ;
      padding-top:.43rem;
      .park_detail{
        padding: 0 .23rem .66rem .23rem ;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .img {
          width: 1.46rem;
          height: 1.46rem;
          img {
            width: 100%;
            height: 100%;
            border-radius: 0.1rem;
          }
        }
        .text {
          margin-left: .3rem;
          width: 4.58rem;
          text-align: left;
          p {
            font-size: .22rem;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .address{
            margin-top: .05rem;
          }
          .address,.time{
            line-height: .4rem;
          }
          .title{
            color: #626161;
            font-size: .36rem;
            font-weight: 600;
            /*height: .46rem;*/
            line-height: .5rem;
          }
          .time{
            background: url("../../assets/images/timeGrey2x.png") no-repeat center left;
            background-size:0.22rem 0.23rem ;
            padding-left: 0.41rem;
          }
          .address{
            background: url("../../assets/images/mapGrey2x.png") no-repeat center left;
            background-size:0.2rem 0.25rem ;
            padding-left: 0.41rem;
          }
          span {
            font-size: .24rem;
            color: #999999;
            position: relative;
            top: .15rem;
          }
        }
        border-bottom: .01rem dashed #f0f0f0;
      }
      .order_detail_money{
        padding: 0 .23rem 0rem .23rem ;
        border-bottom: .01rem solid #f0f0f0;
        background: #fff;
        margin-top: .6rem;
        color: #4D4D4D;
        .order_header{
          display: flex;
          align-items: center;
          justify-content: space-between;

          h5{
            font-size: .3rem;
            margin-bottom: .16rem;
          }
          .order_state{
            color: #EC4747;
          }
        }
        p{
          font-size: .24rem;
          margin-bottom: 5px;
          }
      }
   /*   .client_service{
        background: #fff;
        height: 1rem;
        border-radius:0 0 0.15rem 0.15rem;
        padding: 0 .23rem 0 .23rem ;
        display: flex;
        justify-content: space-between;
        align-items: center;
          h5{
            color: #4D4D4D;
            font-size: .3rem;
            font-weight: 600;
          }
        span{
          display: block;
          width: .12rem;
          height: .22rem;
          background: url("../../assets/images/go-icon.png");
          background-size: 100% 100%;
        }
      }*/
    }
  }


</style>
