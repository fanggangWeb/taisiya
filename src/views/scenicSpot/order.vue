<template>
  <!-- 订单列表-->
  <div class="warp" style="height:100%;width:100%">
    <!-- top search-->
    <div class="content">
      <div class="order_menu">
        <ul>
          <li :class="{'active':isPay ===''}" @click="changeType('')"><span>全部</span></li>
          <li :class="{'active':isPay ===1 }" @click="changeType(1)"><span>已付款</span></li>
          <li :class="{'active':isPay ===0 }" @click="changeType(0)"><span>待付款</span></li>
        </ul>
      </div>
      <div class="order_list">
        <div v-if="isData" style="margin-top:12px">您还没有订单哟~</div>
        <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
          <cube-index-list-item v-for="(item, index) in orderList" :key="index">
            <div class="shop_list_group" >
              <div @click="jump(item.id)">
                <div class="top">
                  <span class="title">
                    <span>{{item.parkName}}</span>
                  </span>
                  <span v-if="item.isPay === 1&&item.orderStatue!==7&&item.orderStatue!==8" class="status">已付款</span>
                  <span v-if="item.isPay === 0&&item.orderStatue!==7&&item.orderStatue!==8" class="status">待付款</span>
                  <span v-if="item.orderStatue === 7" class="status">退款中</span>
                  <span v-if="item.orderStatue === 8" class="status">已退款</span>
                </div>
                <div class="order_shop">
                  <div class="img">
                    <img :src="item.picDisplay"/>
                  </div>
                  <div class="info">
                    <div class="text">
                      <p class="time">{{item.openTime}}</p>
                      <p class="address">{{item.address}}</p>
                    </div>
                    <span class="price">￥{{item.originalPrice}}</span>
                    <span class="num">x{{item.num}}</span>
                  </div>
                </div>
                <div class="order_total">
                  共{{item.num}}张门票&nbsp;<span style="font-size:0.26rem;" v-if="item.actualPrice!=0">优惠￥{{item.actualPrice}}</span>&nbsp;&nbsp;合计:<span><font>￥</font>{{(item.originalPrice*item.num-item.actualPrice).toFixed(2)}}</span>
                </div>
              </div>
              <div class="btns clearfix">
                <div class="order_btn">
                  <button class="btn" @click="deleteOrder(item)" v-if="item.isPay === 0">删除订单</button>
                </div>
                <div class="order_btn" v-if="item.isPay === 0">
                  <button class="btn" @click="payOrder(item.id)">立即支付</button>
                </div>
                <div class="order_btn" v-if="item.isPay === 1 && item.orderStatue ===1">
                  <button class="btn" @click="refund(item)">申请退款</button>
                </div>
                <!-- <div class="order_btn" v-if="item.orderStatue ===7">
                  <div class="btn btn-red">退款中</div>
                </div>
                <div class="order_btn" v-if="item.orderStatue ===8">
                  <div class="btn btn-green">退款成功</div>
                </div> -->
              </div>
            </div>
          </cube-index-list-item>
        </cube-index-list>
      </div>
    </div>

  </div>
</template>

<script>
  // import { selectTicketOrderList } from '@/utils/lkfetch'
  import { getSenicOrder, delSenicOrder, weixinRefund } from '@/api/member'
  import { mapMutations } from 'vuex'
  import { weixinPay } from '@/utils/wfetch'
  const SUCCESS_OK = 'rest.success'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        isData: false,
        type: 0,
        orderList: [],
        num: 1,
        size: 5,
        isPay: '',
        options: {
          pullDownRefresh: {
            stop: 55,
            txt: '刷新成功'
          },
          pullUpLoad:  {
            txt: {
              more: '没有更多数据'
            }
          }
        }
      }
    },
    methods: {
      ...mapMutations(['parkOrderId']),
      changeType: function(num) {
        this.isPay = num;
        this._getSenicOrder()
        this.$refs.indexList.forceUpdate()
      },
      // 详情跳转
      jump: function(id) {
        this.parkOrderId(id);
        this.$router.push({ path: 'orderDetail' });
      },
      // 获取所有门票景点订单列表
      _getSenicOrder() {
        getSenicOrder(this.num, this.size, this.isPay).then(res => {
          // console.log(res)
          if (res.code == SUCCESS_OK) {
            this.orderList = res.result.list
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
            // this.$refs.indexList.forceUpdate()
          } else {
            this.showAlert('连接数据库失败')
          }
        })
      },
      // 申请退款
      refund(item) {
        const data = {
          orderId: item.id,
          orderType: '2'
        }
        this.showBtn('确定发起退款申请吗', this._weixinRefund, data)
      },
      _weixinRefund(data) {
        weixinRefund(data).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('退款成功，稍后金额将自动原路退回，请耐心等待。')
            this._getSenicOrder()
          } else {
            this.showAlert(res.desc)
          }
        })
      },
      // 支付订单
      payOrder(item) {
        const _orderId = item
        const that = this
        var params1 = { orderId:item, orderType:'2' }
        weixinPay(params1).then(ress => {
          if (ress.code === SUCCESS_OK) {
            /* eslint-disable no-undef*/
            var onBridgeReady = function() {
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                  "appId": ress.result.appId,     // 公众号名称，由商户传入
                  "timeStamp": ress.result.timeStamp,         // 时间戳，自1970年以来的秒数
                  "nonceStr": ress.result.nonceStr, // 随机串
                  "package": ress.result.package,
                  "signType": ress.result.signType,         // 微信签名方式：
                  "paySign": ress.result.sign  // 微信签名
                },
                function(res) {
                //  console.log(res)
                  if (res.err_msg == "get_brand_wcpay_request:ok") {
                    that.showAlert('支付成功');
                    that._getSenicOrder()
                    setTimeout(() => {
                      // this.jump('orderDetail', this.num, this.totalPrice);
                      that.parkOrderId(_orderId)
                      that.$router.push({ path: '/scenicSpot/orderDetail' })
                    }, 1000)
                    //  使用以上方式判断前端返回,微信团队郑重提示：
                    // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                  } else {
                    that.showAlert('支付失败')
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
            this.showAlert(ress.desc);
          }
        })
      },
      // 删除门票订单
      deleteOrder(item) {
        this.showBtn('确定删除该条订单吗', this._delSenicOrder, item.id)
      },
      _delSenicOrder(data) {
        delSenicOrder(data).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('删除订单成功')
            this._getSenicOrder()
            // this.$refs.indexList.forceUpdate()
          } else {
            this.showAlert('连接数据库失败')
          }
        })
      },
      onPullingDown() {
        this.num = 1
        setTimeout(() => {
          this._getSenicOrder()
          // Call forceUpdate after finishing data load.
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        this.num++
        setTimeout(() => {
          getSenicOrder(this.num, this.size, this.isPay).then(res => {
            if (res.code == SUCCESS_OK) {
              // 判断是否是最后一页
              if (res.result.total <= this.orderList.length) {
                this.showAlert('已为您加载全部数据')
                this.$refs.indexList.forceUpdate()
              } else {
                this.orderList = this.orderList.concat(res.result.list)
                this.$refs.indexList.forceUpdate()
              }
            } else {
              this.showAlert('连接数据库失败')
            }
          })
        }, 1000)
      }
    },
    created: function() {
    this._getSenicOrder()
      /* 查询门票订单列表 */
      // selectTicketOrderList(this.params).then(res => {
      //   this.orderList = res.result.list;
      // });
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .content {
    display: flex;
    height: 100%;
    flex-flow: wrap;
    background: #f4f4f4;
    .order_menu {
      width: 100%;
      background: #f4f4f4;
      ul {
        display: flex;
        flex-flow: nowrap;
        background: #f4f4f4;
        justify-content: space-around;
        li {
          height: .8rem;
          line-height: .8rem;
          font-size: .28rem;
          span {
            color: #999999;
            display: inline-flex;
          }
        }
        .active {
          span {
            color: #ffba00;
            height: calc(100% - .04rem);
            border-bottom: .04rem solid #ffba00;
          }
        }
      }
    }

    .order_list {
      width: 100%;
      height: calc(100% - 40px);
      .shop_list_group {
        background: white;
        width: 100%;
        .top {
          display: flex;
          flex-flow: nowrap;
          align-items: center;
          justify-content: space-between;
          padding: 0 .23rem;
          height: .86rem;
          .title {
            font-size: .3rem;
            color: #626161;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .status {
            font-size: .26rem;
            color: #ffba00;
          }
        }
        .order_shop {
          display: flex;
          flex-flow: nowrap;
          position: relative;
          padding: .12rem .2rem .16rem .21rem;
          .img {
            width: 2rem;
            height: 1.8rem;
            img {
              width: 100%;
              height: 100%;
              border-radius: 0.1rem;
            }
          }
          .text {
            width: 4.43rem;
            text-align: left;
            flex-grow: 0.2;
            position: relative;
            left: .24rem;
            p {
              font-size: .22rem;
              color: #999;
              line-height: .38rem;
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
          .price {
            position: absolute;
            right: .23rem;
            bottom: .3rem;
            font-size: .3rem;
            color: #333333;
            font-weight: 600;
          }
          .num {
            position: absolute;
            right: .23rem;
            bottom: 0.05rem;
            font-size: .24rem;
            color: #cccccc;
          }
        }
        .order_total {
          text-align: right;
          padding: 0 .23rem;
          height: .60rem;
          line-height: .40rem;
          font-size: .26rem;
          color: #666666;
          border-bottom: .01rem solid #f0f0f0;
          span {
            font-size: .4rem;
            color: #666666;
            padding-left: .2rem;
            font {
              font-size: .2rem;
            }
          }
        }
        .order_btn {
          float: right;
          padding: .21rem .22rem .19rem  0;
          height: auto;
          overflow: hidden;
          .btn {
            width:1.44rem ;
            height: .6rem;
            border: 0.01rem solid #BBB;
            float: right;
            font-size: .26rem;
            color: #666666;
            line-height: .6rem;
          }
          .btn-red{
            letter-spacing: 1px;
            color: red;
            border: none;
          }
          .btn-green {
            letter-spacing: 1px;
            color: green;
            border: none;
          }
         /* .pay{
            background-color: greenyellow;
            opacity: 0.8;
            color: #333;
          }*/
        }
      }
      .shop_list_group:last-child{
        margin-bottom: 0;
      }
    }
  }

</style>
