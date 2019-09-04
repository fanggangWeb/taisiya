<template>
  <!-- 订单列表-->
  <div class="warp">
    <!-- top search-->
    <div class="content">
      <div class="order_menu">
        <ul>
          <li v-for="(item, index) in navList" :class="{'active':index===currentIndex}" @click="changeType(item,index)" :key="index">
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="order_list">
        <div v-if="isData" style="margin-top:12px">您还没有订单哟~</div>
        <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
          <cube-index-list-group>
            <!-- <cube-index-list-item v-for="(item, index) in orderList" :key="index"> -->
            <cube-index-list-item v-for="(item, index) in orderList" :key="index">
              <div class="shop_list_item">
                <div class="top">
                  <span class="title">
                    <i>
                      <img src="../../assets/images/orderConfirm/stor@2x.png" alt="">
                    </i>
                    <span>{{item.businessName}}</span>
                  </span>
                  <span class="status" v-if="item.isPay==0">待支付</span>
                  <span class="status" v-if="item.isPay==1 && item.orderStatue==2">待发货</span>
                  <span class="status" v-if="item.orderStatue==3">已发货</span>
                  <span class="status" v-if="item.orderStatue==4">已收货</span>
                  <span class="status" v-if="item.orderStatue==6">已取消</span>
                  <!-- <span class="status">待发货</span> -->
                </div>
                <div class="order_shop" v-for="(goods, index) in item.listMerchantProducts" :key="index" @click="jump('/home/orderDetail',item.id)">
                  <div class="img"><img :src="goods.picUrl"/></div>
                  <div class="text">
                    <p>{{goods.commodityName}}</p>
                    <!-- <span>米黄；L</span> -->
                  </div>
                  <span class="price"><font>￥</font>{{goods.commodityPrice}}</span>
                  <span class="num">x{{goods.num}}</span>
                </div>
                <div class="order_total">
                  共{{item.listMerchantProducts.length}}种商品
                  <span v-if="item.deductible!=0" style="font-size:0.26rem;padding-left:0.1rem"> 优惠￥{{item.deductible}}</span>
                  合计:<span><font>￥</font>{{item.paymentPrice + item.expressPrice}}</span>
                  <span style="font-size:12px;color:#999;padding-right:0.1rem" v-if="item.expressPrice">(含运费￥{{item.expressPrice}})</span>
                </div>
                <div class="order_btn">
                  <button v-if="item.isPay==0" @click="cancelOrder(item)" class="btn btn_default">取消订单</button>
                  <button v-if="item.isPay==0" @click="payment(item)" class="btn btn_default">立即支付</button>
                  <button v-if="item.orderStatue==3" @click="confirmOrder(item)" class="btn btn_y">确认收货</button>
                  <button v-if="item.orderStatue==4 || item.orderStatue==6 " @click="deleteOrder(item)" class="btn btn_default">删除订单</button>
                  <!-- <button v-if="item.orderStatue==5" @click="returnOrder(item)" class="btn btn_y">申请退货</button> -->
                </div>
              </div>
            </cube-index-list-item>
          </cube-index-list-group>
        </cube-index-list>
      </div>
    </div>
  </div>
</template>
<script>
  import { getOrderList, cancelCommodity, confirmPro, delProOrder } from '@/api/member'
  import { setTimeout } from 'timers'
  import { mapMutations } from 'vuex'
  import { weixinPay } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        isData: false,
        num: 1,
        size: 5,
        navType: '',
        orderList: [],
        currentIndex: 0,
        options: {
          pullDownRefresh: {
            stop: 55,
            txt: '刷新成功'
          },
          pullUpLoad:  {
            txt: {
              more: ''
            }
          }
        },
        navList: [{
          type: '',
          name: '全部'
        }, {
          type: 2,
          name: '待发货'
        }, {
          type: 3,
          name: '待收货'
        }, {
          type: 4,
          name: '已完成'
        }, {
          type: 6,
          name: '已取消'
        }]
      }
    },
    methods: {
      changeType(item, index) {
        this.currentIndex = index
        this.navType = item.type
        this.num = 1
        this._getOrderList(this.navType)
      },
      ...mapMutations(['productOrderId', 'orderDetailType', 'proPayState']),
      jump(url, id) {
        // 设置进入订单详情页面的状态
        this.orderDetailType(1)
        this.productOrderId(id)
        this.$router.push({ path: url });
      },
      // 获取商品订单列表
      _getOrderList(type) {
        getOrderList(type, this.num, this.size).then(res => {
      //    console.log(res)
          if (res.code == SUCCESS_OK) {
        //   console.log(res)
            this.orderList = res.result.list
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
            this.forceUpdateList()
          } else {
            this.showError('连接数据库出错')
          }
        })
      },
      // 点击立即支付
      payment(item) {
        var params = { orderId:item.id, orderType:'1' }
        const myThis = this
        weixinPay(params).then(ress => {
        //   console.log(ress)
          if (ress.code === SUCCESS_OK) {
            /* eslint-disable no-undef*/
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
                  // 刷新列表
                  myThis.num = 1
                  myThis._getOrderList(myThis.navType)
                  // setTimeout(() => {
                  //   this.jump('orderDetail', this.num, this.totalPrice);
                  // }, 1000)
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
      },
      // 取消订单
      cancelOrder(item) {
        this.showBtn('确定取消订单吗', this._cancelOrder, item.id)
      },
      // 确定收货
      confirmOrder(item) {
        this.showBtn('确定要收货吗', this._confirmPro, item.id)
      },
      // 删除订单
      deleteOrder(item) {
        this.showBtn('确认要删除订单吗，该操作无法撤销', this._delProOrder, item.id)
      },
      // 申请退货
      returnOrder(item) {
        this.showBtn('确定要申请退货吗')
      },
      // 上拉下滑列表强制刷新
      forceUpdateList() {
        this.$refs.indexList.forceUpdate()
      },
      // 取消订单的接口封装
      _cancelOrder(data) {
        cancelCommodity(data).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('取消订单成功')
            this.num = 1
            this._getOrderList(this.navType)
            this.forceUpdateList()
          } else {
            this.showAlert('连接数据库失败，请重试')
          }
        })
      },
      // 确认收货的接口封装
      _confirmPro(data) {
        confirmPro(data).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('确认收货成功')
            this.num = 1
            this._getOrderList(this.navType)
            this.forceUpdateList()
          } else {
            this.showAlert(res.desc)
          }
        })
      },
      // 删除订单的接口封装
      _delProOrder(data) {
        delProOrder(data).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('删除订单成功')
            this.num = 1
            this._getOrderList(this.navType)
            this.forceUpdateList()
          } else {
            this.showAlert(res.desc)
          }
        })
      },
      // 下拉刷新
      onPullingDown() {
        this.num = 1
        setTimeout(() => {
          this._getOrderList(this.navType)
        }, 1000);
      },
      // 上滑加载更多
      onPullingUp() {
        this.num++
        setTimeout(() => {
          getOrderList(this.navType, this.num, this.size).then(res => {
            if (res.code == SUCCESS_OK) {
              if (res.result.total <= this.orderList.length) {
                this.showAlert('已为您加载全部数据')
              } else {
                this.orderList = this.orderList.concat(res.result.list)
              }
            } else {
              this.showError('连接数据库出错')
            }
            this.forceUpdateList()
          })
        }, 1000);
      },
      // 显示加载错误
      showError(msg) {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: msg
        }).show()
      }
    },
    mounted() {
      this._getOrderList(this.navType)
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .content {
    // display: flex;
    // flex-flow: wrap;
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    .order_menu {
      width: 100%;
      background: #f4f4f4;
      ul {
        display: flex;
        flex-flow: nowrap;
        background: #f4f4f4;
        li {
          width: 25%;
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
      .shop_list_item {
        background: white;
        width: 100%;
        .top {
          display: flex;
          flex-flow: nowrap;
          align-items: center;
          justify-content: space-between;
          padding: 0 .23rem;
          height: .86rem;
          border-bottom: .01rem solid #f0f0f0;
          .title {
            font-size: .26rem;
            color: #333333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
              width: .36rem;
              height: .32rem;
              margin-right: .15rem;
              img {
                width: 100%;
                height: 100%;
              }
            }
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
          //align-items: center;
          //justify-content: space-between;
          padding: .32rem .23rem;
          border-bottom: .01rem solid #f0f0f0;
          .img {
            width: 1.5rem;
            height: 1.5rem;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .text {
            width: 3.5rem;
            text-align: left;
            flex-grow: 0.2;
            position: relative;
            left: .24rem;
            p {
              font-size: .26rem;
              color: #333333;
              line-height: .5rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
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
            top: .32rem;
            font-size: .4rem;
            color: #333333;
            font {
              font-size: .2rem;
            }
          }
          .num {
            position: absolute;
            right: .23rem;
            bottom: .32rem;
            font-size: .24rem;
            color: #cccccc;
          }
        }
        .order_coupon {
          text-align: right;
          padding: 0 .1rem;
          padding-right: 0.63rem;
          height: .40rem;
          line-height: .40rem;
          // border-bottom: .01rem solid #f0f0f0;
          font-size: .26rem;
          color: #666666;
        }
        .order_total {
          text-align: right;
          padding: 0 .23rem;
          height: .80rem;
          line-height: .80rem;
          border-bottom: .01rem solid #f0f0f0;
          font-size: .26rem;
          color: #666666;
          span {
            font-size: .4rem;
            color: #333333;
            padding-right: .24rem;
            font {
              font-size: .2rem;
            }
          }
        }
        .order_btn {
          padding: .11rem .23rem 0.11rem .23rem;
          height: auto;
          overflow: hidden;
          button {
            float: right;
            margin-left: .1rem;
          }
        }
      }
    }
  }
  .warp {
    height: 100%;
    width: 100%;
  }
  .content .cube-index-list-anchor {
    padding: 0px !important;
  }
  .cube-index-list-group {
    background: #f4f4f4 !important;
  }
  .cube-index-list-item {
    margin-bottom: 20px !important;
  }
</style>
