<template>
  <!-- 点餐订单详情-->
  <div class="warp">
    <!-- top search-->
    <div class="content">
        <div class="order_detail" >
          <div class="pad" style="padding:0.23rem;background-color:white">
            <h5>订单号：{{result.orderId}}</h5>
            <h5>使用码：{{result.orderCode}}</h5>
            <p style="font-size:12px;text-align:left;color:#999"> 请妥善保管使用码,就餐时出示</p>
            <div class="order_detail_list">
              <div v-for="(item,index) in foodList" :key="index">
                <p>
                  <span>{{item.name}} <font>x{{item.num}}</font></span>
                  <span>￥{{item.price * item.num}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="pad2" style="padding:0 0.23rem 0.23rem 0.23rem;background:white;
              border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;">
            <div class="order_detail_money">
              <span v-if="result.isPay == 0" class="pay paid">待付款</span>
              <span v-if="result.isPay==1 && result.orderStatus!= 2 " class="pay paid">已付款</span>
              <span v-if="result.orderStatus==2" class="pay paid">已使用</span>
              <h5>订单信息</h5>
              <p v-if="result.actualPrice != 0">优惠金额: ￥{{result.actualPrice}}</p>
              <!-- <p v-if="result.actualPrice == null">优惠金额: ￥0</p> -->
              <p v-if="result.paymentPrice">实付金额: ￥{{result.paymentPrice}}</p>
              <!-- <p>订单号: {{result.orderId}}</p> -->
              <p>下单时间: {{result.creatTime}}</p>
              <p v-if="result.payTime">支付时间: {{result.payTime}}</p>
              <p v-if="result.endTime">使用时间: {{result.endTime}}</p>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { selcetOrderDetail } from '@/api/member'
  const SUCCESS_OK = 'rest.success'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        type: false,
        foodList: [],
        result: {}
      }
    },
    computed: {
      ...mapGetters(['getFoodOrderId'])
    },
    methods: {
      _selcetOrderDetail() {
        selcetOrderDetail(this.getFoodOrderId).then(res => {
          if (res.code == SUCCESS_OK) {
            this.result = res.result
            this.foodList = res.result.foodViewList
            console.log(this.foodList)
          } else {
            this.showAlert('res.desc')
          }
        })
      }
    },
    mounted() {
      this._selcetOrderDetail()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .content {
    height: calc(13.34rem - 60px);
    background: #ebebeb;
    overflow-y: auto;
    .order_detail {
      position: relative;
      top: .32rem;
      height: auto;
      margin:0 .37rem;
      background: url("../../assets/images/order-bg.png") no-repeat;
      background-size: 100%;
      // padding: .23rem;
      h5{
        text-align: left;
        color: #010101;
        font-size: .36rem;
        font-weight: bold;
        margin-bottom: .1rem;
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
        .pay{
          position: relative;
          top: 20px;
          right: 0px;
          font-size: 16px;
          font-weight: 400;
          color: #999;
          float: right;
        }
        .paid{
          color: #EC4B4B
        }
        h5{
          margin-bottom: .2rem;
        }
        p{
          padding-bottom: .1rem ;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: .24rem;
        }
      }
    }
  }
</style>
