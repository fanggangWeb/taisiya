<template>
  <!-- 订单列表-->
  <div class="warp" style="height: 100%">
    <!-- top search-->
    <div class="content">
      <div class="navbar">
        <div class="navbar_item" v-for="(item, index) in navList" :key="index" @click="changeType(item, index)" :class="{'active': currentIndex == index}">
          <span>{{item.name}}</span>
        </div>
      </div>
      <div class="order_food_list">
        <div v-if="isData" style="margin-top:12px">您还没有订单哟~</div>
        <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
          <cube-index-list-item v-for="(item, index) in orderList" :key="index">
            <div class="order_item" @click="viewDetail(item)">
              <div class="top top-color" v-if="item.isPay==0">待付款</div>
              <div class="top top-color" v-if="item.isPay==1 && item.orderStatue!=2">已付款</div>
              <div class="top top-color" v-if="item.orderStatue==2">已使用</div>
              <div class="order_list_data">
                <p>订单号：{{item.orderId}}</p>
                <p>下单时间：{{item.creatTime}}</p>
                <p v-if="item.paymentPrice">总价：￥{{item.paymentPrice.toFixed(2)}}</p>
                <p v-if="item.deductible!=0">优惠券：￥{{item.deductible.toFixed(2)}}</p>
                <!-- <p>使用码：￥{{item.orderCode}}</p> -->
              </div>
              <div class="order_btn">
                <button v-if="item.isPay==0" @click.stop="payment(item)" class="btn btn_default">立即支付</button>
                <button v-if="item.orderStatue==2 || item.orderStatue==3" @click.stop="deleteOrder(item)" class="btn btn_default">删除订单</button>
                <button v-if="item.isPay==0" @click.stop="cancelOrder(item)" class="btn btn_default">取消订单</button>
              </div>
            </div>
          </cube-index-list-item>
        </cube-index-list>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapMutations } from  'vuex'
  import { selectFoodOrderList, deleteFoodOrderByIds } from '@/api/member'
  import { weixinPay } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        isData: false,
        orderList: [],
        isPay: '',
        orderState: '',
        navList: [{ name: '全部', isPay: '', orderState: '' }, { name: '待付款', isPay: 0, orderState: '' }, { name: '已付款', isPay: 1, orderState: '' }, { name: '已使用', isPay: '', orderState: 2 }],
        navValue: '',
        currentIndex: 0,
        type: false,
        cancelType: 0,
        num:1,
        size: 5,
        pullDownRefresh: '',
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
        }
      }
    },
    methods: {
      ...mapMutations(['foodOrderId']),
      changeType(item, index) {
        this.currentIndex = index
        this.orderState = item.orderState
        this.isPay = item.isPay
        this.num = 1
        this._selectFoodOrderList()
      },
      viewDetail(item) {
        this.foodOrderId(item.id)
        this.$router.push({ path: '/orderFood/detail' })
      },
      // 加载列表
      _selectFoodOrderList() {
        this.orderList = []
        selectFoodOrderList(this.num, this.size, this.isPay, this.orderState).then(res => {
          if (res.code == SUCCESS_OK) {
            // console.log(res)
            this.orderList = res.result.list
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
            this.$refs.indexList.forceUpdate()
          } else {
            this.showAlert(res.error);
          }
        })
      },
      // 取消删除订单封装
      _deleteFoodOrderByIds(id) {
        const data = { id: id, cancelType: this.cancelType }
        deleteFoodOrderByIds(data).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('操作成功')
            this._selectFoodOrderList()
          } else {
            this.showAlert(res.desc)
          }
        })
      },
      loadMore() {
        selectFoodOrderList(this.num, this.size, this.isPay, this.orderState).then(res => {
          if (res.code === SUCCESS_OK) {
            if (res.result.total <= this.orderList.length) {
              this.showAlert('已为您加载全部数据')
            } else {
              this.orderList = this.orderList.concat(res.result.list)
            }
          } else {
            this.showAlert(res.desc);
          }
        })
      },
      // 下拉刷新
      onPullingDown() {
        // Mock async load.
        this.num = 1
        setTimeout(() => {
          this._selectFoodOrderList()
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      // 上滑加载更多
      onPullingUp() {
        this.num++
        // Mock async load.
        setTimeout(() => {
          this.loadMore()
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      // 删除订单
      deleteOrder(item) {
        this.cancelType = 2
        this.showBtn('确认要删除订单吗，该操作无法撤销', this._deleteFoodOrderByIds, item.id)
      },
      // 取消订单
      cancelOrder(item) {
        this.cancelType = 1
        this.showBtn('确认要取消订单吗，该操作无法撤销', this._deleteFoodOrderByIds, item.id)
      },
      // 点击立即支付
      payment(item) {
        const myThis = this
        var params = { orderId: item.id, orderType:'3' }
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
                  setTimeout(() => {
                    myThis.num = 1
                    myThis._selectFoodOrderList()
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
            this.showAlert(ress.desc);
          }
        })
      }
    },
    mounted() {
      this._selectFoodOrderList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .content {
    display: flex;
    flex-flow: wrap;
    height: 100%;
    .navbar {
      width: 100%;
      height: 0.8rem;
      display: flex;
      background: #f4f4f4;
      .navbar_item {
        flex: 1;
        height: 100%;
        font-size: 0.28rem;
        line-height: 0.8rem;
        text-align: center;
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
    .order_food_list {
      width: 100%;
      height: 100%;
      // padding-bottom: 10px;
      ul{
        padding: 0 0.23rem;
        li{
          // margin: 0 .23rem;
          margin-bottom: .3rem;
          box-shadow: 1px 1px 5px 1px #eeeeee;
          .top{
            height: .82rem;
            line-height: .82rem;
            text-align: left;
            padding-left: .23rem;
            border-bottom: .01rem solid #f0f0f0;
            font-size: .3rem;
          }.top-color{
             color: #FF7676;
           }
          .order_list_data{
            padding-left: .23rem;
            padding-bottom: .25rem;
            border-bottom: .01rem solid #f0f0f0;
            p{
              text-align: left;
              padding-top: .25rem;
              font-size: .3rem;
              color: #727272;
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
  }
  
</style>
